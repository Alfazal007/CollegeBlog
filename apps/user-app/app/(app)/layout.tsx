"use client";

import { signOut } from "next-auth/react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";

export default function ({ children }: { children: React.ReactNode }): JSX.Element {
    function signout() {
        signOut()
        router.replace("/sign-in")
    }
    const router = useRouter()
    return (
        <>
            <Navbar signout={signout} />
            {children}
        </>
    )
}
