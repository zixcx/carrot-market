import ModalCloseButton from "@/components/modal/close-btn";
import ModalBackgroundOverlay from "@/components/modal/overlay";
import db from "@/lib/db";
import { formatToKRW, formatToTimeAgo } from "@/lib/utils";
import { PhotoIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getProduct(id: number) {
    await new Promise((resolve) => setTimeout(resolve, 15000));
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

export default async function Modal({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }
    const product = await getProduct(id);
    if (!product) {
        return notFound();
    }
    return (
        <div className="fixed size-full left-0 top-0 z-50 flex justify-center items-center">
            <ModalBackgroundOverlay>
                <ModalCloseButton />
                <div className="max-w-[500px] w-full h-[85%] aspect-square bg-neutral-800 rounded-md overflow-hidden flex flex-col mx-10">
                    <div className="flex justify-start items-center gap-2 px-4 py-3 bg-neutral-900">
                        <div className="rounded-full overflow-hidden">
                            {product.user.avatar !== null ? (
                                <Image
                                    width={40}
                                    height={40}
                                    src={product.user.avatar}
                                    alt={product.user.username}
                                />
                            ) : (
                                <UserIcon className="size-10 bg-neutral-300" />
                            )}
                        </div>

                        <span>{product.user.username}</span>
                    </div>
                    <div className="relative aspect-square">
                        <Image
                            fill
                            className="object-cover"
                            src={product.photo}
                            alt={product.title}
                        />
                    </div>
                    <div className="bg-neutral-800 flex flex-col flex-grow">
                        <div className="p-5 flex-grow">
                            <h1 className="text-2xl font-semibold">
                                {product.title}
                            </h1>
                            <span className="text-sm text-neutral-500">
                                {formatToTimeAgo(product.created_at.toString())}
                            </span>
                            <p>{product.description}</p>
                        </div>
                        <div className="w-full p-3 border-t bg-neutral-900 border-neutral-700 items-center mt-auto">
                            <span className="font-semibold text-lg">
                                {formatToKRW(product.price)}원
                            </span>
                        </div>
                    </div>
                </div>
            </ModalBackgroundOverlay>
        </div>
    );
}
