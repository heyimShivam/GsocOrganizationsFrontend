"use client";

import { useEffect } from "react";

import { SiteHeader } from "@/components/SiteHeader";

export default function RouteError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="app-shell">
            <SiteHeader />
            <section className="detail-content">
                <div className="empty-state" role="alert">
                    <p>We couldn’t load this page.</p>
                    <button
                        type="button"
                        className="primary-button"
                        onClick={reset}
                    >
                        Try again
                    </button>
                </div>
            </section>
        </main>
    );
}
