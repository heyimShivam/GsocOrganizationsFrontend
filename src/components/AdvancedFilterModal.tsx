"use client";

import { X } from "lucide-react";
import { useState } from "react";
import Pill from "./Pill";

type FilterSection =
    | "Years"
    | "Categories"
    | "Technologies"
    | "Topics"
    | "Status";

type AdvancedFilterModalProps = {
    close: () => void;

    clearFilters: () => void;

    years: number[];
    categories: string[];
    technologies: string[];
    topics: string[];

    selectedYears: number[];
    selectedCategories: string[];
    selectedTechnologies: string[];
    selectedTopics: string[];

    status: "Active" | "Inactive" | "Both";

    toggleYear: (year: number) => void;
    toggleCategory: (category: string) => void;
    toggleTechnology: (technology: string) => void;
    toggleTopic: (topic: string) => void;

    setStatus: (
        status: "Active" | "Inactive" | "Both"
    ) => void;
};

export default function AdvancedFilterModal({
    close,
    clearFilters,

    years,
    categories,
    technologies,
    topics,

    selectedYears,
    selectedCategories,
    selectedTechnologies,
    selectedTopics,

    status,

    toggleYear,
    toggleCategory,
    toggleTechnology,
    toggleTopic,

    setStatus
}: AdvancedFilterModalProps) {
    const [tab, setTab] =
        useState<FilterSection>("Years");

    const tabs: FilterSection[] = [
        "Years",
        "Categories",
        "Technologies",
        "Topics",
        "Status"
    ];

    const getOptions = () => {
        if (tab === "Categories") {
            return categories;
        }

        if (tab === "Technologies") {
            return technologies;
        }

        if (tab === "Topics") {
            return topics;
        }

        return [];
    };

    const getSelected = () => {
        if (tab === "Categories") {
            return selectedCategories;
        }

        if (tab === "Technologies") {
            return selectedTechnologies;
        }

        if (tab === "Topics") {
            return selectedTopics;
        }

        return [];
    };

    const getToggle = () => {
        if (tab === "Categories") {
            return toggleCategory;
        }

        if (tab === "Technologies") {
            return toggleTechnology;
        }

        return toggleTopic;
    };

    const options = getOptions();
    const selected = getSelected();
    const toggle = getToggle();

    return (
        <div
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="advanced-filter-title"
        >
            <div className="advanced-modal">
                <div className="modal-title">
                    <h2 id="advanced-filter-title">
                        Advanced Filters
                    </h2>

                    <button
                        onClick={close}
                        aria-label="Close advanced filters"
                    >
                        <X />
                    </button>
                </div>

                <div className="modal-body">
                    <nav
                        aria-label="Advanced filter groups"
                    >
                        {tabs.map((item) => (
                            <button
                                key={item}
                                onClick={() =>
                                    setTab(item)
                                }
                                className={
                                    tab === item
                                        ? "active"
                                        : ""
                                }
                            >
                                {item}
                            </button>
                        ))}
                    </nav>

                    <div className="modal-options">
                        <h3>
                            Select {tab}
                        </h3>

                        {/* YEARS */}
                        {tab === "Years" && (
                            <div className="year-grid">
                                {years.map((year) => (
                                    <label
                                        className="check-row"
                                        key={year}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedYears.includes(
                                                year
                                            )}
                                            onChange={() =>
                                                toggleYear(
                                                    year
                                                )
                                            }
                                        />

                                        <span>
                                            {year}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {/* STATUS */}
                        {tab === "Status" && (
                            <div className="choice-grid">
                                {[
                                    "Active",
                                    "Inactive",
                                    "Both"
                                ].map((item) => (
                                    <Pill
                                        key={item}
                                        active={
                                            status ===
                                            item
                                        }
                                        onClick={() =>
                                            setStatus(
                                                item as
                                                | "Active"
                                                | "Inactive"
                                                | "Both"
                                            )
                                        }
                                    >
                                        {item}
                                    </Pill>
                                ))}
                            </div>
                        )}

                        {tab !== "Years" &&
                            tab !== "Status" && (
                                <div className="choice-grid">
                                    {options.map(
                                        (item) => (
                                            <Pill
                                                key={item}
                                                active={selected.includes(
                                                    item
                                                )}
                                                onClick={() =>
                                                    toggle(
                                                        item
                                                    )
                                                }
                                            >
                                                {item}
                                            </Pill>
                                        )
                                    )}
                                </div>
                            )}

                        {tab === "Years" &&
                            years.length === 0 && (
                                <p className="filter-empty">
                                    No years available
                                </p>
                            )}

                        {tab !== "Years" &&
                            tab !== "Status" &&
                            options.length === 0 && (
                                <p className="filter-empty">
                                    No filters available
                                </p>
                            )}
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="text-button"
                        onClick={clearFilters}
                    >
                        Clear all
                    </button>

                    <span />

                    <button
                        className="secondary-button"
                        onClick={close}
                    >
                        Cancel
                    </button>

                    <button
                        className="primary-button"
                        onClick={close}
                    >
                        Apply filters
                    </button>
                </div>
            </div>
        </div>
    );
}