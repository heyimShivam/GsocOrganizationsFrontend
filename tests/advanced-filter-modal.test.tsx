import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import AdvancedFilterModal from "@/components/AdvancedFilterModal";

test("applies a category selection through the advanced filter modal", async () => {
    const user = userEvent.setup();
    const toggleCategory = vi.fn();

    render(
        <AdvancedFilterModal
            close={vi.fn()}
            clearFilters={vi.fn()}
            years={[2024]}
            categories={["Research"]}
            technologies={[]}
            topics={[]}
            selectedYears={[]}
            selectedCategories={[]}
            selectedTechnologies={[]}
            selectedTopics={[]}
            status="Both"
            toggleYear={vi.fn()}
            toggleCategory={toggleCategory}
            toggleTechnology={vi.fn()}
            toggleTopic={vi.fn()}
            setStatus={vi.fn()}
        />
    );

    await user.click(screen.getByRole("button", { name: "Categories" }));
    await user.click(screen.getByRole("button", { name: "Research" }));

    expect(toggleCategory).toHaveBeenCalledWith("Research");
});
