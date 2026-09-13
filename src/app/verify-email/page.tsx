"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    CheckCircle2,
    XCircle,
    Loader2,
    ArrowRight,
    MailCheck,
} from "lucide-react";
import { toast } from "sonner";
import "@/css/VerifyEmail.css";

type VerificationState =
    | "loading"
    | "success"
    | "error";

export default function VerifyEmailPage() {
    const [status, setStatus] =
        useState<VerificationState>("loading");

    const [message, setMessage] =
        useState("Verifying your email address...");

    useEffect(() => {
        const verifyEmail = async () => {
            const params = new URLSearchParams(
                window.location.search
            );

            const token = params.get("token");

            if (!token) {
                setStatus("error");
                setMessage(
                    "The email verification link is missing a token."
                );

                toast.error("Invalid verification link");

                return;
            }

            try {
                const backendUrl =
                    process.env
                        .NEXT_PUBLIC_BACKEND_URL;

                const response = await fetch(
                    `${backendUrl}/api/auth/verify-email?token=${encodeURIComponent(
                        token
                    )}`,
                    {
                        method: "GET",
                    }
                );

                let result: {
                    message?: string;
                } = {};

                try {
                    result = await response.json();
                } catch {
                }

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Email verification failed."
                    );
                }

                setStatus("success");

                setMessage(
                    result.message ||
                    "Your email has been verified successfully."
                );

                toast.success(
                    "Email verified successfully!"
                );
            } catch (error) {
                console.error(
                    "Email verification error:",
                    error
                );

                setStatus("error");

                setMessage(
                    error instanceof Error
                        ? error.message
                        : "Unable to verify your email. Please try again."
                );

                toast.error("Email verification failed");
            }
        };

        verifyEmail();
    }, []);

    return (
        <main className="verifyEmailPage">
            <div
                className="verifyEmailGlow verifyEmailGlowOne"
                aria-hidden="true"
            />

            <div
                className="verifyEmailGlow verifyEmailGlowTwo"
                aria-hidden="true"
            />

            <section className="verifyEmailCard">
                <Link
                    href="/"
                    className="verifyEmailBrand"
                >
                    <span className="verifyEmailBrandMark">
                        G
                    </span>

                    <span>
                        GSoC <b>Hub</b>
                    </span>
                </Link>
                {status === "loading" && (
                    <div className="verifyEmailContent">
                        <div className="verifyEmailIcon verifyEmailIconLoading">
                            <Loader2
                                size={34}
                                className="verifyEmailSpinner"
                            />
                        </div>

                        <span className="verifyEmailEyebrow">
                            EMAIL VERIFICATION
                        </span>

                        <h1>
                            Verifying your email
                        </h1>

                        <p>
                            Please wait while we verify
                            your email address.
                        </p>

                        <div className="verifyEmailProgress">
                            <span />
                        </div>
                    </div>
                )}

                {status === "success" && (
                    <div className="verifyEmailContent">
                        <div className="verifyEmailIcon verifyEmailIconSuccess">
                            <CheckCircle2
                                size={36}
                            />
                        </div>

                        <span className="verifyEmailEyebrow">
                            EMAIL VERIFIED
                        </span>

                        <h1>
                            You're all set!
                        </h1>

                        <p>
                            {message}
                        </p>

                        <Link
                            href="/login"
                            className="verifyEmailPrimaryButton"
                        >
                            <span>
                                Continue to Login
                            </span>

                            <ArrowRight
                                size={18}
                            />
                        </Link>

                        <Link
                            href="/"
                            className="verifyEmailSecondaryLink"
                        >
                            Back to home
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="verifyEmailContent">
                        <div className="verifyEmailIcon verifyEmailIconError">
                            <XCircle
                                size={36}
                            />
                        </div>

                        <span className="verifyEmailEyebrow">
                            VERIFICATION FAILED
                        </span>

                        <h1>
                            Verification failed
                        </h1>

                        <p>
                            {message}
                        </p>

                        <Link
                            href="/login"
                            className="verifyEmailPrimaryButton"
                        >
                            <span>
                                Go to Login
                            </span>

                            <ArrowRight
                                size={18}
                            />
                        </Link>

                        <Link
                            href="/"
                            className="verifyEmailSecondaryLink"
                        >
                            Back to home
                        </Link>
                    </div>
                )}

                <div className="verifyEmailFooter">
                    <MailCheck size={15} />

                    <span>
                        Secure email verification
                    </span>
                </div>
            </section>
        </main>
    );
}