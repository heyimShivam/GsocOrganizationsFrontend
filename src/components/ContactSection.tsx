"use client";

import {
    Mail,
    MessageCircle,
    MapPin,
    Send,
    Loader2,
} from "lucide-react";

import { toast } from "sonner";

import "@/css/ContactSection.css";

export default function ContactSection() {
    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message"),
        };

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact-us`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Request failed: ${response.status}`
                );
            }

            const result = await response.json();

            form.reset();

            toast.success("Message sent successfully!", {
                description:
                    "Thanks for reaching out. We'll get back to you soon.",
            });
        } catch (error) {
            toast.error("Failed to send message", {
                description:
                    "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <section
            className="contactSection"
            id="contact"
        >
            <div className="contactContainer">
                <div className="contactPanel">

                    {/* LEFT SIDE */}

                    <div className="contactIntro">
                        <div className="contactBadge">
                            GET IN TOUCH
                        </div>

                        <h2 className="contactTitle">
                            Have a question?
                            <span>
                                Let&apos;s talk.
                            </span>
                        </h2>

                        <p className="contactDescription">
                            Have feedback, suggestions, or an idea
                            for GSoC Hub? We&apos;d love to hear
                            from you.
                        </p>

                        <div className="contactDetails">

                            <div className="contactDetail">
                                <div className="contactDetailIcon">
                                    <Mail size={21} />
                                </div>

                                <div className="contactDetailContent">
                                    <span>Email</span>

                                    <strong>
                                        hello@gsoc-hub.dev
                                    </strong>
                                </div>
                            </div>


                            <div className="contactDetail">
                                <div className="contactDetailIcon">
                                    <MessageCircle size={21} />
                                </div>

                                <div className="contactDetailContent">
                                    <span>Community</span>

                                    <strong>
                                        Open Source · GSoC
                                    </strong>
                                </div>
                            </div>

                            <div className="contactDetail">
                                <div className="contactDetailIcon">
                                    <MapPin size={21} />
                                </div>

                                <div className="contactDetailContent">
                                    <span>Built for</span>

                                    <strong>
                                        Students · Mentors · OSS
                                    </strong>
                                </div>
                            </div>

                        </div>

                        <div className="contactBottomText">
                            Open source. A brighter tomorrow. 🚀
                        </div>
                    </div>

                    <div className="contactFormWrapper">
                        <form
                            className="contactForm"
                            onSubmit={handleSubmit}
                        >

                            <div className="contactFormRow">

                                <div className="contactField">
                                    <label htmlFor="name">
                                        Name
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Your name"
                                        autoComplete="name"
                                        required
                                    />
                                </div>

                                <div className="contactField">
                                    <label htmlFor="email">
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                            </div>


                            <div className="contactField">
                                <label htmlFor="subject">
                                    Subject
                                </label>

                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    placeholder="What would you like to talk about?"
                                    required
                                />
                            </div>


                            <div className="contactField">
                                <label htmlFor="message">
                                    Message
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Tell us what's on your mind..."
                                    rows={6}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="contactSubmit"
                            >
                                <span>
                                    Send Message
                                </span>

                                <Send size={19} />
                            </button>

                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}