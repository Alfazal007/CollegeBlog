"use client";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "../../../../../@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../../../../@/components/ui/use-toast";
import SinglePost from "../../../../../components/SinglePost";
import { Content } from "../../../../../interfaces/interface";

export default function() {
    const param = useParams<{ postid: string }>();
    const router = useRouter();
    const [post, setPost] = useState<Content>({
        id: "",
        views: 0,
        _count: {
            Upvotes: 0,
            Downvotes: 0
        },
        content: "",
        creator: {
            college: {
                name: ""
            }
        },
        subject: "",
        updatedAt: "",
        Replies: [
            {
                id: "",
                content: "",
                _count: {
                    UpvotesReply: 0,
                    DownvotesReply: 0
                },
                createdAt: "",
                creator: {
                    college: {
                        name: ""
                    }
                }
            }
        ]
    });
    const [fetching, setIsFetching] = useState<boolean>(false);
    const { data: session, status } = useSession();
    const { toast } = useToast();
    useEffect(() => {
        if (status === "loading" || status === "unauthenticated") {
            return;
        }
        async function getter() {
            setIsFetching(true);
            const response = await axios.get(`/api/post/get/${param.postid}`);
            if (response.status != 200) {
                toast({
                    title: "Error while fetching the post",
                    description: "Either the post is not in the database or the user is not logged in",
                    variant: "destructive"
                });
                return;
            }
            const dataFromBackend = response.data.data as Content;
            setPost(response.data.data);
            setIsFetching(false);
        }
        getter();
    }, [status]);
    if (status === "loading" || fetching == true) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-screen-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/sign-in");
    } else {
        return (
            <div>
                <SinglePost post={post} username={session?.user.username || ""} />
            </div>
        );
    }
}
