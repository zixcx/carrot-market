type LoaderSize = "sm" | "md" | "lg";

export default function Loader({ size }: { size: LoaderSize }) {
    const sizes = {
        sm: "size-1",
        md: "size-2",
        lg: "size-4",
    };

    return (
        <div className="flex flex-row gap-2">
            <div
                className={`${sizes[size]} rounded-full bg-white animate-bounce`}
            ></div>
            <div
                className={`${sizes[size]} rounded-full bg-white animate-bounce [animation-delay:-.3s]`}
            ></div>
            <div
                className={`${sizes[size]} rounded-full bg-white animate-bounce [animation-delay:-.5s]`}
            ></div>
        </div>
    );
}
