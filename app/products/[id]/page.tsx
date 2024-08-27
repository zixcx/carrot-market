import db from "@/lib/db";
import getSession from "@/lib/session";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { formatToKRW } from "@/lib/utils";

async function getIsOwner(userId: number) {
    const session = await getSession();
    if (session.id) {
        return session.id === userId;
    } else {
        return false;
    }
}

async function getProduct(id: number) {
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    const product = await db.product.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    username: true,
                    avatar: true,
                },
            },
        },
    });
    return product;
}

export default async function ProductDetail({
    params,
}: {
    params: { id: string };
}) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }
    const product = await getProduct(id);
    if (!product) {
        return notFound();
    }

    const isOwner = await getIsOwner(product.userId);

    const onDelete = async () => {
        "use server";
        if (!isOwner) return;
        await db.product.delete({
            where: {
                id,
            },
            select: null,
        });
        redirect("/products");
    };

    return (
        <div>
            <div className="relative aspect-square">
                <Image
                    fill
                    className="object-cover"
                    src={product.photo}
                    alt={product.title}
                />
            </div>
            <div className="flex p-5 items-center gap-3 border-b border-neutral-700">
                <div className="relative size-10 rounded-full overflow-hidden">
                    {product.user.avatar !== null ? (
                        <Image
                            // width={40}
                            // height={40}
                            fill
                            src={product.user.avatar}
                            alt={product.user.username}
                        />
                    ) : (
                        <UserIcon className="bg-neutral-300" />
                    )}
                </div>
                <div>
                    <h3>{product.user.username}</h3>
                </div>
            </div>
            <div className="p-5">
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <p>{product.description}</p>
            </div>
            <div className="fixed w-full bottom-0 left-0 p-5 border-t bg-neutral-900 border-neutral-700 flex justify-between items-center">
                <span className="font-semibold text-lg">
                    {formatToKRW(product.price)}원
                </span>
                {isOwner ? (
                    <form action={onDelete}>
                        <button className="bg-rose-600 px-5 py-2.5 text-white rounded-md font-semibold">
                            삭제하기
                        </button>
                    </form>
                ) : (
                    <Link
                        className="bg-orange-500 px-5 py-2.5 text-white rounded-md font-semibold"
                        href={``}
                    >
                        채팅하기
                    </Link>
                )}
            </div>
        </div>
    );
}
