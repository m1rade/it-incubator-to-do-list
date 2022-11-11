import {AddTodoListACType, RemoveTodolistACType, SetTodolistsACType} from "./todoLists_reducer";
import {TaskStatuses, TaskType, todolistAPI, TodoTaskPriorities} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";


export type TasksActionType =
    RemoveTaskACType
    | AddTaskACType
    | UpdateTaskACType
    | AddTodoListACType
    | RemoveTodolistACType
    | SetTasksACType
    | SetTodolistsACType

export type TasksStateType = {
    [key: string]: TaskType[];
};


const initialState: TasksStateType = {};

export const tasks_reducer = (
    state: TasksStateType = initialState,
    action: TasksActionType
): TasksStateType => {
    switch (action.type) {
        case "SET-TASKS": {
            return {...state, [action.payload.todolistID]: action.payload.tasks}
        }
        case "SET-TODOS": {
            let copyState = {...state};
            action.todos.forEach(t => {
                copyState[t.id] = [];
            });
            return copyState;
        }
        case "REMOVE-TASK":
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].filter(t => t.id !== action.payload.taskID)
            };
        case "ADD-TASK":
            return {...state, [action.payload.todolistID]: [action.payload.task, ...state[action.payload.todolistID]]};
        case "UPDATE-TASK":
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].map(t => t.id === action.payload.taskID ? {...t, ...action.payload.task} : t)
            }
        case "ADD-TODOLIST":
            return {...state, [action.payload.todoListID]: []};
        case "REMOVE-TODOLIST":
            const stateCopy = {...state};
            delete stateCopy[action.todoListID];
            return stateCopy;
        // const {[action.todoListID]: [], ...rest} = {...state};
        default:
            return state;
    }
};


// Action Creators
export type SetTasksACType = ReturnType<typeof setTasksAC>;
export const setTasksAC = (todolistID: string, tasks: TaskType[]) => ({
    type: "SET-TASKS",
    payload: {
        todolistID,
        tasks
    },
} as const);

export type RemoveTaskACType = ReturnType<typeof removeTaskAC>;
export const removeTaskAC = (todolistID: string, taskID: string) => ({
    type: "REMOVE-TASK",
    payload: {
        todolistID,
        taskID,
    }
} as const);

export type AddTaskACType = ReturnType<typeof addTaskAC>;
export const addTaskAC = (todolistID: string, task: TaskType) => ({
    type: "ADD-TASK",
    payload: {
        todolistID,
        task,
    }
} as const);

export type UpdateTaskACType = ReturnType<typeof updateTaskAC>;
export const updateTaskAC = (todolistID: string, taskID: string, task: TaskType) => ({
    type: "UPDATE-TASK",
    payload: {
        todolistID,
        taskID,
        task,
    },
} as const);


// Thunk Creators
export const fetchTasksTC = (todolistID: string) => (dispatch: Dispatch) => {
    todolistAPI.getTasks(todolistID)
        .then((resp) => {
            dispatch(setTasksAC(todolistID, resp.data.items));
        })
}

export const deleteTaskTC = (todolistID: string, taskID: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTask(todolistID, taskID)
        .then((resp) => {
            dispatch(removeTaskAC(todolistID, taskID));
        })
}

export const addTaskTC = (todolistID: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI.createTask(todolistID, title)
        .then((resp) => {
            dispatch(addTaskAC(todolistID, resp.data.data.item));
        });
}

export const updateTaskTC = (todolistID: string, taskID: string, value: UpdateTaskType) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistID].find(t => t.id === taskID);

    if (task) {
        todolistAPI.updateTask(todolistID, taskID, {...task, ...value})
            .then(resp => {
                dispatch(updateTaskAC(todolistID, taskID, resp.data.data.item));
            });
    }
}

export type UpdateTaskType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TodoTaskPriorities
    startDate?: string
    deadline?: string
}