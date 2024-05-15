export interface Reply {
    // Define properties of reply object if needed
    content: string;
    id: string;
    createdAt: string;
    _count: {
        UpvotesReply: number;
        DownvotesReply: number;
    };
    creator: Creator
}

export interface Creator {
    college: {
        name: string;
    };
}

export interface Content {
    views: number;
    subject: string;
    content: string;
    updatedAt: string; // TODO:: need to think about this
    id: string;
    Replies: Reply[];
    _count: {
        Upvotes: number;
        Downvotes: number;
    };
    creator: Creator;
}
