"use client";

import Button from "@/components/button";
import { UploadIcon } from "@/components/icons";
import Input from "@/components/input";
import { useState } from "react";
import { uploadProduct } from "./actions";
import { formatToKRW } from "@/lib/utils";
import { useFormState } from "react-dom";

export default function AddProduct() {
    const [preview, setPreview] = useState("");
    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = event;
        if (!files || files.length === 0) {
            alert("파일을 선택해주세요.");
            return;
        }
        // if (files.length > 10) {
        //     alert("10개 이하의 이미지만 선택할 수 있습니다.");
        //     return;
        // }

        const file = files[0];
        if (file.size > 3 * 1024 * 1024) {
            alert("3MB 이하의 이미지만 업로드할 수 있습니다.");
            return;
        }

        const url = URL.createObjectURL(file);

        setPreview(url);
    };

    const [price, setPrice] = useState("");
    const onPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        const numericValue = inputValue.replace(/[^\d]/g, "");

        setPrice(`₩ ${formatToKRW(Number(numericValue))}`);
        console.log(Number(price.replace(/[₩,\s]/g, "")));
    };

    const [state, action] = useFormState(uploadProduct, null);

    return (
        <div>
            <form action={action} className="p-5 flex flex-col gap-5">
                <label
                    htmlFor="photo"
                    className="cursor-pointer border-2 aspect-square flex flex-col items-center justify-center text-neutral-300 border-neutral-300 rounded-md border-dashed bg-center bg-cover"
                    style={{
                        backgroundImage: `url(${preview})`,
                    }}
                >
                    {preview === "" ? (
                        <>
                            <UploadIcon className="w-20 fill-white" />

                            {state?.fieldErrors.photo ? (
                                <span className="text-red-500 font-medium mt-1">
                                    사진을 추가해 주세요.
                                </span>
                            ) : (
                                <span className="text-sm mt-1">
                                    사진을 추가해 주세요.
                                </span>
                            )}

                            {/* <span className="text-sm">0/10</span> */}
                        </>
                    ) : null}
                </label>
                <input
                    onChange={onImageChange}
                    type="file"
                    name="photo"
                    id="photo"
                    className="hidden"
                    // multiple
                    accept="image/*"
                />

                <span className="text-sm -my-2">제목</span>
                <Input
                    name="title"
                    type="text"
                    placeholder="제목"
                    required
                    errors={state?.fieldErrors.title}
                />

                <span className="text-sm -my-2">가격</span>
                <Input
                    name="price"
                    type="text"
                    placeholder="₩ 가격을 입력해주세요."
                    onChange={onPriceChange}
                    value={price}
                    required
                    errors={state?.fieldErrors.price}
                />

                <span className="text-sm -my-2">자세한 설명</span>
                <Input
                    name="description"
                    type="text"
                    placeholder="신뢰할 수 있는 거래를 위해 자세히 적어주세요."
                    required
                    errors={state?.fieldErrors.description}
                />
                <Button text="등록하기" />
            </form>
        </div>
    );
}
