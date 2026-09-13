import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import Pagination from "@/components/Pagination";

test("moves through pages and disables unavailable controls", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
        <Pagination
            currentPage={1}
            totalPages={3}
            onPageChange={onPageChange}
        />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(buttons.at(-1)!);

    expect(onPageChange).toHaveBeenNthCalledWith(1, 2);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 2);
});
