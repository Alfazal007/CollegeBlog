"use client";
import { useEffect, useState } from "react";
import { useToast } from "../../../@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Skeleton } from "../../../@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Button } from "../../../@/components/ui/button";

export default function () {
    const [allColleges, setAllColleges] = useState([]);
    const { toast } = useToast();
    const { data: session, status } = useSession();
    const [fetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        async function getColleges() {
            if (status === "loading" || status === "unauthenticated") {
                return;
            }
            setIsFetching(true);
            // TODO:: Change this line to get a list of all colleges both following and not following
            const response = await axios.get("/api/allcolleges");
            console.log(response)
            if (response.status !== 200) {
                toast({
                    "title": "Error fetching the colleges",
                    "variant": "destructive"
                })
                return;
            }
            console.log(response.data);
            setAllColleges(response.data.data);
            setIsFetching(false);
        }
        getColleges();
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
                <div className="flex mt-2">
                    <div className="md:flex md:flex-wrap md:justify-center w-full md:w-auto">
                        {
                            allColleges.map((college: { name: string, id: string, isFollowing: boolean }) => {
                                return (
                                    <div key={college.id} className="w-full md:w-auto">
                                        <CollegeComponent collegeName={college.name} isFollowing={college.isFollowing} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </>
        );
    }
}

function CollegeComponent({ collegeName, isFollowing }: { collegeName: string, isFollowing: boolean }) {
    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 m-2">
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="font-semibold p-4 text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100">
                            {collegeName.toUpperCase()}
                        </div>
                        <Button size="sm" variant={isFollowing ? "outline" : "default"}>
                            {isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
