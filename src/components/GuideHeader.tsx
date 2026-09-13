"use client";

import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    Code2,
    Lightbulb,
    UsersRound,
    ChevronsRight
} from "lucide-react";

import "./GuideHeader.css";

export default function GuideHeader() {
    return (
        <section className="guideHeader">
            <div className="guideHeaderBackground" aria-hidden="true">
                <div className="guideHeaderGlow guideHeaderGlowLeft" />
                <div className="guideHeaderGlow guideHeaderGlowRight" />
            </div>

            <div className="guideHeaderContainer">
                <div className="guideHeaderContent">
                    <div className="guideHeaderBadge">
                        <span className="guideHeaderBadgeDot" />
                        GUIDE
                    </div>

                    <h1 className="guideHeaderTitle">
                        Your GSoC Journey
                        <span>Made Simple</span>
                    </h1>

                    <p className="guideHeaderDescription">
                        A step-by-step guide to help you get the best out of
                        GSoC Hub. Find, filter and explore organizations,
                        understand the contribution process, and kickstart
                        your open source journey with confidence.
                    </p>

                    <div className="guideHeaderActions">
                        <Link
                            href="/explore"
                            className="guideHeaderPrimaryButton"
                        >
                            <span>Start Exploring</span>
                            <ArrowRight size={20} />
                        </Link>

                    </div>

                    <div className="guideHeaderTrust">
                        <div className="guideHeaderTrustItem">
                            <CheckCircle2 size={19} />
                            <span>Curated resources</span>
                        </div>

                        <div className="guideHeaderTrustItem">
                            <CheckCircle2 size={19} />
                            <span>Beginner friendly</span>
                        </div>

                        <div className="guideHeaderTrustItem">
                            <CheckCircle2 size={19} />
                            <span>Community driven</span>
                        </div>
                    </div>
                </div>

                <div className="guideHeaderVisual">
                    <div className="guideVisualAmbient" />
                    <div className="guideCodePanel">
                        <div className="guideCodePanelDot" />

                        <div className="guideCodeRow guideCodeBlue">
                            <span>learn</span>()
                        </div>

                        <div className="guideCodeRow guideCodeGold">
                            build()
                        </div>

                        <div className="guideCodeRow guideCodeWhite">
                            contribute()
                        </div>

                        <div className="guideCodeRow guideCodeBlue">
                            grow()
                            <span className="guideCodeCaret" />
                        </div>
                    </div>
                    <div className="guideVisualNote">
                        <span>Open Source</span>
                        <small>A Brighter Tomorrow</small>

                        <div className="rotate-sign">
                            <svg
                                viewBox="0 0 100 70"
                                aria-hidden="true"
                                className="guideNoteArrow"
                            >
                                <defs>
                                    <marker
                                        id="guideArrowHead"
                                        viewBox="0 0 10 10"
                                        refX="8"
                                        refY="5"
                                        markerWidth="6"
                                        markerHeight="6"
                                        orient="auto"
                                    >
                                        <path
                                            d="M 2 1 L 8 5 L 2 9"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </marker>
                                </defs>

                                <path
                                    d="M 8 10 C 48 4, 82 12, 72 50"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    markerEnd="url(#guideArrowHead)"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="guideVisualCards">
                        <div className="guideVisualCard guideVisualCardIdeas">
                            <div className="guideVisualCardIcon">
                                <Lightbulb size={25} />
                            </div>

                            <span>Ideas</span>
                        </div>

                        <div className="guideVisualCard guideVisualCardCode">
                            <div className="guideVisualCardIcon">
                                <Code2 size={29} />
                            </div>

                            <span>Code</span>
                        </div>

                        <div className="guideVisualCard guideVisualCardImpact">
                            <div className="guideVisualCardIcon">
                                <UsersRound size={25} />
                            </div>

                            <span>Impact</span>
                        </div>
                    </div>

                    <div className="guideVisualJourney">
                        <span>Students</span>
                        <ChevronsRight size={14} />
                        <span>Contributors</span>
                        <ChevronsRight size={14} />
                        <span>Stronger Communities</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
