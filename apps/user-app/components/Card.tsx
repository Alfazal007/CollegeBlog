"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../@/components/ui/card";


export default function ({ title, description, updatedAt, views, creatorName, collegeName }:
    { title: string, description: string, updatedAt: string, views: number, creatorName: string, collegeName: string }) {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{title.substring(0, 15)} <span>{title.length > 15 ? ("....") : ("")}</span></CardTitle>
                    <CardDescription>College: {collegeName}</CardDescription>
                </CardHeader>
                <CardContent className="md:h-56 overflow-x-clip">
                    <p>{description.substring(0, 175)}<span>{description.length > 175 ? (".....") : ("")}</span></p>
                </CardContent>
                <CardFooter className="pb-0">
                    <CardDescription>Last Modified: {updatedAt}</CardDescription>
                </CardFooter>
                <CardFooter className="pb-0">
                    <CardDescription>Post from : {creatorName}</CardDescription>
                </CardFooter>
                <CardFooter>
                    <CardDescription>{views} views</CardDescription>
                </CardFooter>
            </Card>
        </>
    )
}
