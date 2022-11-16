import {
    AppErrorType,
    setAppErrorAC,
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType
} from "../app/app_reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolist-api";

export type authError = {
    message: AppErrorType
}

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]));
    } else {
        dispatch(setAppErrorAC("Some error occurred"));
    }
    dispatch(setAppStatusAC("failed"));
}

export const handleServerNetworkError = (error: authError, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    dispatch(setAppErrorAC(error.message ? error.message : "Some error occurred"));
    dispatch(setAppStatusAC("failed"));
}