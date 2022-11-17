import {ResultCodes, todolistAPI, TodolistType} from "../../../api/todolist-api";
import {Dispatch} from "redux";
import {
    RequestStatusType,
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType
} from "../../../app/app_reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/errors_utils";
import {AxiosError} from "axios";


const initialState: TodolistDomainType[] = [];

// reducer
export const todoLists_reducer = (
    state: TodolistDomainType[] = initialState,
    action: TodosActionType
): TodolistDomainType[] => {
    switch (action.type) {
        case "SET-TODOS":
            return action.todos.map(t => ({...t, filter: "all", entityStatus: "idle"}));
        case "REMOVE-TODOLIST":
            return state.filter((el) => el.id !== action.todoListID);
        case "CHANGE-TODOLIST-TITLE":
            return state.map((el) =>
                el.id === action.payload.todoListID
                    ? {...el, title: action.payload.title}
                    : el
            );
        case "ADD-TODOLIST":
            return [{
                ...action.todoList,
                filter: "all",
                entityStatus: "idle",
            }, ...state];
        case "CHANGE-TODOLIST-FILTER":
            return state.map((el) =>
                el.id === action.payload.todoListID
                    ? {...el, filter: action.payload.value}
                    : el
            );
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map(tl => tl.id === action.payload.todoListID ? {
                ...tl,
                entityStatus: action.payload.status
            } : tl)
        default:
            return state;
    }
};


// Action Creators
export const setTodolistsAC = (todos: TodolistType[]) => ({
    type: "SET-TODOS",
    todos
} as const);

export const removeTodoListAC = (todoListID: string) => ({
    type: "REMOVE-TODOLIST",
    todoListID,
} as const);

export const changeTodoListTitleAC = (todoListID: string, title: string) => ({
    type: "CHANGE-TODOLIST-TITLE",
    payload: {
        todoListID,
        title,
    }
} as const);

export const addTodoListAC = (todoList: TodolistType) => ({
    type: "ADD-TODOLIST",
    todoList
} as const);

export const changeTodoListFilterAC = (
    todoListID: string,
    value: FilterValuesType
) => ({
    type: "CHANGE-TODOLIST-FILTER",
    payload: {
        todoListID,
        value,
    }
} as const);

export const changeTodolistEntityStatusAC = (
    todoListID: string, status: RequestStatusType
) => ({
    type: "CHANGE-TODOLIST-ENTITY-STATUS",
    payload: {
        todoListID,
        status
    },
} as const);


// Thunk Creators
export const fetchTodoTC = () =>
    async (dispatch: TodosThunkType) => {
        dispatch(setAppStatusAC("loading"));
        try {
            const resp = await todolistAPI.getTodolists();
            dispatch(setTodolistsAC(resp.data));
            dispatch(setAppStatusAC("succeeded"));
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        }
    }

export const addTodoTC = (title: string) =>
    async (dispatch: TodosThunkType) => {
        dispatch(setAppStatusAC("loading"));
        try {
            const resp = await todolistAPI.createTodolist(title);
            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(addTodoListAC(resp.data.data.item));
                dispatch(setAppStatusAC("succeeded"));
            } else {
                handleServerAppError(resp.data, dispatch);
            }
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        }
    }

export const deleteTodoTC = (todoListID: string) =>
    async (dispatch: TodosThunkType) => {
        dispatch(setAppStatusAC("loading"));
        dispatch(changeTodolistEntityStatusAC(todoListID, "loading"));
        try {
            const resp = await todolistAPI.deleteTodolist(todoListID);
            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(removeTodoListAC(todoListID));
                dispatch(setAppStatusAC("succeeded"));
            } else {
                handleServerAppError(resp.data, dispatch);
            }
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        }
    }

export const changeTodoTitleTC = (todoListID: string, title: string) =>
    async (dispatch: TodosThunkType) => {
        dispatch(setAppStatusAC("loading"));
        try {
            const resp = await todolistAPI.changeTodolistTitle(todoListID, title);
            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(changeTodoListTitleAC(todoListID, title));
                dispatch(setAppStatusAC("succeeded"));
            } else {
                handleServerAppError(resp.data, dispatch);
            }
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        }
    }


// types
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>;
export type RemoveTodolistACType = ReturnType<typeof removeTodoListAC>;
export type AddTodoListACType = ReturnType<typeof addTodoListAC>;
export type ChangeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatusAC>

export type TodosActionType =
    | RemoveTodolistACType
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>
    | AddTodoListACType
    | SetTodolistsACType
    | ChangeTodolistEntityStatusType

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}

type TodosThunkType = Dispatch<TodosActionType | SetAppErrorActionType
    | SetAppStatusActionType>;