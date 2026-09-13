export type ChatChannel = {
    id: string;
    name: string;
    description: string;
};

export type ChatMessage = {
    id: string;
    channelId: string;
    userId: string;
    userName: string;
    githubUsername: string | null;
    message: string;
    createdAt: string;
};

export type OnlineCountResponse = {
    count: number;
};
