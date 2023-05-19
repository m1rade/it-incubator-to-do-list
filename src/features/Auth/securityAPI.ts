import { instance } from "common/api";

export const securityAPI = {
    getCaptcha() {
        return instance.get<GetCaptchaRespType>(`security/get-captcha-url`);
    },
};

export type GetCaptchaRespType = {
    url: string;
};
