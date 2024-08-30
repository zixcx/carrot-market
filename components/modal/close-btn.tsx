"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function ModalCloseButton() {
    const router = useRouter();
    const onCloseClick = () => {
        router.back();
    };
    return (
        <button onClick={onCloseClick} className="fixed top-3 right-3">
            <XMarkIcon className="h-7 text-neutral-200" />
        </button>
    );
}
