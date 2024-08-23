import githubAuth from "@/lib/auth/github-auth";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
        return new Response(null, {
            status: 400,
        });
    }

    const access_token = await githubAuth.getGithubToken(code);
    const { id, avatar_url, login } = await githubAuth.getGithubUserData(
        access_token
    );

    const user = await db.user.findUnique({
        where: {
            github_id: id + "",
        },
        select: {
            id: true,
        },
    });
    if (user) {
        const session = await getSession();
        session.id = user.id;
        await session.save();
        return redirect("/profile");
    }
    const newUser = await db.user.create({
        data: {
            username: login,
            github_id: id + "",
            avatar: avatar_url,
        },
        select: {
            id: true,
        },
    });
    const session = await getSession();
    session.id = newUser.id;
    await session.save();
    return redirect("/profile");
}
