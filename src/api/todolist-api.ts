import axios, {AxiosResponse} from "axios";

// settings for server requests
const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "c2f95e37-50c6-42af-975e-1d3b28d3998b",
    },
})

// api
export const todolistAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>("todo-lists");
    },
    changeTodolistTitle(todolistID: string, title: string) {
        return instance.put<{ title: string }, AxiosResponse<ResponseType>>(`todo-lists/${todolistID}`, {title})
    },
    createTodolist(title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TodolistType }>>>("todo-lists", {title});
    },
    deleteTodolist(todolistID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistID}`);
    },
    getTasks(todolistID: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistID}/tasks`);
    },
    createTask(todolistID: string, title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistID}/tasks`, {title});
    },
    deleteTask(todolistID: string, taskID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistID}/tasks/${taskID}`);
    },
    updateTask(todolistID: string, taskID: string, taskModel: UpdateTaskModelType) {
        return instance.put<UpdateTaskModelType, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistID}/tasks/${taskID}`, taskModel);
    }
}

// app types
export type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number,
}

export type TaskType = {
    addedDate: string,
    deadline: string | null,
    description: string | null,
    id: string,
    order: number,
    priority: TodoTaskPriorities
    startDate: string | null,
    status: TaskStatuses,
    title: string,
    todoListId: string,
    completed: boolean,
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

export enum TodoTaskPriorities {
    Low = 0,
    Middle = 1,
    High = 2,
    Urgently = 3,
    Later = 4,
}

export type UpdateTaskModelType = {
    title?: string,
    description?: string | null,
    completed?: boolean,
    status?: TaskStatuses,
    priority?: TodoTaskPriorities,
    startDate?: string | null,
    deadline?: string | null,
}

export type ResponseType<T = {}> = {
    data: T,
    messages: string[],
    fieldErrors: string[],
    resultCode: number,
}

type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}