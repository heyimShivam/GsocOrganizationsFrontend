"use client";
import Link from "next/link";
import { useState } from "react";
import {
    ArrowLeft,
    Check,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    UserRound,
    Github,
} from "lucide-react";

import { toast } from "sonner";
import "@/css/Auth.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [acceptedTerms, setAcceptedTerms] =
        useState(false);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
            githubUsername: formData.get("githubUsername"),
        };

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Something went wrong. Please try again."
                );
            }

            console.log("Registration successful:", result);

            toast.success("Registration successful!", {
                description:
                    result.message ||
                    "Registration successful. Please verify your email.",
            });

            const redirectUrl = searchParams.get("redirect");

            if (redirectUrl) {
                router.push(redirectUrl);
            } else {
                router.push("/");
            }

        } catch (error) {
            console.error("Signup error:", error);

            toast.error("Signup failed!", {
                description:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <main className="authPage">
            <div className="authStars" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
            </div>

            <div className="authCard authSignupCard">

                <Link href="/" className="authBack">
                    <ArrowLeft size={17} />
                    <span>Back to home</span>
                </Link>

                <div className="authBrand">
                    <div className="authBrandMark">
                        <span>&lt;/&gt;</span>
                    </div>

                    <h1>
                        GSoC <span>Hub</span>
                    </h1>

                    <p>
                        Open source today,
                        <br />
                        a brighter tomorrow.
                    </p>
                </div>

                <div className="authHeading">
                    <h2>Create your account</h2>

                    <p>
                        Join GSoC Hub and start your open
                        source journey.
                    </p>
                </div>

                <form
                    className="authForm"
                    onSubmit={handleSubmit}
                >
                    <div className="authField">
                        <div className="authFieldIcon">
                            <UserRound size={19} />
                        </div>

                        <input
                            type="text"
                            name="name"
                            placeholder="Full name"
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="authField">
                        <div className="authFieldIcon">
                            <Mail size={19} />
                        </div>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="authField">
                        <div className="authFieldIcon">
                            <LockKeyhole size={19} />
                        </div>

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            name="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            required
                        />

                        <button
                            type="button"
                            className="authPasswordButton"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    <div className="authField">
                        <div className="authFieldIcon">
                            <LockKeyhole size={19} />
                        </div>

                        <input
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            name="confirmPassword"
                            placeholder="Confirm password"
                            autoComplete="new-password"
                            required
                        />

                        <button
                            type="button"
                            className="authPasswordButton"
                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                            aria-label={
                                showConfirmPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    <div className="authField">
                        <div className="authFieldIcon">
                            <Github size={19} />
                        </div>

                        <input
                            type="text"
                            name="githubUsername"
                            placeholder="GitHub username"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <label className="authTerms">
                        <span
                            className={
                                acceptedTerms
                                    ? "authCheckbox checked"
                                    : "authCheckbox"
                            }
                        >
                            {acceptedTerms && (
                                <Check size={13} />
                            )}

                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(event) =>
                                    setAcceptedTerms(
                                        event.target.checked
                                    )
                                }
                            />
                        </span>

                        <span>
                            I agree to the{" "}
                            <Link href="/terms">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy">
                                Privacy Policy
                            </Link>
                        </span>
                    </label>

                    <button
                        type="submit"
                        className="authPrimaryButton"
                        disabled={!acceptedTerms}
                    >
                        Create account
                    </button>
                </form>

                <div className="authDivider">
                    <span />
                    <b>OR</b>
                    <span />
                </div>

                <button
                    type="button"
                    className="authGoogleButton"
                    onClick={() => {
                        window.location.href =
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/google`;
                    }}
                >
                    <span className="googleLogo">G</span>
                    <span>Continue with Google</span>
                </button>

                <p className="authSwitch">
                    Already have an account?{" "}
                    <Link href="/login">
                        Sign in
                    </Link>
                </p>

                <div className="authHorizon">
                    <div className="authMountain authMountainOne" />
                    <div className="authMountain authMountainTwo" />
                    <div className="authHorizonLine" />
                </div>

                <div className="authFooter">
                    Students
                    <span>•</span>
                    Mentors
                    <span>•</span>
                    Open Source
                </div>
            </div>
        </main>
    );
}
