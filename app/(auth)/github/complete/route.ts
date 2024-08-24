import githubAuth from "@/lib/auth/githubAuth";
import db from "@/lib/db";
import getSession, { loginSession } from "@/lib/session";
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
    const { github_id, avatar_url, github_name } =
        await githubAuth.getGithubUserData(access_token);
    const email = await githubAuth.getGithubEmail(access_token);

    const user = await db.user.findFirst({
        where: {
            OR: [{ github_id }, { email }],
        },
        select: {
            id: true,
        },
    });
    if (user) {
        await loginSession(user.id);
        return redirect("/profile");
    } else {
        const checkUsername = await db.user.findUnique({
            where: { username: github_name },
            select: { id: true },
        });

        const newUser = await db.user.create({
            data: {
                username: checkUsername ? `github_${github_name}` : github_name,
                github_id,
                avatar: avatar_url,
            },
            select: {
                id: true,
            },
        });
        await loginSession(newUser.id);
        return redirect("/profile");
    }
}
