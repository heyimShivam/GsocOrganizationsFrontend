"use client";

import { MutableRefObject, useCallback, useState } from "react";

import { Client } from "@stomp/stompjs";
import { toast } from "sonner";

import { ChatChannel } from "@/types/Community";

type ChatComposerOptions = {
    activeChannel: ChatChannel | null;
    clientRef: MutableRefObject<Client | null>;
};

export function useChatComposer({
    activeChannel,
    clientRef,
}: ChatComposerOptions) {
    const [messageInput, setMessageInput] = useState("");
    const [sending, setSending] = useState(false);

    const sendMessage = useCallback(() => {
        const message = messageInput.trim();

        if (!message) {
            toast.error("Message cannot be empty.");
            return;
        }

        if (!activeChannel) {
            toast.error("Please select a channel.");
            return;
        }

        if (sending) {
            return;
        }

        const client = clientRef.current;

        if (!client?.connected) {
            toast.error("Chat is not connected.", {
                description: "Please wait a moment and try again.",
            });
            return;
        }

        try {
            setSending(true);
            client.publish({
                destination: "/app/chat.send",
                body: JSON.stringify({
                    channelId: activeChannel.id,
                    message,
                }),
            });
            setMessageInput("");
        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error("Failed to send message.", {
                description: "Please try again.",
            });
        } finally {
            setSending(false);
        }
    }, [activeChannel, clientRef, messageInput, sending]);

    const handleKeyDown = useCallback((
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }, [sendMessage]);

    return {
        messageInput,
        setMessageInput,
        sending,
        sendMessage,
        handleKeyDown,
    };
}
