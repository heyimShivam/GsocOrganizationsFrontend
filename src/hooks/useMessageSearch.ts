"use client";

import { useMemo, useState } from "react";

import { ChatMessage } from "@/types/Community";

export function useMessageSearch(messages: ChatMessage[]) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredMessages = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        if (!query) {
            return messages;
        }

        return messages.filter((message) => (
            message.message.toLowerCase().includes(query) ||
            message.userName.toLowerCase().includes(query) ||
            message.githubUsername?.toLowerCase().includes(query)
        ));
    }, [messages, searchQuery]);

    return {
        searchQuery,
        setSearchQuery,
        filteredMessages,
    };
}
