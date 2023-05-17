import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { createAppAsyncThunk } from "common/hooks";
import { ResultCodes } from "common/enums";
import { clearTodosTasks } from "common/actions";
import { handleServerNetworkError } from "common/utils";
import { authAPI, LoginParamsType } from "features/Auth/authAPI";
import { securityAPI } from "features/Auth/securityAPI";

const login = createAppAsyncThunk<{ isLoggedIn: boolean; captcha?: string }, LoginParamsType>(
    "auth/login",
    async (args, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

            const resp = await authAPI.login(args);

            if (resp.data.resultCode === ResultCodes.OK) {
                return { isLoggedIn: true };
            } else if (resp.data.resultCode === ResultCodes.Captcha) {
                dispatch(authThunks.getCaptcha());
                return { isLoggedIn: false };
            } else {
                const isShowError = !resp.data.fieldsErrors.length;
                return rejectWithValue({ data: resp.data, isShowError });
            }
    },
);

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/logout", async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    const resp = await authAPI.logout();

    if (resp.data.resultCode === ResultCodes.OK) {
        dispatch(clearTodosTasks());
        return { isLoggedIn: false };
    } else {
        return rejectWithValue({ data: resp.data, isShowError: true });
    }
});

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("app/initializeApp", async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

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

const getCaptcha = createAppAsyncThunk<{ captchaURL: string }, void>("auth/getCaptcha", async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    try {
        const resp = await securityAPI.getCaptcha();
        return { captchaURL: resp.data.url };
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
    }
});

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
        captcha: "",
    },
    reducers: {},
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
                state.captcha = action.payload.captchaURL;
            });
    },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = { login, logout, initializeApp, getCaptcha };
