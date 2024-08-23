export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 12;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEX = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERROR =
    "비밀번호는 대소문자 및 숫자와 특수문자를 포함해야 합니다.";
