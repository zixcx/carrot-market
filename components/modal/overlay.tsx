"use client";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

export default function ModalBackgroundOverlay({
    children,
}: {
    children: ReactNode;
}) {
    const router = useRouter();

    const onBgClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.currentTarget === event.target) {
            router.back();
        }
    };

    return (
        <div
            onClick={onBgClick}
            className="bg-black bg-opacity-50 size-full absolute top-0 left-0 z-10 flex justify-center items-center"
        >
            {children}
        </div>
    );
}
