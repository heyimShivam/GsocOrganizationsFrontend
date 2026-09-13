"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Bookmark,
    Check,
    Code2,
    ExternalLink,
    Github,
    Layers3,
    Pencil,
    Quote,
    Share2,
    Trash2,
    X,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { SiteHeader } from "@/components/SiteHeader";
import { Organization } from "@/types/Organization";
import { OrgCard } from "@/components/OrgCard";
import "@/css/Profile.css";

type OrganizationResponse = {
    data: Organization;
};

type EditProfileData = {
    name: string;
    description: string;
    quote: string;
    githubUsername: string;
};

export default function ProfilePage() {
    const {
        user,
        setUser,
        refreshUser,
        loading: authLoading,
    } = useAuth();

    useEffect(() => {
        refreshUser();
    }, []);

    const [organizations, setOrganizations] =
        useState<Organization[]>([]);

    const [organizationsLoading, setOrganizationsLoading] =
        useState(false);

    const [organizationsError, setOrganizationsError] =
        useState(false);

    const [editModalOpen, setEditModalOpen] =
        useState(false);

    const [savingProfile, setSavingProfile] =
        useState(false);

    const [removingBookmark, setRemovingBookmark] =
        useState<string | null>(null);

    const [editForm, setEditForm] =
        useState<EditProfileData>({
            name: "",
            description: "",
            quote: "",
            githubUsername: "",
        });

    const handleShareProfile = async () => {
        if (!user?.githubUsername?.trim()) {
            return;
        }

        const publicProfileUrl =
            `${window.location.origin}/user-profile/${encodeURIComponent(
                user.githubUsername.trim()
            )}`;

        try {
            await navigator.clipboard.writeText(
                publicProfileUrl
            );

            toast.success("Profile link copied!", {
                description:
                    "Your public profile link has been copied to the clipboard.",
            });
        } catch (error) {
            console.error(
                "Failed to copy profile link:",
                error
            );

            toast.error("Couldn't copy profile link", {
                description:
                    "Please copy the profile URL manually.",
            });
        }
    };

    /*
     * Load bookmarked organizations
     */
    useEffect(() => {
        if (!user) {
            return;
        }

        const loadOrganizations = async () => {
            if (
                !user.bookmarkedOrganizationIds ||
                user.bookmarkedOrganizationIds.length === 0
            ) {
                setOrganizations([]);
                return;
            }

            setOrganizationsLoading(true);
            setOrganizationsError(false);

            try {
                const requests =
                    user.bookmarkedOrganizationIds.map(
                        async (organizationId) => {
                            const response =
                                await fetch(
                                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}`,
                                    {
                                        method: "GET",
                                    }
                                );

                            if (!response.ok) {
                                throw new Error(
                                    `Failed to fetch organization ${organizationId}`
                                );
                            }

                            const result: OrganizationResponse =
                                await response.json();

                            return result.data;
                        }
                    );

                const results =
                    await Promise.all(requests);

                setOrganizations(results);
            } catch (error) {
                console.error(
                    "Failed to load bookmarked organizations:",
                    error
                );

                setOrganizationsError(true);
            } finally {
                setOrganizationsLoading(false);
            }
        };

        loadOrganizations();
    }, [user]);

    /*
     * Open edit modal with current user data
     */
    const openEditModal = () => {
        if (!user) {
            return;
        }

        setEditForm({
            name: user.name || "",
            description: user.description || "",
            quote: user.quote || "",
            githubUsername:
                user.githubUsername || "",
        });

        setEditModalOpen(true);
    };

    /*
     * Update profile field
     */
    const handleEditChange = (
        field: keyof EditProfileData,
        value: string
    ) => {
        setEditForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    /*
     * PATCH profile
     */
    const handleProfileUpdate = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!user) {
            return;
        }

        setSavingProfile(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name: editForm.name,
                        description:
                            editForm.description,
                        quote: editForm.quote,
                        githubUsername:
                            editForm.githubUsername,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Profile update failed: ${response.status}`
                );
            }

            /*
             * Backend may return the updated user.
             */
            const updatedUser =
                await response.json();

            setUser({
                ...user,
                ...updatedUser,
            });

            setEditModalOpen(false);

            toast.success(
                "Profile updated successfully!",
                {
                    description:
                        "Your profile changes have been saved.",
                }
            );
        } catch (error) {
            console.error(
                "Profile update error:",
                error
            );

            toast.error(
                "Failed to update profile",
                {
                    description:
                        "Something went wrong. Please try again.",
                }
            );
        } finally {
            setSavingProfile(false);
        }
    };

    /*
     * Remove bookmark
     */
    const handleRemoveBookmark = async (
        organizationId: string
    ) => {
        if (!user) {
            return;
        }

        setRemovingBookmark(organizationId);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me/bookmarks/${organizationId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Remove bookmark failed: ${response.status}`
                );
            }

            /*
             * Remove organization from UI
             */
            setOrganizations((previous) =>
                previous.filter(
                    (organization) =>
                        organization.id !==
                        organizationId
                )
            );

            /*
             * Update AuthContext
             */
            setUser({
                ...user,
                bookmarkedOrganizationIds:
                    user.bookmarkedOrganizationIds.filter(
                        (id) =>
                            id !== organizationId
                    ),
            });

            toast.success(
                "Bookmark removed",
                {
                    description:
                        "Organization removed from your bookmarks.",
                }
            );
        } catch (error) {
            console.error(
                "Remove bookmark error:",
                error
            );

            toast.error(
                "Failed to remove bookmark",
                {
                    description:
                        "Please try again.",
                }
            );
        } finally {
            setRemovingBookmark(null);
        }
    };

    /*
     * User initials
     */
    const initials = useMemo(() => {
        if (!user?.name) {
            return "U";
        }

        const parts = user.name
            .trim()
            .split(/\s+/);

        if (parts.length === 1) {
            return parts[0]
                .slice(0, 2)
                .toUpperCase();
        }

        return (
            parts[0][0] +
            parts[1][0]
        ).toUpperCase();
    }, [user?.name]);

    /*
     * Number of unique technologies
     */
    const technologyCount = useMemo(() => {
        const technologies = organizations.flatMap(
            (organization) =>
                organization.technologies || []
        );

        return new Set(technologies).size;
    }, [organizations]);

    /*
     * Number of unique categories
     */
    const categoryCount = useMemo(() => {
        const categories = organizations.flatMap(
            (organization) =>
                organization.category || []
        );

        return new Set(categories).size;
    }, [organizations]);

    if (authLoading) {
        return (
            <main className="profileLoading">
                <div className="profileLoadingSpinner" />
                <span>Loading profile...</span>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="profileEmpty">
                <div className="profileEmptyCard">
                    <h1>Please login</h1>
                    <p>
                        You need to be logged in to
                        view your profile.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="app-shell profileShell">
            <SiteHeader />

            <div className="profilePage">
                {/* =========================
                    PROFILE HERO
                ========================== */}
                <section className="profileHero">
                    <div className="profileIdentity">
                        <div className="profileAvatar">
                            {initials}
                        </div>

                        <div className="profileIdentityInfo">
                            <h1>{user.name}</h1>

                            <span className="profileRole">
                                GSoC Explorer
                            </span>

                            <p>
                                {user.description ||
                                    "Exploring open source, one organization at a time."}
                            </p>

                            <div className="profileActions">

                                <button
                                    type="button"
                                    className="profileEditButton"
                                    onClick={openEditModal}
                                >
                                    <Pencil size={16} />
                                    Edit Profile{!user.githubUsername?.trim() && (
                                        <span
                                            className="profileGithubMissingDot"
                                            aria-label="GitHub username is missing"
                                            title="Add your GitHub username"
                                        />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className="profileSettingsButton"
                                    onClick={() =>
                                        toast.info(
                                            "Settings coming soon"
                                        )
                                    }
                                >
                                    Settings
                                </button>

                                <button
                                    type="button"
                                    className="profileShareButton"
                                    onClick={handleShareProfile}
                                    disabled={!user.githubUsername?.trim()}
                                    title={
                                        user.githubUsername?.trim()
                                            ? "Copy public profile link"
                                            : "Add your GitHub username to enable sharing"
                                    }
                                >
                                    <Share2 size={16} />

                                    Share Profile
                                </button>

                            </div>
                        </div>
                    </div>

                    <div className="profileQuote">
                        <div className="profileQuoteIcon">
                            <Quote size={22} />
                        </div>

                        <blockquote>
                            “
                            {user.quote ||
                                "Code, contribute, repeat"}
                            ”
                        </blockquote>

                        <span>
                            — Keep exploring
                        </span>

                        <div className="profileQuoteWave profileQuoteWaveOne" />
                        <div className="profileQuoteWave profileQuoteWaveTwo" />
                    </div>
                </section>

                {/* =========================
                    STATS
                ========================== */}
                <section className="profileStats">
                    <div className="profileStatCard profileStatBlue">
                        <div className="profileStatIcon">
                            <Bookmark size={25} />
                        </div>

                        <div>
                            <strong>
                                {
                                    user
                                        .bookmarkedOrganizationIds
                                        .length
                                }
                            </strong>

                            <span>
                                Bookmarked
                                <br />
                                Organizations
                            </span>
                        </div>
                    </div>

                    <div className="profileStatCard profileStatPurple">
                        <div className="profileStatIcon">
                            <Code2 size={25} />
                        </div>

                        <div>
                            <strong>
                                {technologyCount}
                            </strong>

                            <span>
                                Technologies
                                <br />
                                Explored
                            </span>
                        </div>
                    </div>

                    <div className="profileStatCard profileStatGreen">
                        <div className="profileStatIcon">
                            <Layers3 size={25} />
                        </div>

                        <div>
                            <strong>
                                {categoryCount}
                            </strong>

                            <span>
                                Categories
                                <br />
                                Explored
                            </span>
                        </div>
                    </div>

                    <div className="profileStatCard profileStatGold">
                        <div className="profileStatIcon">
                            <ExternalLink size={25} />
                        </div>

                        <div>
                            <strong>—</strong>

                            <span>
                                Organizations
                                <br />
                                Viewed
                            </span>
                        </div>
                    </div>
                </section>

                {/* =========================
                    BOOKMARK SECTION
                ========================== */}
                <section className="profileBookmarksSection">
                    <div className="profileSectionHeader">
                        <div>
                            <h2>Bookmarked Organizations</h2>

                            <p>
                                Organizations you've
                                saved for later. Keep
                                track of the communities
                                you're interested in.
                            </p>
                        </div>

                        <span className="profileBookmarkCount">
                            {organizations.length} saved
                        </span>
                    </div>

                    {organizationsLoading ? (
                        <div className="profileBookmarksLoading">
                            <div className="profileLoadingSpinner" />
                            <span>
                                Loading your
                                organizations...
                            </span>
                        </div>
                    ) : organizationsError ? (
                        <div className="profileErrorCard">
                            <h3>
                                Couldn't load
                                organizations
                            </h3>

                            <p>
                                Please refresh and try
                                again.
                            </p>
                        </div>
                    ) : organizations.length ===
                        0 ? (
                        <div className="profileNoBookmarks">
                            <div className="profileNoBookmarksIcon">
                                <Bookmark size={30} />
                            </div>

                            <h3>
                                Discover more amazing
                                organizations
                            </h3>

                            <p>
                                Explore open source
                                communities and
                                bookmark the ones you're
                                interested in.
                            </p>

                            <Link
                                href="/explore"
                                className="profileExploreButton"
                            >
                                Explore Organizations
                                <ExternalLink
                                    size={16}
                                />
                            </Link>
                        </div>
                    ) : (
                        <div className="profileOrganizationGrid">
                            {organizations.map((organization) => (
                                <OrgCard
                                    key={organization.id}
                                    org={organization}
                                    onRemoveBookmark={handleRemoveBookmark}
                                    removing={
                                        removingBookmark === organization.id
                                    }
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* =========================
                EDIT PROFILE MODAL
            ========================== */}
            {editModalOpen && (
                <div
                    className="profileModalBackdrop"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setEditModalOpen(false);
                        }
                    }}
                >
                    <div
                        className="profileEditModal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="editProfileTitle"
                    >
                        <div className="profileModalHeader">
                            <div>
                                <span className="profileModalEyebrow">
                                    ACCOUNT
                                </span>

                                <h2 id="editProfileTitle">
                                    Edit Profile
                                </h2>

                                <p>
                                    Update the information
                                    shown on your profile.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="profileModalClose"
                                onClick={() =>
                                    setEditModalOpen(
                                        false
                                    )
                                }
                                aria-label="Close edit profile"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form
                            className="profileEditForm"
                            onSubmit={
                                handleProfileUpdate
                            }
                        >
                            <div className="profileFormField">
                                <label htmlFor="profileName">
                                    Name
                                </label>

                                <input
                                    id="profileName"
                                    type="text"
                                    value={
                                        editForm.name
                                    }
                                    onChange={(event) =>
                                        handleEditChange(
                                            "name",
                                            event.target
                                                .value
                                        )
                                    }
                                    required
                                    maxLength={100}
                                />
                            </div>

                            <div className="profileFormField">
                                <label htmlFor="profileGithub">
                                    GitHub Username
                                </label>

                                <div className="profileInputWithIcon">
                                    <Github
                                        size={17}
                                    />

                                    <input
                                        id="profileGithub"
                                        type="text"
                                        value={
                                            editForm.githubUsername
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleEditChange(
                                                "githubUsername",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="your-github-username"
                                        maxLength={100}
                                    />
                                </div>
                            </div>

                            <div className="profileFormField">
                                <label htmlFor="profileDescription">
                                    Description
                                </label>

                                <textarea
                                    id="profileDescription"
                                    value={
                                        editForm.description
                                    }
                                    onChange={(event) =>
                                        handleEditChange(
                                            "description",
                                            event.target
                                                .value
                                        )
                                    }
                                    rows={3}
                                    maxLength={300}
                                    placeholder="Tell people a little about yourself..."
                                />

                                <span className="profileFieldHint">
                                    {
                                        editForm
                                            .description
                                            .length
                                    }
                                    /300
                                </span>
                            </div>

                            <div className="profileFormField">
                                <label htmlFor="profileQuote">
                                    Quote
                                </label>

                                <textarea
                                    id="profileQuote"
                                    value={
                                        editForm.quote
                                    }
                                    onChange={(event) =>
                                        handleEditChange(
                                            "quote",
                                            event.target
                                                .value
                                        )
                                    }
                                    rows={2}
                                    maxLength={150}
                                    placeholder="A short quote that represents you..."
                                />

                                <span className="profileFieldHint">
                                    {
                                        editForm.quote
                                            .length
                                    }
                                    /150
                                </span>
                            </div>

                            <div className="profileModalFooter">
                                <button
                                    type="button"
                                    className="profileCancelButton"
                                    onClick={() =>
                                        setEditModalOpen(
                                            false
                                        )
                                    }
                                    disabled={
                                        savingProfile
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="profileSaveButton"
                                    disabled={
                                        savingProfile
                                    }
                                >
                                    {savingProfile ? (
                                        <>
                                            <span className="profileButtonSpinner" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check
                                                size={17}
                                            />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
