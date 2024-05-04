"use client";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "../../../../../@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function () {
    const param = useParams<{ postid: string }>();
    const router = useRouter();
    const [post, setPost] = useState({});
    const [fetching, setIsFetching] = useState<boolean>(false);
    const { data: session, status } = useSession();
    useEffect(() => {
        if (status === "loading" || status === "unauthenticated") {
            return;
        }
        async function getter() {
            setIsFetching(true);
            const response = await axios.get(`/api/post/get/${param.postid}`);
            console.log(response);
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
                {JSON.stringify(post)}
                This is the post page {param.postid}
                <div></div>
                <div></div>
            </div>
        );
    }
}
