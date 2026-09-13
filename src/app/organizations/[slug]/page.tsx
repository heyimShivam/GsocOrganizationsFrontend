"use client";

import {
    ArrowLeft,
    ExternalLink,
    MapPin,
    Star,
    GitFork,
    CircleDot,
    Globe,
    GithubIcon,
    LucideGithub,
    Github,
    Contact2Icon,
    Contact2,
    ContactRoundIcon,
    MailPlusIcon,
    TwitterIcon,
    XIcon,
    LucidePaperclip,
    ComputerIcon,
    Mail,
    Rss
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

import ContributorPreview from "@/components/ContributorPreview";
import LogoTile from "@/components/LogoTile";
import OverviewContent from "@/components/OverviewContent";
import ProjectPreview from "@/components/ProjectPreview";
import { SiteHeader } from "@/components/SiteHeader";
import TagContent from "@/components/TagContent";
import { OrganizationDetails } from "@/types/OrganizationDetails";
import { Project } from "@/types/Project";
import { Tab } from "@/types/Tab";
import { ProjectsPerYear } from "@/types/ProjectsPerYear";
const ProjectTabOrganization = dynamic(
    () => import("@/components/ProjectTabOrganization"),
    {
        loading: () => (
            <div className="empty-state">
                Loading projects...
            </div>
        ),
    }
);

const RepoTabOrg = dynamic(
    () => import("@/components/RepoTabOrg"),
    {
        loading: () => (
            <div className="empty-state">
                Loading repositories...
            </div>
        ),
    }
);



export default function OrganizationDetailPage() {
    const params = useParams();

    const organizationId = params.slug as
        | string
        | undefined;

    const [organization, setOrganization] =
        useState<OrganizationDetails | null>(
            null
        );

    const [projectsPerYear, setProjectsPerYear] =
        useState<ProjectsPerYear[]>([]);

    const [tab, setTab] =
        useState<Tab>("Overview");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        if (!organizationId) {
            return;
        }

        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [
                    organizationResponse,
                    projectsPerYearResponse,
                ] = await Promise.all([
                    fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}`,
                        { signal: controller.signal }
                    ),
                    fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/${organizationId}/years`,
                        { signal: controller.signal }
                    ),
                ]);

                if (!organizationResponse.ok) {
                    throw new Error(
                        "Failed to fetch organization"
                    );
                }

                const organizationData =
                    await organizationResponse.json();

                setOrganization(
                    organizationData.data
                );

                if (projectsPerYearResponse.ok) {
                    const projectsData =
                        await projectsPerYearResponse.json();

                    setProjectsPerYear(
                        projectsData.data
                    );
                }
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                console.error(
                    "Error fetching organization data:",
                    error
                );

                setError(
                    "Unable to load organization details."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => controller.abort();
    }, [organizationId]);

    if (loading) {
        return (
            <main className="app-shell detail-shell">
                <SiteHeader />

                <section className="detail-content">
                    <div className="empty-state">
                        Loading organization...
                    </div>
                </section>
            </main>
        );
    }

    if (error || !organization) {
        return (
            <main className="app-shell detail-shell">
                <SiteHeader />

                <section className="detail-content">
                    <div className="empty-state">
                        {error ??
                            "Organization not found."}
                    </div>
                </section>
            </main>
        );
    }

    const statusText =
        organization.activeOrg
            ? "Active"
            : "Inactive";

    return (
        <main className="app-shell detail-shell">
            <SiteHeader />

            <section className="detail-top">
                <Link href="/explore" className="back-link">
                    <ArrowLeft size={16} /> Back to organizations
                </Link>

                <div className="detail-profile">
                    <LogoTile org={{
                        imageBackgroundColor: organization.imageBackgroundColor,
                        imageUrl: organization.imageUrl,
                        name: organization.name,
                        width: 200,
                        height: 300
                    }} />
                    <div>
                        <div className="title-line">
                            <h1> {organization.name} </h1>

                            <span className={organization.activeOrg ? "status done" : "status inactive-status"}>
                                {statusText}
                            </span>
                        </div>

                        <h2> {organization.name} </h2>

                        <p> {organization.description} </p>

                        <div className="metadata">
                            {organization.url && (
                                <a href={organization.url} target="_blank" rel="noopener noreferrer" style={{ color: '#43a6ff' }}>
                                    <Globe size={17} /> {new URL(organization.url).hostname.replace("www.", "")}
                                </a>
                            )}

                            <div className="vertical-line"></div>

                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <MapPin size={17} /> Remote
                            </span>

                            <div className="vertical-line"></div>
                            {organization.githubId && (
                                <a href={`https://github.com/${organization.githubId}`}
                                    target="_blank"
                                    rel="noopener noreferrer" >
                                    <Github size={17} />
                                </a>
                            )}

                            {organization.contactInfo.ircChannel && (
                                <a href={organization.contactInfo.ircChannel}
                                    target="_blank"
                                    rel="noopener noreferrer" >
                                    <ContactRoundIcon size={17} />
                                </a>
                            )}

                            {organization.contactInfo.contactEmail && (
                                <a href={organization.contactInfo.contactEmail}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <Mail size={17} />
                                </a>
                            )}

                            {organization.contactInfo.mailingList && (
                                <a href={organization.contactInfo.mailingList}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <MailPlusIcon size={17} />
                                </a>
                            )}

                            {organization.contactInfo.twitterUrl && (
                                <a href={organization.contactInfo.twitterUrl}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <XIcon size={17} />
                                </a>
                            )}

                            {organization.contactInfo.blogUrl && (
                                <a href={organization.contactInfo.blogUrl}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <Rss size={17} />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="org-actions">
                        <button className="primary-button compact">
                            Follow
                        </button>

                        {organization.url && (
                            <a
                                href={
                                    organization.url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="icon-button"
                                aria-label="Open organization website"
                            >
                                <ExternalLink
                                    size={17}
                                />
                            </a>
                        )}
                    </div>
                </div>

                <div className="detail-tabs">
                    {[
                        "Overview",
                        "Projects",
                        "Repositories",
                        "Technologies",
                        "Topics",
                        "Contributors"
                    ].map((item) => (
                        <button
                            key={item}
                            className={
                                tab === item
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setTab(
                                    item as Tab
                                )
                            }
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </section>

            <section className="detail-content">
                {/*
                 * Kept exactly as your existing
                 * hardcoded component.
                 */}
                {tab === "Overview" && (
                    <OverviewContent data={organization} projectsPerYear={projectsPerYear} />
                )}

                {/*
                 * Projects now use your backend
                 * projectsPerYear endpoint.
                 */}
                {tab === "Projects" && (
                    <>
                        {projectsPerYear.length === 0 ? (
                            /*
                             * Keep your existing hardcoded
                             * ProjectPreview as fallback.
                             */
                            <ProjectPreview />
                        ) : (
                            <section>
                                <div className="">
                                    <ProjectTabOrganization projectsPerYear={projectsPerYear} organizationId={organizationId} />
                                </div>
                            </section>
                        )}
                    </>
                )}

                {/*
                 * Repositories use your backend
                 * repositories endpoint.
                 */}
                {tab ===
                    "Repositories" && (
                        <section>
                            <RepoTabOrg orgId={organizationId} />
                        </section>
                    )}


                {tab === "Technologies" && (
                    <TagContent
                        title="Technologies"
                        tags={
                            organization.technologies
                        }
                    />
                )}

                {tab === "Topics" && (
                    <TagContent
                        title="Research topics"
                        tags={
                            organization.topics
                        }
                    />
                )}

                {/*
                 * Existing hardcoded contributor
                 * component is preserved.
                 */}
                {tab === "Contributors" && (
                    <ContributorPreview orgId={organizationId} />
                )}
            </section>
        </main>
    );
}
