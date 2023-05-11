import {ResponseType} from "api/todolist-api";
import axios, {AxiosError} from "axios";
import {appActions} from "app/app-reducer";
import {Dispatch} from "redux";
import {todolistsActions} from "features/TodoListsPage/TodoList/todolists-reducer";
import {tasksActions} from "features/TodoListsPage/TodoList/Task/tasks-reducer";


export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch, todolistID?: string, taskID?: string) => {

    if (data.messages.length) {
        dispatch(appActions.setAppError({error: data.messages[0]}));
    } else {
        dispatch(appActions.setAppError({error: "Some error occurred"}));
    }

    todolistID && dispatch(todolistsActions.changeTodolistEntityStatus({todolistID, entityStatus: "failed"}));

    todolistID && taskID && dispatch(tasksActions.changeTaskEntityStatus({todolistID, taskID, entityStatus: "failed"}));

    dispatch(appActions.setAppStatus({status: "failed"}));
}

export const handleServerNetworkError = (error: Error | AxiosError, dispatch: Dispatch, todolistID?: string, taskID?: string) => {

    if (axios.isAxiosError(error)) {
        const errMessage = error.response?.data
            ? (error.response.data as ({ message: string })).message
            : error.message;
        dispatch(appActions.setAppError({error: errMessage}));
    }

    dispatch(appActions.setAppError({error: error.message ? error.message : "Some error occurred"}));

    todolistID && dispatch(todolistsActions.changeTodolistEntityStatus({todolistID, entityStatus: "failed"}));

    todolistID && taskID && dispatch(tasksActions.changeTaskEntityStatus({todolistID, taskID, entityStatus: "failed"}));

    dispatch(appActions.setAppStatus({status: "failed"}));
}