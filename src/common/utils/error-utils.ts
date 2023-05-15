import axios, {AxiosError} from "axios";
import {appActions} from "app/app-reducer";
import {AppDispatch} from "app/store";
import {ServerResponseType} from "common/types";

/**
 * The function handles server errors that come with HTTP status code 200
 * @param data - server response in the form ResponseType<D>
 * @param dispatch - function to update Redux store's state
 * @param showError [showError=true] - a flag that define whether to display errors in UI
 */
export const handleServerAppError = <T>(data: ServerResponseType<T>, dispatch: AppDispatch, showError: boolean = true) => {
    if (showError) {
        dispatch(appActions.setAppError({error: data.messages.length ? data.messages[0] : "Some error occurred"}));
    }
}


/**
 * The function handles errors with standard HTTP status codes
 * @param error - error message received from server
 * @param dispatch - function to update Redux store's state
 */
export const handleServerNetworkError = (error: unknown, dispatch: AppDispatch) => {
    const err = error as Error | AxiosError<{ error: string }>

    if (axios.isAxiosError(err)) {
        const errMessage = err.response?.data
            ? (err.response.data as ({ message: string })).message
            : err.message;
        dispatch(appActions.setAppError({error: errMessage}));
    }

    dispatch(appActions.setAppError({error: err.message ? err.message : "Some error occurred"}));
}