"use client";

import "@/css/RepoTabOrg.css";
import { Repository, RepositoryResponse } from "@/types/Repository";
import { ArrowBigUpDash, ArrowUpNarrowWideIcon, ChevronDown, ChevronUp, SearchIcon } from "lucide-react";

import { useEffect, useState } from "react";

type SortBy =
    | "STARS"
    | "FORKS"
    | "OPEN_ISSUES";


type Direction =
    | "ASC"
    | "DESC";


export default function RepoTabOrg({
    orgId,
}: {
    orgId: string | undefined;
}) {

    const [repositories, setRepositories] =
        useState<Repository[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(false);


    /* =========================================
       FILTERS
    ========================================= */

    const [repoName, setRepoName] =
        useState("");

    const [sortBy, setSortBy] =
        useState<SortBy>("STARS");

    const [direction, setDirection] =
        useState<Direction>("DESC");


    /* =========================================
       PAGINATION
    ========================================= */

    const [page, setPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalRecords, setTotalRecords] =
        useState(0);

    const pageSize = 9;


    /* =========================================
       FETCH
    ========================================= */

    const fetchRepositories = async (
        signal?: AbortSignal
    ) => {

        if (!orgId) return;

        try {

            setLoading(true);
            setError(false);


            const response = await fetch(

                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/repositories/${orgId}?page=${page}&size=${pageSize}`,

                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        repoName,
                        sortBy,
                        direction,
                    }),

                    signal,
                }
            );


            if (!response.ok) {
                throw new Error(
                    "Failed to fetch repositories"
                );
            }


            const result: RepositoryResponse =
                await response.json();


            const apiData = result.data;


            setRepositories(
                apiData.content ?? []
            );

            setTotalPages(
                apiData.totalPages ?? 1
            );

            setTotalRecords(
                apiData.totalRecords ?? 0
            );

        } catch (error) {

            if (
                error instanceof Error &&
                error.name === "AbortError"
            ) {
                return;
            }

            console.error(
                "Repository fetch error:",
                error
            );

            setError(true);
            setRepositories([]);

        } finally {

            if (!signal?.aborted) {
                setLoading(false);
            }

        }

    };


    /* =========================================
       API REQUEST
    ========================================= */

    useEffect(() => {

        if (!orgId) {
            setLoading(false);
            return;
        }

        const controller =
            new AbortController();


        const timeout = setTimeout(() => {

            fetchRepositories(
                controller.signal
            );

        }, 350);


        return () => {

            clearTimeout(timeout);

            controller.abort();

        };

    }, [
        orgId,
        repoName,
        sortBy,
        direction,
        page,
    ]);


    /* =========================================
       FILTER HANDLERS
    ========================================= */

    const handleSearchChange = (
        value: string
    ) => {

        setRepoName(value);

        setPage(1);

    };


    const handleSortChange = (
        value: SortBy
    ) => {

        setSortBy(value);

        setPage(1);

    };


    const toggleDirection = () => {

        setDirection((current) =>
            current === "DESC"
                ? "ASC"
                : "DESC"
        );

        setPage(1);

    };


    if (!orgId) {

        return (

            <section className="repositories-tab">

                <div className="repositories-empty">

                    <div className="repo-state-icon">
                        ◫
                    </div>

                    <h3>
                        Organization not found
                    </h3>

                    <p>
                        Unable to load repositories.
                    </p>

                </div>

            </section>

        );

    }


    return (

        <section className="repositories-tab">


            {/* HEADER */}

            <div className="repositories-header">

                <div>

                    <span className="repo-eyebrow">
                        GITHUB REPOSITORIES
                    </span>

                    <h2>
                        Organization Repositories
                    </h2>

                    <p>
                        Explore open-source repositories maintained
                        by this organization.
                    </p>

                </div>


                {!loading && !error && (

                    <div className="repositories-count">

                        <strong>
                            {totalRecords}
                        </strong>

                        <span>
                            repositories
                        </span>

                    </div>

                )}

            </div>


            {/* FILTERS */}

            <div className="repo-filters">


                {/* SEARCH */}

                <div className="repo-search">
                    <span className="search-icon">
                        <SearchIcon />
                    </span>
                    <input type="text" value={repoName} onChange={(event) => handleSearchChange(event.target.value)} placeholder="Search repositories..." />
                </div>


                {/* FILTER CONTROLS */}

                <div className="repo-filter-controls">
                    <div className="custom-select-wrapper">
                        <select
                            value={sortBy}
                            onChange={(event) =>
                                handleSortChange(
                                    event.target.value as SortBy
                                )
                            }
                        >
                            <option value="STARS">Most Stars</option>

                            <option value="FORKS">Most Forks</option>

                            <option value="OPEN_ISSUES">
                                Open Issues
                            </option>
                        </select>
                        <ChevronDown />
                    </div>


                    <button
                        type="button"

                        className="direction-button"

                        onClick={toggleDirection}
                    >

                        {direction === "DESC"
                            ? <><ChevronUp /> </>
                            : <><ChevronDown /></>}

                    </button>
                </div>

            </div>


            {/* CONTENT */}

            <div className="repositories-content">


                {/* LOADING */}

                {loading && (
                    <RepositorySkeletonGrid />
                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="repositories-error">

                        <div className="repo-state-icon">
                            !
                        </div>

                        <h3>
                            Unable to load repositories
                        </h3>

                        <p>
                            Something went wrong while loading
                            the repositories.
                        </p>

                        <button
                            type="button"

                            onClick={() =>
                                fetchRepositories()
                            }
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    repositories.length === 0 && (

                        <div className="repositories-empty">

                            <div className="repo-state-icon">
                                ◫
                            </div>

                            <h3>
                                No repositories found
                            </h3>

                            <p>
                                Try changing your search filter.
                            </p>

                        </div>

                    )}


                {/* GRID */}

                {!loading &&
                    !error &&
                    repositories.length > 0 && (

                        <>

                            <div className="repositories-results-info">

                                Showing{" "}

                                <strong>
                                    {repositories.length}
                                </strong>

                                {" "}of{" "}

                                <strong>
                                    {totalRecords}
                                </strong>

                                {" "}repositories

                            </div>


                            <div className="repositories-grid">

                                {repositories.map(
                                    (repository, index) => (

                                        <article
                                            className="repository-card"

                                            key={repository.id}
                                        >


                                            {/* TOP */}

                                            <div className="repository-card-top">

                                                <div className="repo-icon">

                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                    >

                                                        <path
                                                            d="M5 4.5H15L19 8.5V20H5V4.5Z"
                                                            stroke="currentColor"
                                                            strokeWidth="1.7"
                                                        />

                                                        <path
                                                            d="M15 4.5V8.5H19"
                                                            stroke="currentColor"
                                                            strokeWidth="1.7"
                                                        />

                                                    </svg>

                                                </div>


                                                <span className="repository-index">

                                                    #
                                                    {String(
                                                        ((page - 1) *
                                                            pageSize) +
                                                        index +
                                                        1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}

                                                </span>

                                            </div>


                                            {/* REPOSITORY NAME */}

                                            <a
                                                href={repository.htmlUrl}

                                                target="_blank"

                                                rel="noopener noreferrer"

                                                className="repository-name"
                                            >

                                                {repository.name}

                                                <span>
                                                    ↗
                                                </span>

                                            </a>


                                            {/* FULL NAME */}

                                            <div className="repository-full-name">

                                                {repository.fullName}

                                            </div>


                                            {/* DESCRIPTION */}

                                            <p className="repository-description">

                                                {repository.description ??
                                                    "No description available for this repository."}

                                            </p>


                                            {/* TOPICS */}

                                            {repository.topics.length > 0 && (

                                                <div className="repository-topics">

                                                    {repository.topics
                                                        .slice(0, 3)
                                                        .map((topic) => (

                                                            <span
                                                                key={topic}
                                                            >
                                                                {topic}
                                                            </span>

                                                        ))}

                                                    {repository.topics.length > 3 && (

                                                        <span className="topic-more">

                                                            +
                                                            {repository.topics.length - 3}

                                                        </span>

                                                    )}

                                                </div>

                                            )}


                                            {/* FOOTER */}

                                            <div className="repository-footer">


                                                <div className="repository-language">

                                                    {repository.language && (

                                                        <>

                                                            <span className="language-dot" />

                                                            <span>
                                                                {repository.language}
                                                            </span>

                                                        </>

                                                    )}

                                                </div>


                                                <div className="repository-stats">

                                                    <span
                                                        title="Stars"
                                                    >
                                                        ★ {repository.stars}
                                                    </span>


                                                    <span
                                                        title="Forks"
                                                    >
                                                        ⑂ {repository.forks}
                                                    </span>


                                                    <span
                                                        title="Open Issues"
                                                    >
                                                        ◉ {repository.openIssues}
                                                    </span>

                                                </div>


                                            </div>


                                        </article>

                                    )
                                )}

                            </div>

                        </>

                    )}


                {/* PAGINATION */}

                {!loading &&
                    !error &&
                    totalPages > 1 && (

                        <Pagination
                            page={page}

                            totalPages={totalPages}

                            onPageChange={setPage}
                        />

                    )}

            </div>

        </section>

    );

}


/* =========================================
   PAGINATION
========================================= */

function Pagination({
    page,
    totalPages,
    onPageChange,
}: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {

    const pages: (number | string)[] = [];


    if (totalPages <= 7) {

        for (
            let i = 1;
            i <= totalPages;
            i++
        ) {
            pages.push(i);
        }

    } else {

        pages.push(1);


        if (page > 4) {
            pages.push("...");
        }


        const start =
            Math.max(2, page - 1);

        const end =
            Math.min(
                totalPages - 1,
                page + 1
            );


        for (
            let i = start;
            i <= end;
            i++
        ) {
            pages.push(i);
        }


        if (page < totalPages - 3) {
            pages.push("...");
        }


        pages.push(totalPages);

    }


    return (

        <div className="repositories-pagination">


            <button
                disabled={page === 1}

                onClick={() =>
                    onPageChange(page - 1)
                }
            >
                ← Previous
            </button>


            {pages.map((item, index) =>

                item === "..." ? (

                    <span
                        key={`dots-${index}`}
                        className="pagination-dots"
                    >
                        ...
                    </span>

                ) : (

                    <button
                        key={item}

                        className={
                            page === item
                                ? "pagination-active"
                                : ""
                        }

                        onClick={() =>
                            onPageChange(
                                item as number
                            )
                        }
                    >

                        {item}

                    </button>

                )

            )}


            <button
                disabled={
                    page === totalPages
                }

                onClick={() =>
                    onPageChange(page + 1)
                }
            >
                Next →
            </button>


        </div>

    );

}


/* =========================================
   SHIMMER
========================================= */

function RepositorySkeletonGrid() {

    return (

        <div className="repositories-grid">

            {Array.from({
                length: 6,
            }).map((_, index) => (

                <div
                    className="repository-skeleton"
                    key={index}
                >

                    <div className="repo-skeleton-top">

                        <div className="skeleton repo-skeleton-icon" />

                        <div className="skeleton repo-skeleton-number" />

                    </div>


                    <div className="skeleton repo-skeleton-title" />

                    <div className="skeleton repo-skeleton-small-title" />

                    <div className="skeleton repo-skeleton-line" />

                    <div className="skeleton repo-skeleton-line repo-skeleton-short" />

                    <div className="repo-skeleton-footer">

                        <div className="skeleton repo-skeleton-language" />

                        <div className="skeleton repo-skeleton-stats" />

                    </div>

                </div>

            ))}

        </div>

    );

}
