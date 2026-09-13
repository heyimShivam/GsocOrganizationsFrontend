"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    ChevronDown,
    MessageCircle,
    Mail,
    Sparkles,
} from "lucide-react";

import "./GuideFaq.css";

const faqs = [
    {
        question: "What is Google Summer of Code (GSoC)?",
        answer:
            "Google Summer of Code is a global program that brings new contributors into open source communities. Contributors work on real projects with guidance from experienced mentors.",
    },
    {
        question: "How does GSoC Hub help me?",
        answer:
            "GSoC Hub helps you discover organizations, explore technologies, compare opportunities, and understand the contribution journey before applying.",
    },
    {
        question: "Do I need prior open source experience?",
        answer:
            "No. Prior open source experience is helpful, but it is not required. Starting early, learning the project, and making meaningful contributions can help you prepare.",
    },
    {
        question: "When does the GSoC application period start?",
        answer:
            "GSoC dates can change from year to year. Check the official GSoC timeline and the organization's own announcements for the current application schedule.",
    },
];

export default function GuideFaq() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq((current) => (current === index ? null : index));
    };

    return (
        <section className="guideFaq">
            <div className="guideFaqContainer">
                <div className="guideFaqTop">
                    {/* FAQ */}
                    <div className="guideFaqContent">
                        <div className="guideFaqHeadingRow">
                            <div>
                                <div className="guideFaqBadge">
                                    FREQUENTLY ASKED QUESTIONS
                                </div>

                                <h2 className="guideFaqTitle">
                                    Got Questions?
                                </h2>

                                <p className="guideFaqDescription">
                                    Find answers to common questions about GSoC
                                    and using GSoC Hub.
                                </p>
                            </div>
                        </div>

                        <div className="guideFaqList">
                            {faqs.map((faq, index) => {
                                const isOpen = openFaq === index;

                                return (
                                    <div
                                        key={faq.question}
                                        className={`guideFaqItem ${isOpen
                                            ? "guideFaqItemOpen"
                                            : ""
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            className="guideFaqQuestion"
                                            onClick={() =>
                                                toggleFaq(index)
                                            }
                                            aria-expanded={isOpen}
                                        >
                                            <span>{faq.question}</span>

                                            <span className="guideFaqQuestionIcon">
                                                <ChevronDown
                                                    size={15}
                                                />
                                            </span>
                                        </button>

                                        <div className="guideFaqAnswer">
                                            <p>{faq.answer}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Support card */}
                    <div className="guideFaqSupport">
                        <div className="guideFaqSupportGlow" />

                        <div className="guideFaqSupportWave">
                            <span />
                        </div>

                        <div className="guideFaqSupportIcon">
                            <MessageCircle size={25} />
                        </div>

                        <div className="guideFaqSupportContent">
                            <h3>Still need help?</h3>

                            <p>
                                Join our community or reach out. We're here
                                to support you on your open source journey.
                            </p>

                            <div className="guideFaqSupportActions">
                                <Link
                                    href="/community"
                                    className="guideFaqDiscordButton"
                                >
                                    <MessageCircle size={13} />
                                    <span>Join Discord</span>
                                    <ArrowRight size={13} />
                                </Link>

                                <Link
                                    href="/contact"
                                    className="guideFaqContactButton"
                                >
                                    <Mail size={13} />
                                    <span>Contact Us</span>
                                </Link>
                            </div>
                        </div>

                        <div className="guideFaqSupportNote">
                            <span>A supportive</span>
                            <span>community</span>
                            <span>always here.</span>

                            <div className="guideFaqHeart">♥</div>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="guideFaqCta">
                    <div className="guideFaqCtaIcon">
                        <Sparkles size={22} />
                    </div>

                    <div className="guideFaqCtaContent">
                        <h3>Ready to begin?</h3>

                        <p>
                            Explore organizations, read guides, and take the
                            first step towards your GSoC journey.
                        </p>
                    </div>

                    <Link
                        href="/explore"
                        className="guideFaqCtaButton"
                    >
                        <span>Start Exploring</span>
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
