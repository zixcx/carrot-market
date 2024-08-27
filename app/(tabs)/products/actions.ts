"use server";
import db from "@/lib/db";

export async function getMoreProducts(page: number) {
    const numOfTakes = 1;
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        skip: page * numOfTakes,
        take: numOfTakes,
        orderBy: {
            created_at: "desc",
        },
    });
    return products;
}
