"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Bookmark,
    Code2,
    ExternalLink,
    Github,
    Layers3,
    Quote,
} from "lucide-react";
import { useParams } from "next/navigation";

import { SiteHeader } from "@/components/SiteHeader";
import { OrgCard } from "@/components/OrgCard";
import { Organization } from "@/types/Organization";

import "@/css/Profile.css";

type PublicUser = {
    id: string;
    name: string;
    email?: string;
    role: string;
    description?: string;
    quote?: string;
    githubUsername?: string;
    bookmarkedOrganizationIds: string[];
};

type OrganizationResponse = {
    data: Organization;
};

export default function PublicUserProfilePage() {
    const params = useParams();

    const slug = Array.isArray(params.slug)
        ? params.slug[0]
        : params.slug;

    const [user, setUser] =
        useState<PublicUser | null>(null);

    const [organizations, setOrganizations] =
        useState<Organization[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [organizationsLoading, setOrganizationsLoading] =
        useState(false);

    const [error, setError] =
        useState(false);

    /*
     * =========================================================
     * LOAD PUBLIC USER PROFILE
     * =========================================================
     */

    useEffect(() => {
        if (!slug) {
            return;
        }

        const loadUserProfile = async () => {
            try {
                setLoading(true);
                setError(false);

                const backendUrl =
                    process.env.NEXT_PUBLIC_BACKEND_URL;

                const response = await fetch(
                    `${backendUrl}/api/user-profile/${encodeURIComponent(
                        slug
                    )}`,
                    {
                        method: "GET",
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch profile: ${response.status}`
                    );
                }

                const result: PublicUser =
                    await response.json();

                setUser(result);
            } catch (error) {
                console.error(
                    "Failed to load public profile:",
                    error
                );

                setUser(null);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [slug]);

    /*
     * =========================================================
     * LOAD BOOKMARKED ORGANIZATIONS
     * =========================================================
     */

    useEffect(() => {
        if (!user) {
            return;
        }

        if (
            !user.bookmarkedOrganizationIds ||
            user.bookmarkedOrganizationIds.length === 0
        ) {
            setOrganizations([]);
            return;
        }

        const loadOrganizations = async () => {
            try {
                setOrganizationsLoading(true);

                const backendUrl =
                    process.env.NEXT_PUBLIC_BACKEND_URL;

                const requests =
                    user.bookmarkedOrganizationIds.map(
                        async (organizationId) => {
                            const response =
                                await fetch(
                                    `${backendUrl}/api/organizations/${organizationId}`,
                                    {
                                        method: "GET",
                                        cache: "no-store",
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

                setOrganizations([]);
            } finally {
                setOrganizationsLoading(false);
            }
        };

        loadOrganizations();
    }, [user]);

    /*
     * =========================================================
     * USER INITIALS
     * =========================================================
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
     * =========================================================
     * TECHNOLOGY COUNT
     * =========================================================
     */

    const technologyCount = useMemo(() => {
        const technologies =
            organizations.flatMap(
                (organization) =>
                    organization.technologies || []
            );

        return new Set(technologies).size;
    }, [organizations]);

    /*
     * =========================================================
     * CATEGORY COUNT
     * =========================================================
     */

    const categoryCount = useMemo(() => {
        const categories =
            organizations.flatMap(
                (organization) =>
                    organization.category || []
            );

        return new Set(categories).size;
    }, [organizations]);

    /*
     * =========================================================
     * DISPLAY ROLE
     * =========================================================
     */

    const displayRole = useMemo(() => {
        if (!user?.role) {
            return "User";
        }

        if (user.role === "ADMIN") {
            return "Admin";
        }

        return "User";
    }, [user?.role]);

    /*
     * =========================================================
     * LOADING
     * =========================================================
     */

    if (loading) {
        return (
            <main className="profileLoading">
                <div className="profileLoadingSpinner" />

                <span>
                    Loading profile...
                </span>
            </main>
        );
    }

    /*
     * =========================================================
     * PROFILE NOT FOUND
     * =========================================================
     */

    if (error || !user) {
        return (
            <main className="profileEmpty">
                <div className="profileEmptyCard">
                    <div className="publicProfileNotFoundIcon">
                        <Github size={28} />
                    </div>

                    <h1>
                        Profile not found
                    </h1>

                    <p>
                        This user profile doesn't
                        exist or is no longer
                        available.
                    </p>
                </div>
            </main>
        );
    }

    /*
     * =========================================================
     * PUBLIC PROFILE
     * =========================================================
     */

    return (
        <main className="app-shell profileShell publicProfileShell">

            <SiteHeader />

            <div className="profilePage">

                {/* =================================================
                    PUBLIC PROFILE HERO
                ================================================== */}

                <section className="profileHero">

                    <div className="profileIdentity">

                        {/* Avatar */}

                        <div className="profileAvatar">
                            {initials}
                        </div>

                        {/* Identity */}

                        <div className="profileIdentityInfo">

                            <h1>
                                {user.name}
                            </h1>

                            <p>
                                {user.description ||
                                    "Exploring open source, one organization at a time."}
                            </p>

                            {/* GitHub */}

                            {user.githubUsername && (
                                <a
                                    href={`https://github.com/${user.githubUsername}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="profileGithubLink"
                                >
                                    <Github
                                        size={17}
                                    />

                                    <span>
                                        @{user.githubUsername}
                                    </span>

                                    <ExternalLink
                                        size={14}
                                    />
                                </a>
                            )}

                        </div>

                    </div>

                    {/* Quote */}

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

                {/* =================================================
                    PUBLIC STATS
                ================================================== */}

                <section className="profileStats">

                    {/* Bookmarks */}

                    <div className="profileStatCard profileStatBlue">

                        <div className="profileStatIcon">
                            <Bookmark size={25} />
                        </div>

                        <div>
                            <strong>
                                {
                                    user
                                        .bookmarkedOrganizationIds
                                        ?.length || 0
                                }
                            </strong>

                            <span>
                                Bookmarked
                                <br />
                                Organizations
                            </span>
                        </div>

                    </div>

                    {/* Technologies */}

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

                    {/* Categories */}

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

                    {/* GitHub */}

                    <div className="profileStatCard profileStatGold">

                        <div className="profileStatIcon">
                            <Github size={25} />
                        </div>

                        <div>
                            <strong>
                                {user.githubUsername
                                    ? "Linked"
                                    : "—"}
                            </strong>

                            <span>
                                GitHub
                                <br />
                                Account
                            </span>
                        </div>

                    </div>

                </section>

                {/* =================================================
                    BOOKMARKED ORGANIZATIONS
                ================================================== */}

                <section className="profileBookmarksSection">

                    <div className="profileSectionHeader">

                        <div>

                            <span className="publicProfileEyebrow">
                                OPEN SOURCE
                            </span>

                            <h2>
                                Bookmarked Organizations
                            </h2>

                            <p>
                                Organizations saved by{" "}
                                {user.name}.
                            </p>

                        </div>

                        <span className="profileBookmarkCount">
                            {organizations.length} saved
                        </span>

                    </div>

                    {/* Loading */}

                    {organizationsLoading ? (

                        <div className="profileBookmarksLoading">

                            <div className="profileLoadingSpinner" />

                            <span>
                                Loading bookmarked
                                organizations...
                            </span>

                        </div>

                    ) : organizations.length === 0 ? (

                        /* No bookmarks */

                        <div className="profileNoBookmarks">

                            <div className="profileNoBookmarksIcon">
                                <Bookmark size={28} />
                            </div>

                            <h3>
                                No bookmarked organizations
                            </h3>

                            <p>
                                {user.name} hasn't
                                bookmarked any
                                organizations yet.
                            </p>

                        </div>

                    ) : (

                        /* Organization cards */

                        <div className="profileOrganizationGrid">

                            {organizations.map(
                                (organization) => (
                                    <OrgCard
                                        key={
                                            organization.id
                                        }
                                        org={
                                            organization
                                        }
                                    />
                                )
                            )}

                        </div>

                    )}

                </section>

                {/* =================================================
                    PUBLIC PROFILE INFORMATION
                ================================================== */}

                <section className="publicProfileAbout">

                    <div className="publicProfileSectionHeader">

                        <div>

                            <span className="publicProfileEyebrow">
                                PROFILE
                            </span>

                            <h2>
                                About {user.name}
                            </h2>

                            <p>
                                Public profile
                                information.
                            </p>

                        </div>

                    </div>

                    <div className="publicProfileInfoGrid">

                        {/* Name */}

                        <div className="publicProfileInfoCard">

                            <span className="publicProfileInfoLabel">
                                Name
                            </span>

                            <strong>
                                {user.name}
                            </strong>

                        </div>

                        {/* GitHub */}

                        {user.githubUsername && (
                            <div className="publicProfileInfoCard">

                                <span className="publicProfileInfoLabel">
                                    GitHub
                                </span>

                                <a
                                    href={`https://github.com/${user.githubUsername}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="publicProfileGithub"
                                >
                                    <Github size={16} />

                                    <span>
                                        @{user.githubUsername}
                                    </span>

                                    <ExternalLink
                                        size={14}
                                    />
                                </a>

                            </div>
                        )}

                        {/* Description */}

                        <div className="publicProfileInfoCard">

                            <span className="publicProfileInfoLabel">
                                Description
                            </span>

                            <p>
                                {user.description ||
                                    "No description provided."}
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </main>
    );
}
