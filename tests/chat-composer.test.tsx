import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { useChatComposer } from "@/hooks/useChatComposer";

test("publishes a message for the active channel", () => {
    const publish = vi.fn();
    const clientRef = {
        current: { connected: true, publish },
    } as never;

    const { result } = renderHook(() => useChatComposer({
        activeChannel: {
            id: "general",
            name: "general",
            description: "General discussion",
        },
        clientRef,
    }));

    act(() => result.current.setMessageInput("Hello community"));
    act(() => result.current.sendMessage());

    expect(publish).toHaveBeenCalledWith({
        destination: "/app/chat.send",
        body: JSON.stringify({
            channelId: "general",
            message: "Hello community",
        }),
    });
    expect(result.current.messageInput).toBe("");
});
