"use client";
import Input from "@/components/input";
import Button from "@/components/button";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { smsLogin } from "./actions";
import { error } from "console";

const initialState = {
    token: false,
    error: undefined,
};

export default function SMSLogin() {
    const [state, dispatch] = useFormState(smsLogin, initialState);
    return (
        <div className="flex flex-col gap-10 px-6 py-8">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">문자로 로그인하세요!</h1>
                <h2 className="text-xl">전화번호로 인증하고 로그인하세요😀</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                {state.token ? (
                    <Input
                        name="token"
                        key={"token"}
                        type="text"
                        placeholder="인증코드"
                        required
                        min={100000}
                        max={999999}
                        errors={state.error?.formErrors}
                    />
                ) : (
                    <Input
                        name="phone"
                        key={"phone"}
                        type="number"
                        placeholder="010XXXXXXXX"
                        required
                        errors={state.error?.formErrors}
                    />
                )}
                <Button
                    text={state.token ? "인증번호 확인" : "인증번호 전송"}
                />
            </form>
        </div>
    );
}
