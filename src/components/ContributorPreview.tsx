"use client";

import "@/css/ContributorPreview.css";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
    Star,
    Users,
    RefreshCw,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";


interface Contributor {
    id: string;
    githubUserId: number;
    githubNodeId: string;
    login: string;
    avatarUrl: string;
    htmlUrl: string;
    contributions: number;
}


interface ContributorsApiResponse {
    data: {
        content: Contributor[];
        page: number;
        size: number;
        totalRecords: number;
        totalPages: number;
        first: boolean;
        last: boolean;
    };
}


export default function ContributorPreview({
    orgId,
}: {
    orgId: string | undefined;
}) {

    const [contributors, setContributors] =
        useState<Contributor[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(false);

    const [currentPage, setCurrentPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalRecords, setTotalRecords] =
        useState(0);


    const pageSize = 15;


    /* ========================================
       FETCH CONTRIBUTORS
    ======================================== */

    const fetchContributors = async (
        page: number,
        signal?: AbortSignal
    ) => {

        if (!orgId) {
            setLoading(false);
            return;
        }

        try {

            setLoading(true);
            setError(false);


            const response = await fetch(

                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${orgId}/contributors?page=${page}&size=${pageSize}`,

                {
                    signal,
                }

            );


            if (!response.ok) {
                throw new Error(
                    "Failed to fetch contributors"
                );
            }


            const result: ContributorsApiResponse =
                await response.json();


            const responseData = result.data;


            setContributors(
                responseData.content ?? []
            );

            setCurrentPage(
                responseData.page
            );

            setTotalPages(
                responseData.totalPages
            );

            setTotalRecords(
                responseData.totalRecords
            );


        } catch (error) {

            if (
                error instanceof Error &&
                error.name === "AbortError"
            ) {
                return;
            }

            console.error(
                "Contributor fetch error:",
                error
            );

            setError(true);

            setContributors([]);

        } finally {

            if (!signal?.aborted) {
                setLoading(false);
            }

        }

    };


    /* ========================================
       INITIAL + PAGE CHANGE FETCH
    ======================================== */

    useEffect(() => {

        const controller =
            new AbortController();


        fetchContributors(
            currentPage,
            controller.signal
        );


        return () => {
            controller.abort();
        };

    }, [orgId, currentPage]);


    /* ========================================
       PAGE CHANGE
    ======================================== */

    const changePage = (
        page: number
    ) => {

        if (
            page < 1 ||
            page > totalPages ||
            page === currentPage
        ) {
            return;
        }

        setCurrentPage(page);

    };


    /* ========================================
       SHIMMER
    ======================================== */

    if (loading && contributors.length === 0) {
        return <ContributorSkeleton />;
    }


    /* ========================================
       ERROR
    ======================================== */

    if (error) {

        return (

            <div className="contributor-state">

                <RefreshCw size={25} />

                <h3>
                    Unable to load contributors
                </h3>

                <p>
                    Something went wrong while loading
                    contributor information.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        fetchContributors(currentPage)
                    }
                >
                    Try Again
                </button>

            </div>

        );

    }


    /* ========================================
       EMPTY
    ======================================== */

    if (!loading && contributors.length === 0) {

        return (

            <div className="contributor-state">

                <Users size={28} />

                <h3>
                    No contributors found
                </h3>

                <p>
                    Contributor information is not
                    available yet.
                </p>

            </div>

        );

    }


    /* ========================================
       UI
    ======================================== */

    return (

        <section className="contributors-section">


            {/* HEADER */}

            <div className="contributors-header">

                <div>

                    <span className="contributors-eyebrow">
                        Top Contributors
                    </span>
                    <p>
                        Explore the people contributing
                        to this organization.
                    </p>

                </div>


                <div className="contributors-total">

                    <Users size={17} />

                    <span>
                        {totalRecords.toLocaleString()}
                        {" "}contributors
                    </span>

                </div>

            </div>


            {/* GRID */}

            <div
                className={`contributor-mini-grid ${loading ? "contributors-loading" : ""
                    }`}
            >

                {contributors.map((contributor, index) => {
                    const rank = (currentPage - 1) * pageSize + index + 1;

                    const rankClass =
                        rank === 1
                            ? "rank-gold"
                            : rank === 2
                                ? "rank-silver"
                                : rank === 3
                                    ? "rank-bronze"
                                    : "";

                    return (
                        <article
                            key={contributor.id}
                            className={`contributor-card ${rankClass}`}
                        >
                            {/* Rank Badge */}

                            {rank <= 3 && (
                                <div className="contributor-rank-badge">
                                    <span className="rank-medal">
                                        {rank === 1 && "🥇"}
                                        {rank === 2 && "🥈"}
                                        {rank === 3 && "🥉"}
                                    </span>

                                    <span>#{rank}</span>
                                </div>
                            )}

                            {/* Avatar */}

                            <a
                                href={contributor.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contributor-avatar-link"
                            >
                                <Image
                                    src={contributor.avatarUrl}
                                    alt={contributor.login}
                                    className="contributor-avatar"
                                    width={52}
                                    height={52}
                                    sizes="(max-width: 640px) 48px, 52px"
                                />
                            </a>

                            {/* Username */}

                            <h3>{contributor.login}</h3>

                            {/* GitHub */}

                            <a
                                href={contributor.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="github-profile-link"
                            >
                                GitHub Profile ↗
                            </a>

                            {/* Contributions */}

                            <div className="contributor-contributions">
                                <span className="contribution-icon">★</span>

                                <strong>
                                    {contributor.contributions.toLocaleString()}
                                </strong>

                                <span>contributions</span>
                            </div>
                        </article>
                    );
                })}

            </div>


            {/* PAGE LOADING OVERLAY */}

            {loading && contributors.length > 0 && (

                <div className="contributors-page-loading">

                    <div className="contributors-loader" />

                </div>

            )}


            {/* PAGINATION */}

            {totalPages > 1 && (

                <div className="contributors-pagination">


                    {/* Previous */}

                    <button
                        type="button"
                        onClick={() =>
                            changePage(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >

                        <ChevronLeft size={17} />

                    </button>


                    {/* PAGE NUMBERS */}

                    {getPaginationPages(
                        currentPage,
                        totalPages
                    ).map((page, index) =>

                        page === "dots"

                            ? (

                                <span
                                    key={`dots-${index}`}
                                    className="pagination-dots"
                                >
                                    ...
                                </span>

                            )

                            : (

                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        changePage(page)
                                    }
                                    className={
                                        currentPage === page
                                            ? "pagination-active"
                                            : ""
                                    }
                                >

                                    {page}

                                </button>

                            )

                    )}


                    {/* NEXT */}

                    <button
                        type="button"
                        onClick={() =>
                            changePage(currentPage + 1)
                        }
                        disabled={
                            currentPage === totalPages
                        }
                        aria-label="Next page"
                    >

                        <ChevronRight size={17} />

                    </button>


                </div>

            )}

        </section>

    );

}


/* ========================================
   PAGINATION LOGIC
======================================== */

function getPaginationPages(
    currentPage: number,
    totalPages: number
): (number | "dots")[] {

    if (totalPages <= 7) {

        return Array.from(
            { length: totalPages },
            (_, index) => index + 1
        );

    }


    if (currentPage <= 4) {

        return [
            1,
            2,
            3,
            4,
            5,
            "dots",
            totalPages,
        ];

    }


    if (currentPage >= totalPages - 3) {

        return [
            1,
            "dots",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];

    }


    return [

        1,

        "dots",

        currentPage - 1,

        currentPage,

        currentPage + 1,

        "dots",

        totalPages,

    ];

}


/* ========================================
   SHIMMER
======================================== */

function ContributorSkeleton() {

    return (

        <div className="contributor-mini-grid">

            {Array.from({ length: 9 }).map(
                (_, index) => (

                    <article
                        className="contributor-card contributor-skeleton-card"
                        key={index}
                    >

                        <div className="skeleton skeleton-rank" />

                        <div className="skeleton skeleton-avatar" />

                        <div className="skeleton skeleton-name" />

                        <div className="skeleton skeleton-link" />

                        <div className="skeleton skeleton-contributions" />

                    </article>

                )
            )}

        </div>

    );

}
