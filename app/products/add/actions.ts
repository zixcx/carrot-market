"use server";

import { z } from "zod";
import fs from "fs/promises";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const productSchema = z.object({
    photo: z.string({
        required_error: "사진을 추가해주세요.",
    }),
    title: z
        .string({
            required_error: "제목을 작성해주세요.",
        })
        .min(2, "제목이 너무 짧습니다.")
        .max(50, "제목을 50자 이하로 작성해주세요."),
    description: z
        .string({
            required_error: "자세한 설명을 작성해주세요.",
        })
        .min(1)
        .max(500, "설명을 500자 이하로 작성해주세요."),
    price: z.coerce
        .number({
            required_error: "가격을 입력해주세요.",
        })
        .min(1, "1원 이상의 삼품만 등록 가능합니다.")
        .max(1000000000, "1,000,000,000 원 (십억 원) 이하로 등록 가능합니다."),
});

// interface IData {
//     photo: File | null; // File 타입 또는 null일 수 있다고 명시
//     title: string;
//     price: string;
//     description: string;
// }

export async function uploadProduct(_: any, formData: FormData) {
    const data = {
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: (formData.get("price") as string).replace(/[₩,\s]/g, ""),
        description: formData.get("description"),
    };

    if (data.photo && data.photo instanceof File) {
        // 임시방편 -> cloudflare images
        const photoData = await data.photo.arrayBuffer();
        await fs.appendFile(
            `./public/${data.photo.name}`,
            Buffer.from(photoData)
        );
        data.photo = `/${data.photo.name}`;
    }

    const result = productSchema.safeParse(data);
    if (!result.success) {
        const error = result.error.flatten();
        error.fieldErrors.photo = ["사진을 추가해주세요."];
        return error;
    } else {
        const session = await getSession();
        if (session.id) {
            const product = await db.product.create({
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    price: result.data.price,
                    photo: result.data.photo,
                    user: {
                        connect: {
                            id: session.id,
                        },
                    },
                },
                select: {
                    id: true,
                },
            });
            redirect(`/products/${product.id}`);
        }
    }
}
