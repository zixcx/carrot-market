"use server";
import {
    PASSWORD_MIN_LENGTH,
    PASSWORD_REGEX,
    PASSWORD_REGEX_ERROR,
    USERNAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username: string) => !username.includes("github");

// const checkUniqueUsername = async (username: string) => {
//     const user = await db.user.findUnique({
//         where: {
//             username, // same -> username: username,
//         },
//         select: {
//             id: true,
//         },
//     });
//     return user ? false : true; // same -> !Boolean(user)
// };

// const checkUniqueEmail = async (email: string) => {
//     const user = await db.user.findUnique({
//         where: {
//             email, // same -> email: email,
//         },
//         select: {
//             id: true,
//         },
//     });
//     return user ? false : true; // same -> !Boolean(user)
// };

const checkPasswords = ({
    password,
    confirm_password,
}: {
    password: string;
    confirm_password: string;
}) => password === confirm_password;

const formSchema = z
    .object({
        username: z
            .string()
            .min(USERNAME_MIN_LENGTH, "입력한 사용자명이 너무 짧습니다.")
            .max(USERNAME_MAX_LENGTH, "입력한 사용자명이 너무 깁니다.")
            .refine(checkUsername, "Contains word(s) that are not allowed"),
        // .refine(checkUniqueUsername, "이미 사용 중인 사용자 이름입니다."),

        email: z.string().email("잘못된 이메일 형식입니다.").toLowerCase(),
        // .refine(checkUniqueEmail, "이미 사용 중인 이메일 주소입니다."),
        password: z
            .string()
            .min(PASSWORD_MIN_LENGTH, "잘못된 비밀번호 형식입니다.")
            .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
        confirm_password: z.string().min(8),
    })
    .refine(checkPasswords, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["confirm_password"],
    })
    .superRefine(async ({ username }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
            },
        });
        if (user) {
            ctx.addIssue({
                code: "custom",
                message: "사용자명이 이미 사용 중입니다.",
                path: ["username"],
                fatal: true,
            });
            return z.NEVER;
        }
    })
    .superRefine(async ({ email }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
            },
        });
        if (user) {
            ctx.addIssue({
                code: "custom",
                message: "이메일이 이미 사용 중입니다.",
                path: ["email"],
                fatal: true,
            });
            return z.NEVER;
        }
    });

export async function createAccount(prevState: any, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    };
    const result = await formSchema.safeParseAsync(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        const hashedPassword = await bcrypt.hash(result.data.password, 12);

        const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
            },
        });
        const cookie = await getSession();
        cookie.id = user.id;
        await cookie.save();

        redirect("/profile");
    }
}

// 1. check username is taken
// 2. check email is already used
// 3. 1~2 = false -> hashing pw
// 4. log the user in
// 5. redirect '/home'
