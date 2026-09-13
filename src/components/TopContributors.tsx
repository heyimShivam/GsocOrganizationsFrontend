"use client";

import "@/css/TopContributors.css";

import { useEffect, useState } from "react";
import { Star, Trophy, Github, Medal } from "lucide-react";

interface Contributor {
    id: string;
    login: string;
    avatarUrl: string;
    htmlUrl: string;
    contributions: number;
}

interface ContributorsResponse {
    data?: {
        content?: Contributor[];
    };
}

export default function TopContributors({
    orgId,
}: {
    orgId: string | undefined;
}) {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!orgId) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const fetchContributors = async () => {
            try {
                setLoading(true);
                setError(false);

                const url =
                    `/api/organizations/${orgId}/contributors?page=1&size=3`;


                const response = await fetch(url, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch contributors`
                    );
                }

                const result: ContributorsResponse = await response.json();


                const contributorList =
                    result.data?.content ?? [];

                const sortedContributors = [...contributorList]
                    .sort(
                        (a, b) =>
                            b.contributions - a.contributions
                    )
                    .slice(0, 3);

                setContributors(sortedContributors);

            } catch (error) {
                if (
                    error instanceof Error &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                console.error("FETCH CONTRIBUTORS FAILED:", error);

                setError(true);

            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchContributors();

        return () => controller.abort();
    }, [orgId]);

    if (loading) {
        return <TopContributorsSkeleton />;
    }

    if (error || contributors.length === 0) {
        return null;
    }

    return (
        <section className="tag-content">

            <div className="top-contributors-header">

                <div>
                    <span className="top-contributors-eyebrow">
                        COMMUNITY
                    </span>

                    <h2>
                        Top Contributors
                    </h2>

                    <p>
                        The people making the biggest impact on this
                        organization.
                    </p>
                </div>

                <Trophy
                    size={28}
                    className="top-contributors-trophy"
                />

            </div>

            <div className="top-contributors-grid">

                {contributors.map((contributor, index) => (
                    <ContributorCard
                        key={contributor.id}
                        contributor={contributor}
                        rank={index + 1}
                    />
                ))}

            </div>

        </section>
    );
}

function ContributorCard({
    contributor,
    rank,
}: {
    contributor: Contributor;
    rank: number;
}) {
    const rankClass =
        rank === 1
            ? "gold"
            : rank === 2
                ? "silver"
                : "bronze";

    return (
        <article
            className={`top-contributor-card ${rankClass}`}
        >

            <div className="contributor-medal">

                {rank === 1 && (
                    <Trophy size={18} />
                )}

                {rank === 2 && (
                    <Medal size={18} />
                )}

                {rank === 3 && (
                    <Medal size={18} />
                )}

                <span>#{rank}</span>

            </div>

            <a
                href={contributor.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="top-contributor-avatar-link"
            >
                <img
                    src={contributor.avatarUrl}
                    alt={contributor.login}
                    className="top-contributor-avatar"
                />
            </a>

            <div className="top-contributor-info">

                <h3>
                    {contributor.login}
                </h3>

                <a
                    href={contributor.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="top-contributor-github"
                >
                    <Github size={13} />
                    GitHub Profile
                </a>

            </div>

            <div className="top-contributor-stats">

                <Star size={16} />

                <div>
                    <strong>
                        {contributor.contributions.toLocaleString()}
                    </strong>

                    <span>
                        Contributions
                    </span>
                </div>

            </div>

        </article>
    );
}

function TopContributorsSkeleton() {
    return (
        <section className="top-contributors-section">

            <div className="top-contributors-header">

                <div>
                    <div className="contributors-shimmer shimmer-small" />

                    <div className="contributors-shimmer shimmer-title" />

                    <div className="contributors-shimmer shimmer-text" />
                </div>

            </div>

            <div className="top-contributors-grid">

                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        className="top-contributor-skeleton"
                        key={index}
                    >
                        <div className="contributors-shimmer skeleton-avatar" />

                        <div className="skeleton-content">
                            <div className="contributors-shimmer skeleton-name" />
                            <div className="contributors-shimmer skeleton-line" />
                        </div>

                        <div className="contributors-shimmer skeleton-stat" />
                    </div>
                ))}

            </div>

        </section>
    );
}