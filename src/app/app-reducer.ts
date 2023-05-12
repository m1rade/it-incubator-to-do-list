import {Dispatch} from "redux"
import {authActions} from "features/Auth/auth-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authAPI} from "common/api/todolist-api";

const initialState = {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false
};

export type AppInitialStateType = typeof initialState;

const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        }
    }
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;



export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";


export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.authMe().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}));
        } else {

        }

        dispatch(appActions.setAppInitialized({isInitialized: true}));
    })
}
