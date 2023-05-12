import {handleServerAppError, handleServerNetworkError} from "common/utils/error-utils"
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppDispatch} from "app/store";
import {appActions} from "app/app-reducer";
import {AxiosError} from "axios";
import {authAPI, LoginParamsType} from "common/api/todolist-api";
import {clearTodosTasks} from "common/actions/actions";


const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})

export const authReducer = slice.reducer
export const authActions = slice.actions


// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: AppDispatch) => {
    dispatch(appActions.setAppStatus({status: "loading"}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
                dispatch(appActions.setAppStatus({status: "succeeded"}))
            } else {
                handleServerAppError<{userId: number}>(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error as Error | AxiosError, dispatch)
        })
}
export const logoutTC = () => (dispatch: AppDispatch) => {
    dispatch(appActions.setAppStatus({status: "loading"}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({isLoggedIn: false}))
                dispatch(clearTodosTasks())
                dispatch(appActions.setAppStatus({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
