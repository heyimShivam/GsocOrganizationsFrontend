"use client";

import {
    ArrowLeft,
    ArrowRight,
    Check,
    Code2,
    FileText,
    Flag,
    Leaf,
    Users,
    UserRound,
} from "lucide-react";

import "./GuideJourney.css";

const journeySteps = [
    {
        number: 1,
        phase: "EXPLORE",
        period: "Sep – Dec",
        title: "Discover Organizations",
        description:
            "Explore open source organizations, their domains, and past GSoC data to find the right fit.",
        items: [
            "Search and filter organizations",
            "Explore past projects",
            "Shortlist interesting domains",
        ],
        icon: Leaf,
    },
    {
        number: 2,
        phase: "SHORTLIST",
        period: "1 Jan - 15 Jan",
        title: "Compare and Find Your Fit",
        description:
            "Evaluate organizations and project ideas based on your skills, interests and goals.",
        items: [
            "Compare tech stacks",
            "Read project descriptions",
            "Create your shortlist",
        ],
        icon: UserRound,
    },
    {
        number: 3,
        phase: "PREPARE",
        period: "Jan – Apr",
        title: "Start Contributing",
        description:
            "Read documentation, explore repositories, and start contributing before the application period.",
        items: [
            "Understand the codebase",
            "Make meaningful contributions",
            "Engage with the community",
        ],
        icon: Code2,
    },
    {
        number: 4,
        phase: "APPLY",
        period: "Apr – May",
        title: "Write a Strong Proposal",
        description:
            "Understand the requirements, follow guidelines, and submit a well-crafted proposal.",
        items: [
            "Read proposal guidelines",
            "Highlight past contributions",
            "Submit before the deadline",
        ],
        icon: FileText,
    },
    {
        number: 5,
        phase: "CONTRIBUTE",
        period: "May – Aug",
        title: "Build & Make an Impact",
        description:
            "Get selected, work with mentors, contribute to the project, and be part of a global open source community.",
        items: [
            "Collaborate with mentors",
            "Ship meaningful code",
            "Grow as an open source contributor",
        ],
        icon: Users,
    },
];

export default function GuideJourney() {
    return (
        <section className="guideJourney">

            <div className="guideJourneyContainer">
                <div className="guideJourneyHeader">

                    <div className="guideJourneyHeaderContent">

                        <div className="guideJourneyBadge">
                            STEP-BY-STEP
                        </div>

                        <h2 className="guideJourneyTitle">
                            Your GSoC Journey
                        </h2>

                        <p className="guideJourneyDescription">
                            From exploration to real-world impact. Follow these
                            steps to make the most of your GSoC experience.
                        </p>

                    </div>


                </div>


                {/* TIMELINE */}
                <div className="guideJourneyTimeline">

                    {/* CURVED LINE */}

                    <svg
                        className="guideJourneyCurve"
                        viewBox="0 0 1000 280"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >

                        <defs>

                            <linearGradient
                                id="journeyLine"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#087cff"
                                />

                                <stop
                                    offset="50%"
                                    stopColor="#168cff"
                                />

                                <stop
                                    offset="100%"
                                    stopColor="#087cff"
                                />
                            </linearGradient>

                            <filter
                                id="journeyGlow"
                                x="-20%"
                                y="-100%"
                                width="140%"
                                height="300%"
                            >
                                <feGaussianBlur
                                    stdDeviation="4"
                                />
                            </filter>

                        </defs>


                        {/* Glow */}

                        <path
                            className="guideJourneyCurveGlow"
                            d="
                                M 25 145
                                C 95 145 110 190 200 190
                                C 285 190 305 125 400 125
                                C 485 125 500 175 600 175
                                C 690 175 710 145 800 145
                                C 885 145 900 190 975 190
                            "
                        />


                        {/* Main line */}

                        <path
                            className="guideJourneyCurveMain"
                            d="
                                M 25 145
                                C 95 145 110 190 200 190
                                C 285 190 305 125 400 125
                                C 485 125 500 175 600 175
                                C 690 175 710 145 800 145
                                C 885 145 900 190 975 190
                            "
                        />

                    </svg>


                    {/* STEPS */}

                    <div className="guideJourneySteps">

                        {journeySteps.map((step) => {

                            const Icon = step.icon;

                            return (
                                <article
                                    key={step.number}
                                    className={`
                                        guideJourneyStep
                                        guideJourneyStep${step.number}
                                    `}
                                >

                                    {/* CARD */}

                                    <div className="guideJourneyCard">

                                        <div className="guideJourneyCardHeader">

                                            <span className="guideJourneyNumber">
                                                {step.number}
                                            </span>

                                            <span className="guideJourneyPhase">
                                                {step.phase}
                                            </span>

                                            <span className="guideJourneyPeriod">
                                                {step.period}
                                            </span>

                                            <div className="guideJourneyIcon">
                                                <Icon size={23} />
                                            </div>

                                        </div>


                                        <h3 className="guideJourneyCardTitle">
                                            {step.title}
                                        </h3>


                                        <p className="guideJourneyCardDescription">
                                            {step.description}
                                        </p>


                                        <ul className="guideJourneyChecklist">

                                            {step.items.map((item) => (
                                                <li key={item}>

                                                    <span className="guideJourneyCheck">
                                                        <Check size={13} />
                                                    </span>

                                                    <span>
                                                        {item}
                                                    </span>

                                                </li>
                                            ))}

                                        </ul>

                                    </div>


                                    {/* CARD → TIMELINE CONNECTOR */}

                                    <span className="guideJourneyConnector" />


                                    {/* NODE */}

                                    <div
                                        className={`
                                            guideJourneyNode
                                            ${step.number === 5
                                                ? "guideJourneyNodeFlag"
                                                : ""
                                            }
                                        `}
                                    >

                                        {step.number === 16 ? (
                                            <Check size={19} />
                                        ) : step.number === 5 ? (
                                            <Flag size={17} />
                                        ) : (
                                            <span>
                                                {step.number}
                                            </span>
                                        )}

                                    </div>

                                </article>
                            );
                        })}

                    </div>


                </div>

            </div>

        </section>
    );
}