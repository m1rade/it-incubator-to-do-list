const initialState: InitialStateType = {
    status: "idle",
    error: null,
    isInitialized: false,
}

// reducer
export const appReducer = (
    state: InitialStateType = initialState,
    action: AppActionsType
): InitialStateType => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return {...state, status: action.status};
        case "APP/SET-ERROR":
            return {...state, error: action.error};
        case "APP/SET-INITIALIZATION":
            return {...state, isInitialized: action.isInitialized};
        default:
            return {...state};
    }
}

// Action Creators
export const setAppErrorAC = (error: AppErrorType) => ({type: "APP/SET-ERROR", error} as const);
export const setAppStatusAC = (status: RequestStatusType) => ({type: "APP/SET-STATUS", status} as const);
export const setAppInitializationAC = (isInitialized: boolean) => ({
    type: "APP/SET-INITIALIZATION",
    isInitialized
} as const);


// types
export type AppErrorType = string | null
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: AppErrorType
    isInitialized: boolean
}

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type setAppInitializationActionType = ReturnType<typeof setAppInitializationAC>

export type AppActionsType =
    | SetAppErrorActionType
    | SetAppStatusActionType
    | setAppInitializationActionType
