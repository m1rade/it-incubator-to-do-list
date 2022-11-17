import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../app/app_reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolist-api";
import axios, {AxiosError} from "axios";
import {
    changeTodolistEntityStatusAC,
    ChangeTodolistEntityStatusType
} from "../features/TodoListsPage/TodoList/todoLists_reducer";
import {
    changeTaskEntityStatusAC,
    ChangeTaskEntityStatusType
} from "../features/TodoListsPage/TodoList/Task/tasks_reducer";


export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: HandleErrorDispatchType, todolistID?: string, taskID?: string) => {

    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]));
    } else {
        dispatch(setAppErrorAC("Some error occurred"));
    }

    todolistID && dispatch(changeTodolistEntityStatusAC(todolistID, "failed"));

    todolistID && taskID && dispatch(changeTaskEntityStatusAC(todolistID, taskID, "failed"));

    dispatch(setAppStatusAC("failed"));
}

export const handleServerNetworkError = (error: Error | AxiosError, dispatch: HandleErrorDispatchType, todolistID?: string, taskID?: string) => {

    if (axios.isAxiosError(error)) {
        const errMessage = error.response?.data
            ? (error.response.data as ({ message: string })).message
            : error.message;
        dispatch(setAppErrorAC(errMessage));
    }

    dispatch(setAppErrorAC(error.message ? error.message : "Some error occurred"));

    todolistID && dispatch(changeTodolistEntityStatusAC(todolistID, "failed"));

    todolistID && taskID && dispatch(changeTaskEntityStatusAC(todolistID, taskID, "failed"));

    dispatch(setAppStatusAC("failed"));
}

type HandleErrorDispatchType = Dispatch<SetAppErrorActionType
    | SetAppStatusActionType | ChangeTodolistEntityStatusType
    | ChangeTaskEntityStatusType>