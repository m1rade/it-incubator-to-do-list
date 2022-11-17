import {AppActionsType, setAppInitializationAC, setAppStatusAC} from "../../app/app_reducer";
import {authAPI, authMeResponseType, LoginParamsType, ResultCodes} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errors_utils";
import {AxiosError} from "axios";

const initialState = {
    isLoggedIn: false
}

// reducer
export const authReducer = (
    state: InitialStateType = initialState,
    action: AuthActionsType
): InitialStateType => {
    switch (action.type) {
        case "LOGIN/SET-IS-LOGGED-IN":
            return {...state, isLoggedIn: action.value};
        default:
            return state;
    }
}


// Actions
export const setIsLoggedInAC = (value: boolean) => ({type: "LOGIN/SET-IS-LOGGED-IN", value} as const);


// Thunks
export const loginTC = (userData: LoginParamsType) =>
    async (dispatch: Dispatch<AuthActionsType>) => {
        dispatch(setAppStatusAC("loading"));
        try {
            const resp = await authAPI.login(userData);
            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(setIsLoggedInAC(true));
                dispatch(setAppStatusAC("succeeded"));
            } else {
                handleServerAppError<{ userId: number }>(resp.data, dispatch);
            }
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        }
    }

export const initializeAppTC = () =>
    async (dispatch: Dispatch<AuthActionsType>) => {
        dispatch(setAppStatusAC("loading"));
        try {
            const resp = await authAPI.authMe()
            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(setIsLoggedInAC(true));
                dispatch(setAppStatusAC("succeeded"));
            } else {
                handleServerAppError<authMeResponseType>(resp.data, dispatch);
            }
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        } finally {
            dispatch(setAppInitializationAC(true));
        }
    }

export const logoutTC = () =>
    async (dispatch: Dispatch<AuthActionsType>) => {
        dispatch(setAppStatusAC("loading"));
        try {
            const resp = await authAPI.logout();
            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(setIsLoggedInAC(false));
                dispatch(setAppStatusAC("succeeded"));
            } else {
                handleServerAppError(resp.data, dispatch);
            }
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        }

    }


// types
type InitialStateType = typeof initialState

export type AuthActionsType =
    ReturnType<typeof setIsLoggedInAC>
    | AppActionsType