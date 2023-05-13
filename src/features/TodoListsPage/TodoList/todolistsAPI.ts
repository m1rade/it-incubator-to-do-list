import {AxiosResponse} from "axios";
import {instance} from "common/api";
import {ServerResponseType} from "common/api/instance";
import {TaskStatuses, TodoTaskPriorities} from "common/enums";


export const todolistAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>("todo-lists");
    },
    changeTodolistTitle(args: ChangeTodoTitleArgsType) {
        return instance.put<{ title: string }, AxiosResponse<ServerResponseType>>(`todo-lists/${args.todolistID}`, {title: args.title})
    },
    createTodolist(title: string) {
        return instance.post<{ title: string }, AxiosResponse<ServerResponseType<{
            item: TodolistType
        }>>>("todo-lists", {title});
    },
    deleteTodolist(todolistID: string) {
        return instance.delete<ServerResponseType>(`todo-lists/${todolistID}`);
    },
    getTasks(todolistID: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistID}/tasks`);
    },
    createTask(args: CreateTaskArgsType) {
        return instance.post<{ title: string }, AxiosResponse<ServerResponseType<{
            item: TaskType
        }>>>(`todo-lists/${args.todolistID}/tasks`, {title: args.title});
    },
    deleteTask(args: DeleteTaskArgsType) {
        return instance.delete<ServerResponseType>(`todo-lists/${args.todolistID}/tasks/${args.taskID}`);
    },
    updateTask(todolistID: string, taskID: string, taskModel: UpdateTaskModelType) {
        return instance.put<UpdateTaskModelType, AxiosResponse<ServerResponseType<{
            item: TaskType
        }>>>(`todo-lists/${todolistID}/tasks/${taskID}`, taskModel);
    }
}

// types
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type TaskType = {
    addedDate: string
    deadline: string | null
    description: string | null
    id: string
    order: number
    priority: TodoTaskPriorities
    startDate: string | null
    status: TaskStatuses
    title: string
    todolistID: string
    completed: boolean
}

type UpdateTaskModelType = {
    title?: string
    description?: string | null
    completed?: boolean
    status?: TaskStatuses
    priority?: TodoTaskPriorities
    startDate?: string | null
    deadline?: string | null
}

type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}

export type CreateTaskArgsType = {
    todolistID: string
    title: string
}

export type UpdateTaskArgsType = {
    todolistID: string
    taskID: string
    taskModel: UpdateTaskModelType
}

export type DeleteTaskArgsType = {
    todolistID: string
    taskID: string
}

export type ChangeTodoTitleArgsType = {
    todolistID: string,
    title: string
}