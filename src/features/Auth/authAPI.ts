import {AxiosResponse} from "axios";
import {instance, ServerResponseType} from "common/api/instance";

export const authAPI = {
    login(userData: LoginParamsType) {
        return instance.post<LoginParamsType, AxiosResponse<ServerResponseType<{ userId: number }>>>(`auth/login`, userData);
    },
    authMe() {
        return instance.get<ServerResponseType<authMeResponseType>>(`auth/me`);
    },
    logout() {
        return instance.delete<ServerResponseType>(`auth/login`);
    }
}

type authMeResponseType = {
    id: number
    email: string
    login: string
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}