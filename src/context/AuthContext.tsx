"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import { toast } from "sonner";

/* =========================================================
   TYPES
========================================================= */

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    description: string;
    githubUsername: string | null;
    quote: string;
    bookmarkedOrganizationIds: string[];

    _links?: {
        self?: {
            href: string;
        };

        bookmarks?: {
            href: string;
        };

        logout?: {
            href: string;
        };
    };
};

export type AuthContextType = {
    user: User | null;

    setUser: (user: User | null) => void;

    logout: () => Promise<void>;

    loading: boolean;

    refreshUser: () => Promise<User | null>;
};

/* =========================================================
   CONTEXT
========================================================= */

const AuthContext = createContext<
    AuthContextType | undefined
>(undefined);

/* =========================================================
   PROVIDER
========================================================= */

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    /* =====================================================
       LOAD CURRENT USER
    ===================================================== */

    useEffect(() => {
        const loadCurrentUser = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                /*
                 * 401 is expected when the visitor
                 * is not logged in.
                 *
                 * Do NOT redirect here.
                 *
                 * The page decides what to do:
                 *
                 * Community → show login modal
                 * Protected page → redirect to login
                 */

                if (response.status === 401) {
                    setUser(null);

                    return;
                }

                /*
                 * Any other non-success response
                 * is an actual error.
                 */

                if (!response.ok) {
                    throw new Error(
                        `Failed to load current user: ${response.status}`
                    );
                }

                /*
                 * Authenticated user.
                 */

                const result: User =
                    await response.json();

                setUser(result);

            } catch (error) {
                /*
                 * Network/server error.
                 *
                 * We still treat the user as logged out
                 * so the application doesn't get stuck.
                 */

                console.error(
                    "[Auth] Failed to load current user:",
                    error
                );

                setUser(null);

            } finally {

                setLoading(false);

            }
        };

        loadCurrentUser();
    }, []);

    /* =====================================================
       REFRESH CURRENT USER
    ===================================================== */

    const refreshUser =
        async (): Promise<User | null> => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                /*
                 * User is simply not authenticated.
                 */

                if (response.status === 401) {
                    setUser(null);

                    return null;
                }

                /*
                 * Actual backend error.
                 */

                if (!response.ok) {
                    throw new Error(
                        `Failed to refresh current user: ${response.status}`
                    );
                }

                /*
                 * Authenticated user.
                 */

                const result: User =
                    await response.json();

                setUser(result);

                return result;

            } catch (error) {
                console.error(
                    "[Auth] Failed to refresh current user:",
                    error
                );

                setUser(null);

                return null;
            }
        };

    /* =====================================================
       LOGOUT
    ===================================================== */

    const logout = async (): Promise<void> => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Logout failed: ${response.status}`
                );
            }

            /*
             * Remove user from React state.
             */

            setUser(null);

            toast.success(
                "Logged out successfully!",
                {
                    description:
                        "See you again soon.",
                }
            );

        } catch (error) {
            console.error(
                "[Auth] Logout error:",
                error
            );

            toast.error(
                "Logout failed!",
                {
                    description:
                        "Something went wrong. Please try again.",
                }
            );
        }
    };

    /* =====================================================
       CONTEXT PROVIDER
    ===================================================== */

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                logout,
                loading,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/* =========================================================
   USE AUTH
========================================================= */

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
