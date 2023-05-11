import {todolistsActions} from "features/TodoListsPage/TodoList/todolists-reducer";
import {ResultCodes, TaskStatuses, TaskType, todolistAPI, TodoTaskPriorities} from "api/todolist-api";

import {appActions, RequestStatusType,} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {AxiosError} from "axios";
import {AppDispatch, AppRootStateType} from "app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTodosTasks} from "common/actions";


const initialState: TasksStateType = {};

const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<{ todolistID: string, tasks: TaskType[] }>) => {
            state[action.payload.todolistID] = action.payload.tasks.map(t => ({ ...t, entityStatus: "idle"}));
        },
        removeTask: (state, action: PayloadAction<{ todolistID: string, taskID: string }>) => {
            const tasks = state[action.payload.todolistID];
            const index = tasks.findIndex((t) =>
                t.id === action.payload.taskID);
            if (index !== -1) tasks.splice(index, 1);
        },
        addTask: (state, action: PayloadAction<{ todolistID: string, task: TaskType }>) => {
            const tasks = state[action.payload.todolistID];
            tasks.push({...action.payload.task, entityStatus: "idle"});
        },
        updateTask: (state, action: PayloadAction<{ todolistID: string, taskID: string, task: TaskType }>) => {
            const tasks = state[action.payload.todolistID];
            const index = tasks.findIndex((t) => t.id === action.payload.taskID);
            if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.task};
        },
        changeTaskEntityStatus: (state, action: PayloadAction<{
            todolistID: string,
            taskID: string,
            entityStatus: RequestStatusType
        }>) => {
            const tasks = state[action.payload.todolistID];
            const index = tasks.findIndex((t) => t.id === action.payload.taskID);
            if (index !== -1) tasks[index].entityStatus = action.payload.entityStatus;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(todolistsActions.addTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.todolistID];
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
                action.payload.todos.forEach(tl => {
                    state[tl.id] = [];
                });
            })
            .addCase(clearTodosTasks, () => {
                return {}
            })
    }
});

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions


// Thunk Creators
export const fetchTasksTC = (todolistID: string) =>
    async (dispatch: AppDispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}));
        try {
            const resp = await todolistAPI.getTasks(todolistID);
            dispatch(tasksActions.setTasks({todolistID, tasks: resp.data.items}));
            dispatch(appActions.setAppStatus({status: "succeeded"}));
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        }
    }

export const deleteTaskTC = (todolistID: string, taskID: string) =>
    async (dispatch: AppDispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}));
        dispatch(tasksActions.changeTaskEntityStatus({todolistID, taskID, entityStatus: "loading"}));
        try {
            const resp = await todolistAPI.deleteTask(todolistID, taskID);
            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(tasksActions.removeTask({todolistID, taskID}));
                dispatch(appActions.setAppStatus({status: "succeeded"}));
            } else {
                handleServerAppError(resp.data, dispatch);
            }
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        }
    }

export const addTaskTC = (todolistID: string, title: string) =>
    async (dispatch: AppDispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}));
        dispatch(todolistsActions.changeTodolistEntityStatus({todolistID, entityStatus: "loading"}));
        try {
            const resp = await todolistAPI.createTask(todolistID, title);
            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(tasksActions.addTask({todolistID, task: resp.data.data.item}));
                dispatch(todolistsActions.changeTodolistEntityStatus({todolistID, entityStatus: "succeeded"}));
                dispatch(appActions.setAppStatus({status: "succeeded"}));
            } else {
                handleServerAppError(resp.data, dispatch, todolistID);
            }
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch, todolistID);
        }
    }

export const updateTaskTC = (todolistID: string, taskID: string, value: UpdateTaskType) =>
    async (dispatch: AppDispatch, getState: () => AppRootStateType) => {
        const task = getState().tasks[todolistID].find(t => t.id === taskID);

        if (task) {
            dispatch(appActions.setAppStatus({status: "loading"}));
            dispatch(tasksActions.changeTaskEntityStatus({todolistID, taskID, entityStatus: "loading"}));
            try {
                const resp = await todolistAPI.updateTask(todolistID, taskID, {...task, ...value});
                if (resp.data.resultCode === ResultCodes.OK) {
                    dispatch(tasksActions.updateTask({todolistID, taskID, task: resp.data.data.item}));
                    dispatch(tasksActions.changeTaskEntityStatus({todolistID, taskID, entityStatus: "succeeded"}));
                    dispatch(appActions.setAppStatus({status: "succeeded"}));
                } else {
                    handleServerAppError(resp.data, dispatch, todolistID);
                }
            } catch (err) {
                handleServerNetworkError(err as Error | AxiosError, dispatch, todolistID);
            }
        } else {
            console.warn("A task wasn't found in the state");
            dispatch(appActions.setAppError({error: "A task not found"}));
        }
    }


// types
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}

export type TasksStateType = {
    [key: string]: TaskDomainType[],
};

export type UpdateTaskType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TodoTaskPriorities
    startDate?: string
    deadline?: string
}