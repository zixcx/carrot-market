import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
    [key: string]: boolean;
}

// const publicOnlyUrls: Routes = {
//     "/": true,
//     "/login": true,
//     "/sms": true,
//     "/create-account": true,
// };
const publicUrls = new Set([
    "/",
    "/login",
    "/sms",
    "/create-account",
    "/github/start",
    "/github/complete",
]);

export async function middleware(request: NextRequest) {
    const session = await getSession();
    // const exists = publicOnlyUrls[request.nextUrl.pathname];
    const exists = publicUrls.has(request.nextUrl.pathname);
    if (!session.id) {
        if (!exists) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    } else {
        if (exists) {
            return NextResponse.redirect(new URL("/home", request.url));
        }
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
