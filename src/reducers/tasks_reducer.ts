import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTodoListACType, RemoveTodolistACType} from "./todoLists_reducer";

export type RemoveTaskActionType = {
    type: "REMOVE-TASK",
    payload: {
        todolistID: string,
        taskID: string
    }
}

export type AddTaskActionType = {
    type: "ADD-TASK",
    payload: {
        todolistID: string,
        title: string
    }
}

export type ChangeTaskStatusActionType = {
    type: "CHANGE-TASK-STATUS",
    payload: {
        todolistID: string,
        taskID: string,
        isDone: boolean
    }
}

export type ChangeTaskTitleActionType = {
    type: "CHANGE-TASK-TITLE",
    payload: {
        todolistID: string,
        taskID: string,
        title: string
    }
}

export type ActionType =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodoListACType
    | RemoveTodolistACType;

export const tasks_reducer = (state: TasksStateType, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].filter(t => t.id !== action.payload.taskID)
            };
        case "ADD-TASK":
            const newTask = {id: v1(), title: action.payload.title, isDone: false};
            return {...state, [action.payload.todolistID]: [newTask, ...state[action.payload.todolistID]]};
        case "CHANGE-TASK-STATUS":
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].map(t => t.id === action.payload.taskID ? {
                    ...t,
                    isDone: action.payload.isDone
                } : t)
            }
        case "CHANGE-TASK-TITLE":
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].map(t => t.id === action.payload.taskID ? {
                    ...t,
                    title: action.payload.title
                } : t)
            };
        case "ADD-TODOLIST":
            const newTodoListID = action.todoListID;
            return {...state, [newTodoListID]: []};
        case "REMOVE-TODOLIST":
            const stateCopy = {...state};
            delete stateCopy[action.payload.todoListID];
            return stateCopy;
        // const {[action.payload.todoListID]: [], ...rest} = {...state};
        default:
            return {...state};
    }
};

export const removeTaskAC = (todolistID: string, taskID: string): RemoveTaskActionType => {
    return {
        type: "REMOVE-TASK" as const, payload: {
            todolistID, taskID
        }
    }
};

export const addTaskAC = (todolistID: string, title: string): AddTaskActionType => {
    return {
        type: "ADD-TASK" as const, payload: {
            todolistID, title
        }
    }
};

export const changeTaskStatusAC = (todolistID: string, taskID: string, isDone: boolean): ChangeTaskStatusActionType => {
    return {
        type: "CHANGE-TASK-STATUS" as const, payload: {
            todolistID, taskID, isDone
        }
    }
};

export const changeTaskTitleAC = (todolistID: string, taskID: string, title: string): ChangeTaskTitleActionType => {
    return {
        type: "CHANGE-TASK-TITLE" as const, payload: {
            todolistID, taskID, title
        }
    }
}