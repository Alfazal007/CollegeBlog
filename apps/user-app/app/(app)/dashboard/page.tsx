"use client";
import { useSession } from "next-auth/react";
import Card from "../../../components/Card";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../../@/components/ui/use-toast";
import { Skeleton } from "../../../@/components/ui/skeleton";

interface Post {
  updatedAt: string,
  content: string,
  views: number,
  subject: string,
  creator: Creator
}

interface Creator {
  username: string,
  college: {
    name: string
  }
}


export default function() {
  const [allPosts, setAllPosts] = useState([]);
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [fetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    async function getPosts() {
      if (status === "loading" || status === "unauthenticated") {
        return;
      }
      setIsFetching(true);
      const response = await axios.get("/api/post/allPosts/offset/0/limit/10");
      if (response.status !== 200) {
        toast({
          "title": "Error fetching the posts",
          "variant": "destructive"
        })
        return;
      }
      console.log(response.data);
      setAllPosts(response.data.data);
      setIsFetching(false);
    }
    getPosts();
  }, [status])
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

  const router = useRouter();
  if (status === "unauthenticated") {
    router.push("/sign-in");
  } else {
    return (
      <>
        <div className="flex">
          <div className="md:flex md:flex-wrap md:justify-center">
            {
              allPosts.map((post: Post) => (
                <div className="md:w-80 m-1">
                  <Card
                    title={post.subject}
                    description={post.content}
                    updatedAt={post.updatedAt.substring(0, 10)}
                    views={post.views}
                    collegeName={post.creator.college.name}
                    creatorName={post.creator.username}
                  />
                </div>
              ))
            }
          </div >
        </div>
      </>
    );
  }
}
