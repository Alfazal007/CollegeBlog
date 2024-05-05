"use client";
import { useSession } from "next-auth/react";

export default function () {
    const { data: session } = useSession();
    const user = session?.user.username;
    return (
        <div>
            Welcome
            <span>{user}</span>
        </div>
    );
}
