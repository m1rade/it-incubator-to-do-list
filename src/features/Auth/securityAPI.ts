import {instance} from "common/api";
import {ServerResponseType} from "common/types";

export const securityAPI = {
    getCaptcha() {
        return instance.get<GetCaptchaRespType>(`security/get-captcha-url`);
    }
}

type GetCaptchaRespType = {
    url: string
}