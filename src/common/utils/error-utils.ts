import axios, {AxiosError} from "axios";
import {ServerResponseType} from "common/api/instance";
import {appActions} from "app/app-reducer";
import {todolistsActions} from "features/TodoListsPage/TodoList/todolists-reducer";
import {tasksActions} from "features/TodoListsPage/TodoList/Task/tasks-reducer";
import {AppDispatch} from "app/store";


export const handleServerAppError = <T>(data: ServerResponseType<T>, dispatch: AppDispatch, todolistID?: string, taskID?: string) => {

    if (data.messages.length) {
        dispatch(appActions.setAppError({error: data.messages[0]}));
    } else {
        dispatch(appActions.setAppError({error: "Some error occurred"}));
    }

    todolistID && dispatch(todolistsActions.changeTodolistEntityStatus({todolistID, entityStatus: "failed"}));

    todolistID && taskID && dispatch(tasksActions.changeTaskEntityStatus({todolistID, taskID, entityStatus: "failed"}));

    dispatch(appActions.setAppStatus({status: "failed"}));
}

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