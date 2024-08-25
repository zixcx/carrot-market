import db from "@/lib/db";

async function getProducts() {
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
    });
    return products;
}

export default async function Products() {
    const products = await getProducts();
    return (
        <div>
            <h1 className="text-4xl">Products!</h1>
        </div>
    );
}
