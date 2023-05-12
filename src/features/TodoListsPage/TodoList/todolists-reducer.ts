import {ResultCodes, todolistAPI, TodolistType} from "common/api/todolist-api";
import {appActions, RequestStatusType,} from "app/app-reducer";
import {AxiosError} from "axios";
import {AppDispatch} from "app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {tasksThunks} from "features/TodoListsPage/TodoList/Task/tasks-reducer";
import {handleServerAppError, handleServerNetworkError} from "common/utils";
import {clearTodosTasks} from "common/actions";


const initialState: TodolistDomainType[] = [];

const slice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        setTodolists: (state, action: PayloadAction<{ todos: TodolistType[] }>) => {
            return action.payload.todos.map(t => ({...t, filter: "all", entityStatus: "idle"}));
        },
        removeTodolist: (state, action: PayloadAction<{ todolistID: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistID);
            if (index !== -1) state.splice(index, 1);
        },
        changeTodolistTitle: (state, action: PayloadAction<{ todolistID: string, title: string }>) => {
            const todo = state.find(tl => tl.id === action.payload.todolistID);
            if (todo) todo.title = action.payload.title;
        },
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({
                ...action.payload.todolist,
                filter: "all",
                entityStatus: "idle",
            });
        },
        changeTodolistFilter: (state, action: PayloadAction<{
            todolistID: string,
            filter: FilterValuesType
        }>) => {
            const todo = state.find(tl => tl.id === action.payload.todolistID);
            if (todo) todo.filter = action.payload.filter;
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{
            todolistID: string,
            entityStatus: RequestStatusType
        }>) => {
            const todo = state.find(tl => tl.id === action.payload.todolistID);
            if (todo) todo.entityStatus = action.payload.entityStatus;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(clearTodosTasks.type, () => {
                return []
            })
    }
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;

// Thunk Creators
export const fetchTodoTC = () =>
    async (dispatch: AppDispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}));
        try {
            const resp = await todolistAPI.getTodolists();
            const todosResp = await dispatch(todolistsActions.setTodolists({todos: resp.data}));
            todosResp.payload.todos.forEach(tl => dispatch(tasksThunks.fetchTasks(tl.id)));
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        } finally {
            dispatch(appActions.setAppStatus({status: "succeeded"}));
        }
    }

export const addTodoTC = (title: string) =>
    async (dispatch: AppDispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}));
        try {
            const resp = await todolistAPI.createTodolist(title);
            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(todolistsActions.addTodolist({todolist: resp.data.data.item}));
                dispatch(appActions.setAppStatus({status: "succeeded"}));
            } else {
                handleServerAppError(resp.data, dispatch);
            }
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        }
    }

export const deleteTodoTC = (todolistID: string) =>
    async (dispatch: AppDispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}));
        dispatch(todolistsActions.changeTodolistEntityStatus({todolistID, entityStatus: "loading"}));
        try {
            const resp = await todolistAPI.deleteTodolist(todolistID);
            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(todolistsActions.removeTodolist({todolistID}));
                dispatch(appActions.setAppStatus({status: "succeeded"}));
            } else {
                handleServerAppError(resp.data, dispatch);
            }
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        }
    }

export const changeTodoTitleTC = (todolistID: string, title: string) =>
    async (dispatch: AppDispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}));
        try {
            const resp = await todolistAPI.changeTodolistTitle(todolistID, title);
            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(todolistsActions.changeTodolistTitle({todolistID, title}));
                dispatch(appActions.setAppStatus({status: "succeeded"}));
            } else {
                handleServerAppError(resp.data, dispatch);
            }
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        }
    }


// types
export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}