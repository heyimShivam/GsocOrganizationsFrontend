"use client";

import { Organization } from "@/types/Organization";
import { Bookmark, Loader2 } from "lucide-react";
import LogoTile from "./LogoTile";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type OrgCardProps = {
    org: Organization;
    list?: boolean;

    // Used on profile page
    onRemoveBookmark?: (organizationId: string) => void;
    removing?: boolean;
};

export function OrgCard({
    org,
    list = false,
    onRemoveBookmark,
    removing = false,
}: OrgCardProps) {
    const { user, refreshUser } = useAuth();

    const [bookmarkLoading, setBookmarkLoading] =
        useState(false);

    /*
     * Check bookmark status directly from AuthContext.
     */
    const bookmarked =
        user?.bookmarkedOrganizationIds?.includes(org.id) ?? false;

    const handleBookmark = async (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        /*
         * Profile page
         *
         * Profile page already has its own DELETE logic.
         */
        if (onRemoveBookmark) {
            if (!removing) {
                onRemoveBookmark(org.id);
            }
            return;
        }

        /*
         * Prevent duplicate requests.
         */
        if (bookmarkLoading) {
            return;
        }

        /*
         * Already bookmarked → DELETE
         * Not bookmarked → POST
         */
        const method = bookmarked ? "DELETE" : "POST";

        setBookmarkLoading(true);

        try {
            const backendUrl =
                process.env.NEXT_PUBLIC_BACKEND_URL;

            const response = await fetch(
                `${backendUrl}/api/auth/me/bookmarks/${org.id}`,
                {
                    method,
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Bookmark request failed: ${response.status}`
                );
            }

            /*
             * Refresh /api/auth/me
             *
             * This updates:
             * user.bookmarkedOrganizationIds
             */
            await refreshUser();

            if (method === "POST") {
                toast.success("Bookmark added", {
                    description: `${org.name} was added to your bookmarks.`,
                });
            } else {
                toast.success("Bookmark removed", {
                    description: `${org.name} was removed from your bookmarks.`,
                });
            }
        } catch (error) {
            console.error("Bookmark error:", error);

            toast.error(
                bookmarked
                    ? "Failed to remove bookmark"
                    : "Failed to add bookmark",
                {
                    description: "Please try again.",
                }
            );
        } finally {
            setBookmarkLoading(false);
        }
    };

    return (
        <Link
            href={`/organizations/${org.id}`}
            className={
                list
                    ? "org-card list-card"
                    : "org-card"
            }
        >
            {/*
             * Show bookmark only when the user is logged in.
             *
             * user === null → hidden
             * user !== null → visible
             */}
            {user && (
                <button
                    type="button"
                    className={`org-card-bookmark ${bookmarked
                            ? "org-card-bookmarkActive"
                            : ""
                        } ${onRemoveBookmark
                            ? "org-card-bookmarkRemove"
                            : ""
                        }`}
                    onClick={handleBookmark}
                    disabled={
                        bookmarkLoading || removing
                    }
                    aria-label={
                        bookmarked
                            ? `Remove ${org.name} from bookmarks`
                            : `Bookmark ${org.name}`
                    }
                    title={
                        bookmarked
                            ? "Remove bookmark"
                            : "Bookmark organization"
                    }
                >
                    {bookmarkLoading || removing ? (
                        <Loader2
                            size={18}
                            className="org-card-bookmarkSpinner"
                        />
                    ) : (
                        <Bookmark
                            size={19}
                            fill={
                                bookmarked
                                    ? "currentColor"
                                    : "none"
                            }
                        />
                    )}
                </button>
            )}

            <LogoTile org={org} />

            <div className="org-card-body">
                <div className="card-title">
                    <h3>{org.name}</h3>

                    <span
                        className={
                            org.activeOrg
                                ? "status done"
                                : "status inactive-status"
                        }
                    >
                        {org.activeOrg
                            ? "Active"
                            : "Inactive"}
                    </span>
                </div>

                <p>{org.description}</p>

                <div className="chips">
                    {org.technologies
                        .slice(0, 3)
                        .map((tag) => (
                            <span key={tag}>
                                {tag}
                            </span>
                        ))}

                    {org.technologies.length > 3 && (
                        <span>
                            +{org.technologies.length - 3}
                        </span>
                    )}
                </div>

                <div className="org-card-footer years-wrap">
                    {org.years.map((year) => (
                        <span
                            key={year}
                            className="whitespace-nowrap"
                        >
                            {year}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}