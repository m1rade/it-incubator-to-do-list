import {
    AddTodoListACType, changeTodolistEntityStatusAC,
    ChangeTodolistEntityStatusType,
    RemoveTodolistACType,
    SetTodolistsACType
} from "../todoLists_reducer";
import {ResultCodes, TaskStatuses, TaskType, todolistAPI, TodoTaskPriorities} from "../../../../api/todolist-api";
import {AppRootStateType} from "../../../../state/store";
import {Dispatch} from "redux";
import {
    RequestStatusType,
    setAppErrorAC,
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType
} from "../../../../app/app_reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/errors_utils";
import {AxiosError} from "axios";


const initialState: TasksStateType = {};

// Reducer
export const tasks_reducer = (
    state: TasksStateType = initialState,
    action: TasksActionType
): TasksStateType => {
    switch (action.type) {
        case "TASKS/SET-TASKS":
            return {
                ...state, [action.payload.todolistID]: action.payload.tasks.map((t) =>
                    ({...t, entityStatus: "idle"}))
            }
        case "SET-TODOS":
            let copyState = {...state};
            action.todos.forEach(t => {
                copyState[t.id] = [];
            });
            return copyState;
        case "TASKS/REMOVE-TASK":
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].filter((t) =>
                    t.id !== action.payload.taskID)
            };
        case "TASKS/ADD-TASK":
            return {
                ...state,
                [action.payload.todolistID]: [{
                    ...action.payload.task,
                    entityStatus: "idle"
                }, ...state[action.payload.todolistID]]
            };
        case "TASKS/UPDATE-TASK":
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].map((t) =>
                    t.id === action.payload.taskID
                        ? {...t, ...action.payload.task}
                        : t)
            }
        case "ADD-TODOLIST":
            return {[action.todoList.id]: [], ...state};
        case "REMOVE-TODOLIST":
            const stateCopy = {...state};
            delete stateCopy[action.todoListID];
            return stateCopy;
        // const {[action.todoListID]: [], ...rest} = {...state};
        case "CHANGE-TASK-ENTITY-STATUS":
            return {
                ...state,
                [action.payload.todoListID]: state[action.payload.todoListID].map((t) =>
                    t.id === action.payload.taskID
                        ? {...t, entityStatus: action.payload.status}
                        : t)
            }
        default:
            return state;
    }
};


// Action Creators
export const setTasksAC = (todolistID: string, tasks: TaskType[]) => ({
    type: "TASKS/SET-TASKS",
    payload: {
        todolistID,
        tasks
    },
} as const);

export const removeTaskAC = (todolistID: string, taskID: string) => ({
    type: "TASKS/REMOVE-TASK",
    payload: {
        todolistID,
        taskID,
    }
} as const);

export const addTaskAC = (todolistID: string, task: TaskType) => ({
    type: "TASKS/ADD-TASK",
    payload: {
        todolistID,
        task,
    }
} as const);

export const updateTaskAC = (todolistID: string, taskID: string, task: TaskType) => ({
    type: "TASKS/UPDATE-TASK",
    payload: {
        todolistID,
        taskID,
        task,
    },
} as const);

export const changeTaskEntityStatusAC = (
    todoListID: string, taskID: string, status: RequestStatusType
) => ({
    type: "CHANGE-TASK-ENTITY-STATUS",
    payload: {
        todoListID,
        taskID,
        status
    },
} as const);


// Thunk Creators
export const fetchTasksTC = (todolistID: string) =>
    async (dispatch: TasksThunkType) => {
        dispatch(setAppStatusAC("loading"));
        try {
            const resp = await todolistAPI.getTasks(todolistID);
            dispatch(setTasksAC(todolistID, resp.data.items));
            dispatch(setAppStatusAC("succeeded"));
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        }
    }

export const deleteTaskTC = (todolistID: string, taskID: string) =>
    async (dispatch: TasksThunkType) => {
        dispatch(setAppStatusAC("loading"));
        dispatch(changeTaskEntityStatusAC(todolistID, taskID, "loading"));
        try {
            const resp = await todolistAPI.deleteTask(todolistID, taskID);
            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(removeTaskAC(todolistID, taskID));
                dispatch(setAppStatusAC("succeeded"));
            } else {
                handleServerAppError(resp.data, dispatch);
            }
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch);
        }
    }

export const addTaskTC = (todolistID: string, title: string) =>
    async (dispatch: TasksThunkType) => {
        dispatch(setAppStatusAC("loading"));
        dispatch(changeTodolistEntityStatusAC(todolistID, "loading"));
        try {
            const resp = await todolistAPI.createTask(todolistID, title);
            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(addTaskAC(todolistID, resp.data.data.item));
                dispatch(changeTodolistEntityStatusAC(todolistID, "succeeded"));
                dispatch(setAppStatusAC("succeeded"));
            } else {
                handleServerAppError(resp.data, dispatch, todolistID);
            }
        } catch (err) {
            handleServerNetworkError(err as Error | AxiosError, dispatch, todolistID);
        }
    }

export const updateTaskTC = (todolistID: string, taskID: string, value: UpdateTaskType) =>
    async (dispatch: TasksThunkType, getState: () => AppRootStateType) => {
        const task = getState().tasks[todolistID].find(t => t.id === taskID);

        if (task) {
            dispatch(setAppStatusAC("loading"));
            dispatch(changeTaskEntityStatusAC(todolistID, taskID, "loading"));
            try {
                const resp = await todolistAPI.updateTask(todolistID, taskID, {...task, ...value});
                if (resp.data.resultCode === ResultCodes.OK) {
                    dispatch(updateTaskAC(todolistID, taskID, resp.data.data.item));
                    dispatch(changeTaskEntityStatusAC(todolistID, taskID, "succeeded"));
                    dispatch(setAppStatusAC("succeeded"));
                } else {
                    handleServerAppError(resp.data, dispatch, todolistID);
                }
            } catch (err) {
                handleServerNetworkError(err as Error | AxiosError, dispatch, todolistID);
            }
        } else {
            console.warn("A task wasn't found in the state");
            dispatch(setAppErrorAC("A task not found"));
        }
    }


// types
export type ChangeTaskEntityStatusType = ReturnType<typeof changeTaskEntityStatusAC>;

export type TasksActionType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodoListACType
    | SetTodolistsACType
    | RemoveTodolistACType
    | ReturnType<typeof setTasksAC>
    | ChangeTaskEntityStatusType

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

type TasksThunkType = Dispatch<TasksActionType
    | SetAppErrorActionType
    | SetAppStatusActionType
    | ChangeTaskEntityStatusType
    | ChangeTodolistEntityStatusType>