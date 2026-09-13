"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
    LogOut,
    Menu,
    UserRound,
    Sparkles,
    X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const navItems = [
    { label: "Explore", href: "/explore" },
    { label: "Guide", href: "/guide" },
    { label: "Community", href: "/community" },
];

export function SiteHeader({
    landing = false,
}: {
    landing?: boolean;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const [menuOpen, setMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const { user, logout } = useAuth();

    const handleProfileClick = () => {
        setProfileMenuOpen(false);
        router.push("/profile");
    };

    const handleLogout = async () => {
        setProfileMenuOpen(false);

        console.log(logout);

        await logout();

        router.push("/");
    };

    const handleSignIn = () => {
        const redirectUrl =
            pathname +
            (window.location.search
                ? window.location.search
                : "");

        router.push(
            `/login?redirect=${encodeURIComponent(
                redirectUrl
            )}`
        );
    };

    const getUserInitials = () => {
        if (!user?.name) {
            return "U";
        }

        const nameParts = user.name
            .trim()
            .split(/\s+/);

        if (nameParts.length === 1) {
            return nameParts[0]
                .substring(0, 2)
                .toUpperCase();
        }

        return (
            nameParts[0].charAt(0) +
            nameParts[1].charAt(0)
        ).toUpperCase();
    };

    return (
        <header className="site-header">
            <Link
                href="/"
                className="brand"
                aria-label="GSoC Hub home"
            >
                <span className="brand-mark">
                    <Sparkles size={20} />
                </span>

                <span>
                    GSoC <b>Hub</b>
                </span>
            </Link>

            <nav
                className={
                    menuOpen
                        ? "main-nav open"
                        : "main-nav"
                }
                aria-label="Main navigation"
            >
                {navItems.map((item) => {
                    const active =
                        pathname === item.href;

                    return (
                        <Link
                            href={item.href}
                            key={item.label}
                            className={
                                active
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="header-actions">
                {landing && !user ? (
                    <button
                        type="button"
                        className="sign-in"
                        onClick={handleSignIn}
                    >
                        Sign in
                    </button>
                ) : user ? (
                    <div
                        className="profileMenuWrapper"
                        onMouseEnter={() =>
                            setProfileMenuOpen(true)
                        }
                        onMouseLeave={() =>
                            setProfileMenuOpen(false)
                        }
                    >
                        <button
                            type="button"
                            className="avatar"
                            aria-label="Open account menu"
                            aria-expanded={
                                profileMenuOpen
                            }
                            onClick={() =>
                                setProfileMenuOpen(
                                    !profileMenuOpen
                                )
                            }
                        >
                            {getUserInitials()}
                        </button>

                        {profileMenuOpen && (
                            <div className="profileDropdown">
                                <div className="profileDropdownUser">
                                    <strong>
                                        {user.name}
                                    </strong>

                                    <span>
                                        {user.email}
                                    </span>
                                </div>

                                <div className="profileDropdownDivider" />

                                <button
                                    type="button"
                                    className="profileDropdownItem"
                                    onClick={
                                        handleProfileClick
                                    }
                                >
                                    <UserRound
                                        size={17}
                                    />
                                    <span>
                                        View Profile
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    className="profileDropdownItem profileDropdownLogout"
                                    onClick={
                                        handleLogout
                                    }
                                >
                                    <LogOut size={17} />
                                    <span>
                                        Logout
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        className="sign-in"
                        onClick={handleSignIn}
                    >
                        Sign in
                    </button>
                )}

                <button
                    type="button"
                    className="menu-button"
                    onClick={() =>
                        setMenuOpen(!menuOpen)
                    }
                    aria-label="Toggle menu"
                >
                    {menuOpen ? (
                        <X />
                    ) : (
                        <Menu />
                    )}
                </button>
            </div>
        </header>
    );
}