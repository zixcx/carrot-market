"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";
import { create } from "domain";

const phoneSchema = z
    .string()
    .trim()
    .refine(
        (phone) => validator.isMobilePhone(phone, "ko-KR"),
        "잘못된 전화번호 형식입니다."
    );
const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
    token: boolean;
}

async function getToken() {
    const token = crypto.randomInt(100000, 999999).toString();
    const exists = await db.sMSToken.findUnique({
        where: {
            token,
        },
        select: {
            id: true,
        },
    });
    if (exists) {
        return getToken();
    } else {
        return token;
    }
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
    const phone = formData.get("phone");
    const token = formData.get("token");

    if (!prevState.token) {
        // first called
        const result = phoneSchema.safeParse(phone);

        if (!result.success) {
            return {
                token: false,
                error: result.error.flatten(),
            };
        } else {
            // delete prev token -> create token -> send the token using sms(use twilio)
            await db.user.deleteMany({
                where: {
                    phone: result.data,
                },
            });

            const token = await getToken();
            await db.sMSToken.create({
                data: {
                    token,
                    user: {
                        connectOrCreate: {
                            where: {
                                phone: result.data,
                            },
                            create: {
                                username: crypto
                                    .randomBytes(10)
                                    .toString("hex"),
                                phone: result.data,
                            },
                        },
                    },
                },
            });

            return { token: true };
        }
    } else {
        const result = tokenSchema.safeParse(token);
        if (!result.success) {
            return {
                token: true,
                error: result.error.flatten(),
            };
        } else {
            redirect("/");
        }
    }
}
