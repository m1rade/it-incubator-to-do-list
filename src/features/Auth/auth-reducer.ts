import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { createAppAsyncThunk } from "common/hooks";
import { ResultCodes } from "common/enums";
import { clearTodosTasks } from "common/actions";
import { authAPI, LoginParamsType } from "features/Auth/authAPI";
import { GetCaptchaRespType, securityAPI } from "features/Auth/securityAPI";
import { ServerResponseType } from "common/types";

const login = createAppAsyncThunk<LoginThunkReturnType, LoginParamsType>(
    "auth/login",
    async (args, { dispatch, rejectWithValue }) => {
        dispatch(authActions.clearCaptchaURL());

        const resp = await authAPI.login(args);
        if (resp.data.resultCode === ResultCodes.OK) {
            return { isLoggedIn: true };
        } else if (resp.data.resultCode === ResultCodes.Captcha) {
            dispatch(authThunks.getCaptcha());
            return {
                isLoggedIn: false,
                serverResp: resp.data,
            };
        } else {
            const isShowError = !resp.data.fieldsErrors.length;
            return rejectWithValue({ data: resp.data, isShowError });
        }
    },
);

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/logout",
    async (_, { dispatch, rejectWithValue }) => {
        const resp = await authAPI.logout();

        if (resp.data.resultCode === ResultCodes.OK) {
            dispatch(clearTodosTasks());
            return { isLoggedIn: false };
        } else {
            return rejectWithValue({ data: resp.data, isShowError: true });
        }
    });

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("app/initializeApp",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const resp = await authAPI.authMe();

            if (resp.data.resultCode === ResultCodes.OK) {
                return { isLoggedIn: true };
            } else {
                return rejectWithValue({ data: resp.data, isShowError: false });
            }
        } finally {
            dispatch(appActions.setAppInitialized({ isInitialized: true }));
        }
    });

const getCaptcha = createAppAsyncThunk<GetCaptchaRespType, void>("auth/getCaptcha",
    async () => {
        const resp = await securityAPI.getCaptcha();
        return resp.data;
    });

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
        captchaURL: null as string | null,
    },
    reducers: {
        clearCaptchaURL: (state) => {
            state.captchaURL = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(authThunks.login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn;
            })
            .addCase(authThunks.logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn;
            })
            .addCase(authThunks.initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn;
            })
            .addCase(authThunks.getCaptcha.fulfilled, (state, action) => {
                state.captchaURL = action.payload.url;
            });
    },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = { login, logout, initializeApp, getCaptcha };


// types
export type LoginThunkReturnType = {
    isLoggedIn: boolean,
    serverResp?: ServerResponseType
}