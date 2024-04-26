import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export const GET = async () => {
    await prisma.user.create({
        data: {
            username: "adsads",
            password: "adsads",
            firstName: "adsads",
            lastName: "adsads",
        },
    });
    return NextResponse.json({
        message: "hi there",
    });
};
