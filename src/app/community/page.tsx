"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { SiteHeader } from "@/components/SiteHeader";
import { useChatComposer } from "@/hooks/useChatComposer";
import { useMessageSearch } from "@/hooks/useMessageSearch";
import {
    ChatChannel,
    ChatMessage,
    OnlineCountResponse,
} from "@/types/Community";

import {
    Hash,
    MessageCircle,
    Search,
    Send,
    Smile,
    Users,
    MoreVertical,
    FileText,
    CheckCircle2,
    LogIn,
} from "lucide-react";


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";


export default function CommunityPage() {

    const router = useRouter();

    const {
        user,
        loading: authLoading,
    } = useAuth();


    const [channels, setChannels] =
        useState<ChatChannel[]>([]);

    const [activeChannel, setActiveChannel] =
        useState<ChatChannel | null>(null);

    const [messages, setMessages] =
        useState<ChatMessage[]>([]);

    const [onlineCount, setOnlineCount] =
        useState(0);

    const [loadingChannels, setLoadingChannels] =
        useState(true);

    const [loadingMessages, setLoadingMessages] =
        useState(false);

    const stompClientRef =
        useRef<Client | null>(null);

    const channelSubscriptionRef =
        useRef<StompSubscription | null>(null);

    const activeChannelRef =
        useRef<ChatChannel | null>(null);

    const messagesEndRef =
        useRef<HTMLDivElement | null>(null);

    const {
        messageInput,
        setMessageInput,
        sending,
        sendMessage,
        handleKeyDown,
    } = useChatComposer({
        activeChannel,
        clientRef: stompClientRef,
    });

    const {
        searchQuery,
        setSearchQuery,
        filteredMessages,
    } = useMessageSearch(messages);

    const loadChannels = useCallback(
        async () => {

            try {

                setLoadingChannels(true);

                const response =
                    await fetch(
                        `${BACKEND_URL}/api/chat/channels`,
                        {
                            method: "GET",
                            credentials: "include",
                            cache: "no-store",
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `Failed to load channels: ${response.status}`
                    );
                }


                const result: ChatChannel[] =
                    await response.json();


                setChannels(result);


                if (result.length > 0) {

                    setActiveChannel(
                        (current) => {

                            if (current) {

                                const existing =
                                    result.find(
                                        (channel) =>
                                            channel.id ===
                                            current.id
                                    );


                                if (existing) {
                                    return existing;
                                }
                            }


                            return result[0];
                        }
                    );
                }

            } catch (error) {

                console.error(
                    "Failed to load chat channels:",
                    error
                );


                toast.error(
                    "Unable to load community channels.",
                    {
                        description:
                            "Please refresh the page and try again.",
                    }
                );

            } finally {

                setLoadingChannels(false);
            }

        },
        []
    );

    const loadMessages = useCallback(
        async (
            channelId: string
        ) => {

            try {

                setLoadingMessages(true);


                const response =
                    await fetch(
                        `${BACKEND_URL}/api/chat/channels/${channelId}/messages`,
                        {
                            method: "GET",
                            credentials: "include",
                            cache: "no-store",
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `Failed to load messages: ${response.status}`
                    );
                }


                const result: ChatMessage[] =
                    await response.json();

                setMessages(
                    [...result].reverse()
                );

            } catch (error) {

                console.error(
                    "Failed to load messages:",
                    error
                );


                setMessages([]);


                toast.error(
                    "Unable to load messages.",
                    {
                        description:
                            "Please try again or refresh the page.",
                    }
                );

            } finally {

                setLoadingMessages(false);
            }

        },
        []
    );

    useEffect(() => {

        if (
            !authLoading &&
            user
        ) {

            loadChannels();
        }

    }, [
        authLoading,
        user,
        loadChannels,
    ]);

    useEffect(() => {

        if (!activeChannel) {
            return;
        }


        activeChannelRef.current =
            activeChannel;


        loadMessages(
            activeChannel.id
        );

    }, [
        activeChannel,
        loadMessages,
    ]);

    useEffect(() => {

        if (
            authLoading ||
            !user
        ) {
            return;
        }


        const wsUrl =
            BACKEND_URL.replace(
                /^http/,
                "ws"
            ) + "/ws";


        const client =
            new Client({

                brokerURL: wsUrl,

                reconnectDelay: 5000,


                debug: (message) => {

                },

                onConnect: () => {

                    client.subscribe(
                        "/topic/online-count",
                        (
                            message: IMessage
                        ) => {

                            try {

                                const data:
                                    OnlineCountResponse =
                                    JSON.parse(
                                        message.body
                                    );


                                setOnlineCount(
                                    data.count
                                );

                            } catch (error) {

                                console.error(
                                    "Invalid online count:",
                                    error
                                );
                            }
                        }
                    );

                    subscribeToChannel(
                        client
                    );
                },

                onStompError: (
                    frame
                ) => {

                    console.error(
                        "STOMP error:",
                        frame.headers[
                        "message"
                        ]
                    );

                    console.error(
                        frame.body
                    );


                    toast.error(
                        "Chat connection error.",
                        {
                            description:
                                "We couldn't connect to the community chat.",
                        }
                    );
                },


                onWebSocketError: (
                    error
                ) => {

                    console.error(
                        "WebSocket error:",
                        error
                    );


                    toast.error(
                        "Chat connection failed.",
                        {
                            description:
                                "Please check your connection and try again.",
                        }
                    );
                },

                onWebSocketClose: () => {
                },
            });


        stompClientRef.current =
            client;


        client.activate();

        return () => {

            channelSubscriptionRef
                .current
                ?.unsubscribe();


            channelSubscriptionRef.current =
                null;


            client.deactivate();


            stompClientRef.current =
                null;
        };

    }, [
        authLoading,
        user,
    ]);

    const subscribeToChannel = (
        client: Client
    ) => {

        const channel =
            activeChannelRef.current;


        if (
            !channel ||
            !client.connected
        ) {

            return;
        }

        channelSubscriptionRef
            .current
            ?.unsubscribe();

        const subscription =
            client.subscribe(
                `/topic/channel/${channel.id}`,
                (
                    message: IMessage
                ) => {

                    try {

                        const newMessage:
                            ChatMessage =
                            JSON.parse(
                                message.body
                            );


                        if (
                            newMessage.channelId !==
                            activeChannelRef
                                .current
                                ?.id
                        ) {

                            return;
                        }


                        setMessages(
                            (current) => {
                                const exists =
                                    current.some(
                                        (item) =>
                                            item.id ===
                                            newMessage.id
                                    );


                                if (exists) {
                                    return current;
                                }


                                return [
                                    ...current,
                                    newMessage,
                                ];
                            }
                        );

                    } catch (error) {

                        console.error(
                            "Invalid chat message:",
                            error
                        );


                        toast.error(
                            "Received an invalid chat message."
                        );
                    }
                }
            );


        channelSubscriptionRef.current =
            subscription;
    };

    useEffect(() => {

        activeChannelRef.current =
            activeChannel;


        const client =
            stompClientRef.current;


        if (
            !client ||
            !client.connected ||
            !activeChannel
        ) {

            return;
        }


        subscribeToChannel(
            client
        );

    }, [
        activeChannel,
    ]);

    useEffect(() => {

        messagesEndRef.current
            ?.scrollIntoView({
                behavior: "smooth",
            });

    }, [
        messages,
    ]);

    const formatTime = (
        timestamp: string
    ) => {

        return new Date(
            timestamp
        ).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };


    const getInitial = (
        name: string
    ) => {

        return (
            name
                ?.trim()
                .charAt(0)
                .toUpperCase() ||
            "?"
        );
    };

    if (authLoading) {

        return (
            <main className="community-page">

                <SiteHeader />

                <div className="community-loading">
                    Loading community...
                </div>

            </main>
        );
    }

    if (!user) {
        return (
            <div className="community-login-page">
                <SiteHeader />

                <div className="community-login-overlay">
                    <div
                        className="community-login-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="community-login-title"
                    >
                        <div className="community-login-icon">
                            <MessageCircle size={32} />
                        </div>

                        <h2 id="community-login-title">
                            Join the Community
                        </h2>

                        <p>
                            Please log in to join discussions, send messages,
                            and connect with other GSoC contributors.
                        </p>

                        <button
                            type="button"
                            className="community-login-button"
                            onClick={() => router.push("/login")}
                        >
                            <LogIn size={18} />
                            <span>Login to Continue</span>
                        </button>

                        <span className="community-login-note">
                            You need an account to participate in the community.
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (

        <main className="community-page">

            <SiteHeader />


            <div className="community-layout">

                <aside className="community-sidebar">

                    <div className="community-intro">

                        <div className="community-intro-icon">

                            <MessageCircle
                                size={25}
                            />

                        </div>


                        <div>

                            <h2>
                                Community
                            </h2>

                            <p>
                                Discuss, learn and
                                connect with GSoC
                                contributors from
                                around the world.
                            </p>

                        </div>

                    </div>

                    <div className="channel-list">

                        {loadingChannels ? (

                            <div className="channel-loading">
                                Loading channels...
                            </div>

                        ) : channels.length === 0 ? (

                            <div className="channel-loading">
                                No channels available.
                            </div>

                        ) : (

                            channels.map(
                                (channel) => (

                                    <button
                                        key={
                                            channel.id
                                        }
                                        type="button"
                                        className={`channel-item ${activeChannel?.id ===
                                            channel.id
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() => {

                                            setActiveChannel(
                                                channel
                                            );

                                            setSearchQuery("");

                                        }}
                                    >

                                        <div className="channel-icon">

                                            <Hash
                                                size={23}
                                            />

                                        </div>


                                        <div className="channel-info">

                                            <span>
                                                {channel.name.replace(
                                                    "_",
                                                    "-"
                                                )}
                                            </span>

                                            <small>
                                                {
                                                    channel.description
                                                }
                                            </small>

                                        </div>

                                    </button>

                                )
                            )
                        )}

                    </div>

                    <div className="community-guideline-card">

                        <div className="guideline-icon">

                            <MessageCircle
                                size={22}
                            />

                        </div>


                        <div>

                            <h3>
                                Be Respectful
                            </h3>

                            <p>
                                A welcoming space
                                for everyone. Follow
                                our community
                                guidelines and be
                                kind.
                            </p>

                        </div>

                    </div>

                </aside>

                <section className="chat-panel">
                    <header className="chat-header">


                        <div className="chat-header-left">

                            <div className="chat-hash-icon">

                                <Hash
                                    size={27}
                                />

                            </div>


                            <div>

                                <h1>

                                    {activeChannel
                                        ?.name
                                        ?.replace(
                                            "_",
                                            "-"
                                        ) ||
                                        "Community"}

                                </h1>


                                <p>

                                    {activeChannel
                                        ?.description ||
                                        "Community discussion"}

                                </p>

                            </div>

                        </div>


                        <div className="chat-header-actions">


                            <div className="header-online">

                                <Users
                                    size={18}
                                />

                                <span>
                                    {onlineCount} online
                                </span>

                            </div>


                            <button
                                type="button"
                                className="icon-button"
                                aria-label="More options"
                            >

                                <MoreVertical
                                    size={21}
                                />

                            </button>

                        </div>

                    </header>


                    {/* MOBILE SEARCH */}

                    <div className="mobile-search">

                        <Search
                            size={18}
                        />


                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={
                                searchQuery
                            }
                            onChange={(
                                event
                            ) =>
                                setSearchQuery(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <div className="messages-container">


                        {loadingMessages ? (

                            <div className="messages-loading">

                                Loading messages...

                            </div>

                        ) : filteredMessages.length ===
                            0 ? (

                            <div className="empty-chat">


                                <div className="empty-chat-icon">

                                    <MessageCircle
                                        size={30}
                                    />

                                </div>


                                <h3>
                                    No messages yet
                                </h3>


                                <p>
                                    Be the first to
                                    start the
                                    conversation.
                                </p>

                            </div>

                        ) : (

                            filteredMessages.map(
                                (message) => (

                                    <article
                                        className={`chat-message ${message.userId ===
                                            user.id
                                            ? "own-message"
                                            : ""
                                            }`}
                                        key={
                                            message.id
                                        }
                                    >

                                        <div className="message-avatar">

                                            {getInitial(
                                                message.userName
                                            )}

                                        </div>

                                        <div className="message-content">


                                            <div className="message-meta">

                                                <strong>
                                                    {
                                                        message.userName
                                                    }
                                                </strong>


                                                {message.githubUsername && (

                                                    <span className="message-github">

                                                        @
                                                        {
                                                            message.githubUsername
                                                        }

                                                    </span>

                                                )}


                                                <time>
                                                    {formatTime(
                                                        message.createdAt
                                                    )}
                                                </time>

                                            </div>


                                            <p>
                                                {
                                                    message.message
                                                }
                                            </p>

                                        </div>

                                    </article>

                                )
                            )
                        )}


                        <div
                            ref={
                                messagesEndRef
                            }
                        />

                    </div>

                    <div className="message-composer">


                        <input
                            type="text"
                            style={{
                                paddingLeft:
                                    "10px",
                            }}
                            placeholder={
                                activeChannel
                                    ? `Message #${activeChannel.name
                                        .toLowerCase()
                                        .replace(
                                            "_",
                                            "-"
                                        )}`
                                    : "Message #community"
                            }
                            value={
                                messageInput
                            }
                            onChange={(
                                event
                            ) =>
                                setMessageInput(
                                    event.target.value
                                )
                            }
                            onKeyDown={
                                handleKeyDown
                            }
                            maxLength={1000}
                        />


                        <button
                            type="button"
                            className="composer-icon smile-button"
                            aria-label="Emoji"
                            onClick={() => {

                                toast.info(
                                    "Emoji picker coming soon."
                                );

                            }}
                        >

                            <Smile
                                size={21}
                            />

                        </button>


                        <button
                            type="button"
                            className="send-button"
                            onClick={
                                sendMessage
                            }
                            disabled={
                                !messageInput.trim() ||
                                !activeChannel ||
                                sending
                            }
                            aria-label="Send message"
                        >

                            <Send
                                size={21}
                            />

                        </button>

                    </div>

                </section>

                <aside className="community-rightbar">

                    <div className="online-card">


                        <div className="online-card-header">


                            <div className="online-title-icon">

                                <Users
                                    size={23}
                                />

                            </div>


                            <div>

                                <h2>

                                    {onlineCount}
                                    {" "}
                                    Online

                                    <span className="online-dot" />

                                </h2>


                                <p>
                                    GSoC enthusiasts
                                    from around the
                                    world.
                                </p>

                            </div>

                        </div>

                        <div className="user-search">

                            <Search
                                size={18}
                            />

                            <input
                                placeholder="Search users..."
                            />

                        </div>
                        <div className="online-users">

                            {Array.from(
                                new Map(
                                    messages.map(
                                        (
                                            message
                                        ) => [
                                                message.userId,
                                                message,
                                            ]
                                    )
                                ).values()
                            )
                                .slice(
                                    0,
                                    8
                                )
                                .map(
                                    (
                                        message
                                    ) => (

                                        <div
                                            className="online-user"
                                            key={
                                                message.userId
                                            }
                                        >


                                            <div className="user-avatar">

                                                {getInitial(
                                                    message.userName
                                                )}

                                                <span className="user-status" />

                                            </div>


                                            <div>

                                                <strong>
                                                    {
                                                        message.userName
                                                    }
                                                </strong>


                                                <small>

                                                    {message.userId ===
                                                        user.id
                                                        ? "You"
                                                        : message.githubUsername ||
                                                        "Contributor"}

                                                </small>

                                            </div>

                                        </div>

                                    )
                                )}

                        </div>

                        <button
                            type="button"
                            className="view-members-button"
                            onClick={() => {

                                toast.info(
                                    "Member directory coming soon."
                                );

                            }}
                        >

                            View All Members

                            <span>
                                →
                            </span>

                        </button>

                    </div>

                    <div className="guidelines-card">


                        <div className="guidelines-heading">


                            <div className="guidelines-icon">

                                <FileText
                                    size={21}
                                />

                            </div>


                            <h3>
                                Community Guidelines
                            </h3>

                        </div>


                        <ul>

                            <li>

                                <CheckCircle2
                                    size={15}
                                />

                                Be respectful and
                                inclusive

                            </li>


                            <li>

                                <CheckCircle2
                                    size={15}
                                />

                                Stay on topic

                            </li>


                            <li>

                                <CheckCircle2
                                    size={15}
                                />

                                No spam or
                                self-promotion

                            </li>


                            <li>

                                <CheckCircle2
                                    size={15}
                                />

                                Help others and
                                share knowledge

                            </li>

                        </ul>


                        <button
                            type="button"
                            className="guidelines-link"
                            onClick={() => {

                                toast.info(
                                    "Community guidelines page coming soon."
                                );

                            }}
                        >

                            Read Full Guidelines

                            <span>
                                →
                            </span>

                        </button>

                    </div>

                </aside>

            </div>

        </main>
    );
}
