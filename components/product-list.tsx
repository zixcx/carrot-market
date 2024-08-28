"use client";

import { useEffect, useRef, useState } from "react";
import ListProduct from "./list-product";
import { getMoreProducts } from "@/app/(tabs)/home/actions";
import Loader from "./loader";

interface ProductListProps {
    initialProducts: {
        title: string;
        id: number;
        created_at: Date;
        price: number;
        photo: string;
    }[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
    const [products, setProducts] = useState(initialProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const trigger = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            async (
                entries: IntersectionObserverEntry[],
                observer: IntersectionObserver
            ) => {
                const element = entries[0];
                if (element.isIntersecting && trigger.current) {
                    observer.unobserve(trigger.current);
                    await loadProducts();
                }
            },
            {
                threshold: 1.0,
            }
        );
        if (trigger.current) {
            observer.observe(trigger.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [page]);

    const loadProducts = async () => {
        setIsLoading(true);
        const newProducts = await getMoreProducts(page + 1);

        if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
        } else {
            setIsLastPage(true);
        }
        setIsLoading(false);
    };

    return (
        <div className="p-5 flex flex-col gap-5">
            {products.map((products) => (
                <ListProduct key={products.id} {...products} />
            ))}

            {isLastPage ? null : (
                <span
                    ref={trigger}
                    // style={{ marginTop: `${(page + 1) * 300}vh` }}
                    className="text-sm font-semibold bg-orange-500 w-32 h-12 mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-90 transition-transform disabled:bg-neutral-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? <Loader size="md" /> : "Load more..."}
                </span>
            )}
        </div>
    );
}
