import ModalCloseButton from "@/components/modal/close-btn";
import ModalBackgroundOverlay from "@/components/modal/overlay";
import { notFound } from "next/navigation";

export default function ModalLoading() {
    return (
        <div className="fixed size-full left-0 top-0 z-50 flex justify-center items-center">
            <ModalBackgroundOverlay>
                <ModalCloseButton />
                <div className="max-w-[500px] w-full h-[85%] aspect-square bg-neutral-800 rounded-md overflow-hidden flex flex-col mx-10">
                    {/* <div className="animate-pulse"></div> */}
                </div>
            </ModalBackgroundOverlay>
        </div>
    );
}
