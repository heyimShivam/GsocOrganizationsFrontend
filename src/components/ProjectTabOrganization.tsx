"use client";

import "@/css/ProjectTab.css";

import { useEffect, useMemo, useState } from "react";

import { ProjectsPerYear } from "@/types/ProjectsPerYear";

import ProjectsHistoryChart from "./ProjectsHistoryChart";


interface Project {
    id: string;
    year: number;
    title: string;
    shortDescription?: string;
    description?: string;
    studentName?: string;
}


interface ProjectsApiData {
    content?: Record<string, Project[]>;
    first?: boolean;
    last?: boolean;
    page?: number;
    size?: number;
    totalPages?: number;
    totalRecords?: number;
}


interface ProjectsApiResponse {
    data?: ProjectsApiData;
}


export default function ProjectTabOrganization({
    projectsPerYear,
    organizationId,
}: {
    projectsPerYear: ProjectsPerYear[];
    organizationId: string | undefined;
}) {

    /*
    ========================================
    SORT YEARS
    Latest year first
    ========================================
    */

    const years = useMemo(() => {

        return [...projectsPerYear].sort(
            (a, b) => b.year - a.year
        );

    }, [projectsPerYear]);


    /*
    ========================================
    STATE
    ========================================
    */

    const [selectedYear, setSelectedYear] = useState<number | null>(
        null
    );

    const [projects, setProjects] = useState<Project[]>([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(false);

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const pageSize = 9;


    /*
    ========================================
    DEFAULT YEAR
    ========================================
    */

    useEffect(() => {

        if (years.length > 0 && selectedYear === null) {

            setSelectedYear(years[0].year);

        }

    }, [years, selectedYear]);


    /*
    ========================================
    FETCH PROJECTS
    ========================================
    */

    useEffect(() => {

        if (!selectedYear) return;

        const controller = new AbortController();


        async function fetchProjects() {

            try {

                setLoading(true);

                setError(false);


                const response = await fetch(

                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/${organizationId}?page=${page}&size=${pageSize}`,

                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                        },

                        body: JSON.stringify({
                            title: "",
                            year: selectedYear,
                        }),

                        signal: controller.signal,
                    }

                );


                if (!response.ok) {

                    throw new Error("Failed to fetch projects");

                }


                const result: ProjectsApiResponse =
                    await response.json();


                /*
                ========================================
                YOUR API RESPONSE:

                {
                    data: {
                        content: {
                            "2019": [...]
                        },
                        totalPages: 1
                    }
                }
                ========================================
                */

                const projectsForYear =
                    result.data?.content?.[(selectedYear || 2016).toString()] ?? [];


                setProjects(projectsForYear);

                setTotalPages(
                    result.data?.totalPages ?? 1
                );


            } catch (error) {

                if (
                    error instanceof Error &&
                    error.name === "AbortError"
                ) {
                    return;
                }


                console.error("Projects fetch error:", error);

                setError(true);

                setProjects([]);

            } finally {

                if (!controller.signal.aborted) {

                    setLoading(false);

                }

            }

        }


        fetchProjects();


        return () => {

            controller.abort();

        };


    }, [
        selectedYear,
        organizationId,
        page,
    ]);


    /*
    ========================================
    YEAR CHANGE
    ========================================
    */

    const handleYearChange = (year: number) => {

        setSelectedYear(year);

        setPage(1);

    };


    /*
    ========================================
    NO YEAR DATA
    ========================================
    */

    if (years.length === 0) {

        return (

            <section className="projects-tab">

                <div className="projects-empty">

                    <div className="empty-icon">
                        ◫
                    </div>

                    <h3>
                        No project history available
                    </h3>

                    <p>
                        This organization does not have any
                        project data yet.
                    </p>

                </div>

            </section>

        );

    }


    return (

        <section className="projects-tab">
            <div className="projects-hero-content">
                <div className="projects-hero-details">

                    <span className="section-eyebrow">
                        GSoC PROJECTS
                    </span>
                    <h1>
                        GSoC Past Projects
                    </h1>
                    <p>
                        Explore projects completed by this
                        organization during Google Summer of Code.
                    </p>

                </div>

                <div className="projects-chart-wrapper">
                    <ProjectsHistoryChart projectsPerYear={projectsPerYear} />
                </div>
            </div>

            {/* ========================================
                YEAR TABS
            ======================================== */}

            <div className="year-tabs">

                {years.map((item) => (

                    <button
                        key={item.year}
                        type="button"
                        onClick={() =>
                            handleYearChange(item.year)
                        }
                        className={`year-tab ${selectedYear === item.year
                            ? "year-tab-active"
                            : ""
                            }`}
                    >

                        <span className="year-value">
                            {item.year}
                        </span>


                        <span className="year-project-count">
                            {item.totalProjects}
                        </span>

                    </button>

                ))}

            </div>

            {/* ========================================
                PROJECT CONTENT
            ======================================== */}

            <div className="projects-section">


                <div className="projects-list-header">

                    <p>

                        Showing{" "}

                        <strong>
                            {loading
                                ? "..."
                                : projects.length}
                        </strong>

                        {" "}projects

                    </p>


                    {selectedYear && (

                        <span className="current-year-badge">
                            {selectedYear}
                        </span>

                    )}

                </div>


                {/* ========================================
                    SHIMMER
                ======================================== */}

                {loading && (

                    <ProjectSkeletonGrid />

                )}


                {/* ========================================
                    ERROR
                ======================================== */}

                {!loading && error && (

                    <div className="projects-error">

                        <div className="state-icon">
                            !
                        </div>

                        <h3>
                            Unable to load projects
                        </h3>

                        <p>
                            Something went wrong while loading
                            projects for {selectedYear}.
                        </p>

                    </div>

                )}


                {/* ========================================
                    EMPTY
                ======================================== */}

                {!loading &&
                    !error &&
                    projects.length === 0 && (

                        <div className="projects-empty">

                            <div className="empty-icon">
                                ◫
                            </div>

                            <h3>
                                No projects found
                            </h3>

                            <p>
                                There are no projects available
                                for {selectedYear}.
                            </p>

                        </div>

                    )}


                {/* ========================================
                    PROJECT GRID
                ======================================== */}

                {!loading &&
                    !error &&
                    projects.length > 0 && (

                        <>

                            <div className="projects-grid">

                                {projects.map((project, index) => (

                                    <article
                                        key={project.id}
                                        className="project-card"
                                    >

                                        <div className="project-card-top">


                                            <span className="project-year-badge">

                                                {project.year}

                                            </span>


                                            <span className="project-index">

                                                #
                                                {String(
                                                    (page - 1) *
                                                    pageSize +
                                                    index +
                                                    1
                                                ).padStart(2, "0")}

                                            </span>


                                        </div>


                                        <h3>
                                            {project.title}
                                        </h3>


                                        {(project.shortDescription ||
                                            project.description) && (

                                                <p className="project-description">

                                                    {project.shortDescription ||
                                                        project.description}

                                                </p>

                                            )}


                                        {project.studentName && (

                                            <div className="project-student">

                                                <div className="student-avatar">

                                                    {project.studentName
                                                        .charAt(0)
                                                        .toUpperCase()}

                                                </div>


                                                <span>
                                                    {project.studentName}
                                                </span>

                                            </div>

                                        )}


                                    </article>

                                ))}

                            </div>


                            {/* ========================================
                                PAGINATION
                            ======================================== */}

                            {totalPages > 1 && (

                                <div className="projects-pagination">


                                    <button
                                        type="button"
                                        disabled={page === 1}
                                        onClick={() =>
                                            setPage(page - 1)
                                        }
                                    >
                                        ← Previous
                                    </button>


                                    {Array.from(
                                        { length: totalPages }
                                    ).map((_, index) => {

                                        const pageNumber = index + 1;

                                        return (

                                            <button
                                                key={pageNumber}
                                                type="button"
                                                onClick={() =>
                                                    setPage(pageNumber)
                                                }
                                                className={
                                                    page === pageNumber
                                                        ? "pagination-active"
                                                        : ""
                                                }
                                            >

                                                {pageNumber}

                                            </button>

                                        );

                                    })}


                                    <button
                                        type="button"
                                        disabled={
                                            page === totalPages
                                        }
                                        onClick={() =>
                                            setPage(page + 1)
                                        }
                                    >
                                        Next →
                                    </button>


                                </div>

                            )}

                        </>

                    )}


            </div>


        </section>

    );

}


/*
========================================
SHIMMER LOADING UI
========================================
*/

function ProjectSkeletonGrid() {

    return (

        <div className="projects-grid">

            {Array.from({ length: 6 }).map((_, index) => (

                <div
                    className="project-skeleton"
                    key={index}
                >

                    <div className="skeleton skeleton-small" />

                    <div className="skeleton skeleton-title" />

                    <div className="skeleton skeleton-line" />

                    <div className="skeleton skeleton-line short" />

                    <div className="skeleton skeleton-footer" />

                </div>

            ))}

        </div>

    );

}
