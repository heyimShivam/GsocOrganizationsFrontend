"use client";

import {
    UsersRound,
    Database,
    SlidersHorizontal,
    BarChart3,
    Search,
    ArrowUpRight,
} from "lucide-react";

import "@/css/LandingFeatureCards.css";

export default function LandingFeatureCards() {
    return (
        <section
            className="landingFeatureCards"
            aria-label="GSoC Hub features"
        >
            <article className="featureCard featureCardBlue">
                <div className="featureCardContent">
                    <div className="featureIcon featureIconBlue">
                        <UsersRound size={30} strokeWidth={1.7} />
                    </div>

                    <div className="featureText">
                        <h3>500+</h3>
                        <p>Organizations</p>
                    </div>

                    <div className="organizationLogos">
                        <div className="brandIcon">
                            <img
                                src="https://cdn.simpleicons.org/google"
                                alt="Google"
                            />
                        </div>

                        <div className="brandIcon">
                            <img
                                src="https://cdn.simpleicons.org/github"
                                alt="GitHub"
                            />
                        </div>

                        <div className="brandIcon">
                            <img
                                src="https://cdn.simpleicons.org/firefox"
                                alt="Firefox"
                            />
                        </div>

                        <div className="brandIcon">
                            <img
                                src="https://cdn.simpleicons.org/linux"
                                alt="Linux"
                            />
                        </div>

                        <div className="brandIcon moreIcon">
                            <span>+</span>
                        </div>
                    </div>
                </div>

                <div className="cardGlobe" aria-hidden="true">
                    <div className="globeRing globeRingOne" />
                    <div className="globeRing globeRingTwo" />
                    <div className="globeRing globeRingThree" />
                    <div className="globeGrid globeGridVertical" />
                    <div className="globeGrid globeGridHorizontal" />
                    <div className="globeDot globeDotOne" />
                    <div className="globeDot globeDotTwo" />
                    <div className="globeDot globeDotThree" />
                </div>

                <div className="cardCornerGlow" />
            </article>

            <article className="featureCard featureCardPurple">
                <div className="featureCardContent">
                    <div className="featureIcon featureIconPurple">
                        <Database size={30} strokeWidth={1.7} />
                    </div>

                    <div className="featureText">
                        <h3>5+ Years</h3>
                        <p>Historical Data</p>
                    </div>
                </div>

                <div className="growthBadge">
                    <div className="growthIcon">
                        <BarChart3 size={25} strokeWidth={1.8} />
                    </div>

                    <div>
                        <strong>Growing</strong>
                        <span>Year by year</span>
                    </div>
                </div>

                <div className="historyChart">
                    <div className="historyBar" style={{ height: "25%" }} />
                    <div className="historyBar" style={{ height: "39%" }} />
                    <div className="historyBar" style={{ height: "52%" }} />
                    <div className="historyBar" style={{ height: "67%" }} />
                    <div className="historyBar" style={{ height: "82%" }} />
                    <div className="historyBar" style={{ height: "100%" }} />
                </div>

                <div className="historyYears">
                    <span>2019</span>
                    <span>2020</span>
                    <span>2021</span>
                    <span>2022</span>
                    <span>2023</span>
                    <span>2024</span>
                </div>

                <div className="cardCornerGlow purpleGlow" />
            </article>

            <article className="featureCard featureCardTeal">
                <div className="featureCardContent">
                    <div className="featureIcon featureIconTeal">
                        <SlidersHorizontal size={30} strokeWidth={1.7} />
                    </div>

                    <div className="featureText">
                        <h3>Smart Filters</h3>
                        <p>Find exactly what matches you</p>
                    </div>
                </div>

                <div className="filterPreview">
                    <div className="filterRow">
                        <span className="filterCircle filterBlue" />
                        <div className="filterLine filterLineLong" />
                    </div>

                    <div className="filterRow">
                        <span className="filterCircle filterGreen" />
                        <div className="filterLine filterLineMedium" />
                    </div>

                    <div className="filterRow">
                        <span className="filterCircle filterCyan" />
                        <div className="filterLine filterLineLong" />
                    </div>

                    <div className="filterRow">
                        <span className="filterCircle filterPurple" />
                        <div className="filterLine filterLineShort" />
                    </div>

                    <div className="filterSearch">
                        <Search size={25} strokeWidth={1.8} />
                    </div>
                </div>

                <div className="filterTags">
                    <span>
                        <i className="tagDot tagBlue" />
                        Languages
                    </span>

                    <span>
                        <i className="tagDot tagGreen" />
                        Technologies
                    </span>

                    <span>
                        <i className="tagDot tagCyan" />
                        Categories
                    </span>

                    <span>
                        <i className="tagDot tagPurple" />
                        Difficulty
                    </span>

                    <span>
                        <i className="tagDot tagPink" />
                        Status
                    </span>
                </div>

                <div className="cardCornerGlow tealGlow" />
            </article>

            <article className="featureCard featureCardOrange">
                <div className="featureCardContent">
                    <div className="featureIcon featureIconOrange">
                        <BarChart3 size={30} strokeWidth={1.7} />
                    </div>

                    <div className="featureText">
                        <h3>
                            Informed
                            <br />
                            Decisions
                        </h3>

                        <p>
                            Understand trends and choose with confidence
                        </p>
                    </div>
                </div>

                <div className="opportunityBadge">
                    <div className="opportunityArrow">
                        <ArrowUpRight size={25} strokeWidth={2} />
                    </div>

                    <div>
                        <strong>More</strong>
                        <span>Opportunities</span>
                    </div>
                </div>

                <div className="decisionChart">
                    <svg
                        viewBox="0 0 600 180"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient
                                id="decisionGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#f59e0b"
                                    stopOpacity="0.22"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#f59e0b"
                                    stopOpacity="0"
                                />
                            </linearGradient>
                        </defs>

                        <path
                            className="decisionArea"
                            d="
                                M0 145
                                C45 125 75 140 110 132
                                C150 122 170 140 205 125
                                C245 108 265 120 300 91
                                C330 66 365 91 400 83
                                C435 75 450 91 480 66
                                C510 42 535 66 560 48
                                C575 37 590 42 600 30
                                L600 180
                                L0 180
                                Z
                            "
                        />

                        <path
                            className="decisionLine"
                            d="
                                M0 145
                                C45 125 75 140 110 132
                                C150 122 170 140 205 125
                                C245 108 265 120 300 91
                                C330 66 365 91 400 83
                                C435 75 450 91 480 66
                                C510 42 535 66 560 48
                                C575 37 590 42 600 30
                            "
                        />

                        <circle
                            className="chartPoint"
                            cx="300"
                            cy="91"
                            r="7"
                        />

                        <circle
                            className="chartPoint"
                            cx="480"
                            cy="66"
                            r="7"
                        />
                    </svg>
                </div>

                <div className="cardCornerGlow orangeGlow" />
            </article>
        </section>
    );
}