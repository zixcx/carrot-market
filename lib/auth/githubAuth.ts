import { redirect } from "next/navigation";

interface IGithubEmail {
    email: string;
    primary: boolean;
}

class GithubAuth {
    async getGithubToken(code: string) {
        const accessTokenParams = new URLSearchParams({
            client_id: process.env.GITHUB_CLIENT_ID!,
            client_secret: process.env.GITHUB_CLIENT_SECRET!,
            code,
        }).toString();
        const accessTokenUrl = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
        const accessTokenResponse = await fetch(accessTokenUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        });
        const { error, access_token } = await accessTokenResponse.json();
        if (error) {
            return redirect("/login");
        }
        return access_token;
    }
    async getGithubUserData(access_token: string) {
        const userData = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            cache: "no-cache",
        });
        const { id, avatar_url, login } = await userData.json();
        return {
            github_id: `${id}`,
            github_name: login,
            avatar_url,
        };
    }
    async getGithubEmail(access_token: string): Promise<string> {
        const email = (
            await (
                await fetch("https://api.github.com/user/emails", {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                    cache: "no-cache",
                })
            ).json()
        ).find((el: IGithubEmail) => el.primary).email;

        return email;
    }
}

const githubAuth = new GithubAuth();

export default githubAuth;
