import axios, {AxiosError} from "axios";
import {appActions} from "app/app-reducer";
import {todolistsActions} from "features/TodoListsPage/TodoList/todolists-reducer";
import {tasksActions} from "features/TodoListsPage/TodoList/Task/tasks-reducer";
import {AppDispatch} from "app/store";
import {ServerResponseType} from "common/types";

/**
 * The function handles server errors that come with HTTP status code 200
 * @param data - server response in the form ResponseType<D>
 * @param dispatch - function to update Redux store's state
 * @param todolistID [optional] - is needed to change entity status in the state
 * @param taskID [optional] - is needed to change entity status in the state
 * @param showError [showError=true] - a flag that define whether to display errors in UI
 */
export const handleServerAppError = <T>(data: ServerResponseType<T>, dispatch: AppDispatch, todolistID?: string, taskID?: string, showError: boolean = true) => {
    if (showError) {
        dispatch(appActions.setAppError({error: data.messages.length ? data.messages[0] : "Some error occurred"}));
    }

    todolistID && dispatch(todolistsActions.changeTodolistEntityStatus({todolistID, entityStatus: "failed"}));

    todolistID && taskID && dispatch(tasksActions.changeTaskEntityStatus({todolistID, taskID, entityStatus: "failed"}));

    dispatch(appActions.setAppStatus({status: "failed"}));
}


/**
 * The function handles errors with standard HTTP status codes
 * @param error - error message received from server
 * @param dispatch - function to update Redux store's state
 * @param todolistID [optional] - is needed to change entity status in the state
 * @param taskID [optional] - is needed to change entity status in the state
 */
export const handleServerNetworkError = (error: unknown, dispatch: AppDispatch, todolistID?: string, taskID?: string) => {
    const err = error as Error | AxiosError<{ error: string }>

    if (axios.isAxiosError(err)) {
        const errMessage = err.response?.data
            ? (err.response.data as ({ message: string })).message
            : err.message;
        dispatch(appActions.setAppError({error: errMessage}));
    }

    dispatch(appActions.setAppError({error: err.message ? err.message : "Some error occurred"}));

    todolistID && dispatch(todolistsActions.changeTodolistEntityStatus({todolistID, entityStatus: "failed"}));

    todolistID && taskID && dispatch(tasksActions.changeTaskEntityStatus({todolistID, taskID, entityStatus: "failed"}));

    dispatch(appActions.setAppStatus({status: "failed"}));
}