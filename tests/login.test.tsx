import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";

const { push, setUser, success } = vi.hoisted(() => ({
    push: vi.fn(),
    setUser: vi.fn(),
    success: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push }),
    useSearchParams: () => new URLSearchParams(""),
}));

vi.mock("@/context/AuthContext", () => ({
    useAuth: () => ({ setUser }),
}));

vi.mock("sonner", () => ({
    toast: { success, error: vi.fn() },
}));

import LoginPage from "@/app/login/page";

beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
});

test("logs in and returns to the home page", async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
            id: "user-1",
            name: "Ada Lovelace",
            email: "ada@example.com",
            role: "USER",
        }),
    } as Response);

    render(<LoginPage />);
    await user.type(screen.getByPlaceholderText("Email address"), "ada@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password");
    fireEvent.submit(screen.getByRole("button", { name: "Sign in" }).closest("form")!);

    await waitFor(() => expect(setUser).toHaveBeenCalledWith(
        expect.objectContaining({ email: "ada@example.com" })
    ));
    expect(success).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/");
});
