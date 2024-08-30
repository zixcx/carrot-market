import ProductList from "@/components/product-list";
import db from "@/lib/db";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";

async function getInitialProducts() {
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        take: 1,
        orderBy: {
            created_at: "desc",
        },
    });
    return products;
}

// export type initialProducts = Prisma.PromiseReturnType<typeof getInitialProducts>;

export default async function Products() {
    const initialProducts = await getInitialProducts();
    return (
        <div>
            <ProductList initialProducts={initialProducts} />
            <Link
                href="/products/add"
                className="bg-orange-500 flex items-center justify-center rounded-s-full rounded-e-full w-24 h-12 fixed bottom-24 right-4 transition-all hover:bg-orange-400 active:scale-95 text-white *:p-0 *:m-0 gap-1"
            >
                <PlusIcon className="size-5" />
                <span>글쓰기</span>
            </Link>
        </div>
    );
}
