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
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{
            item: TodolistType
        }>>>("todo-lists", {title});
    },
    deleteTodolist(todolistID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistID}`);
    },
    getTasks(todolistID: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistID}/tasks`);
    },
    createTask(args: CreateTaskArgsType) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{
            item: TaskType
        }>>>(`todo-lists/${args.todolistID}/tasks`, {title: args.title});
    },
    deleteTask(args: DeleteTaskArgsType) {
        return instance.delete<ResponseType>(`todo-lists/${args.todolistID}/tasks/${args.taskID}`);
    },
    updateTask(todolistID: string, taskID: string, taskModel: UpdateTaskModelType) {
        return instance.put<UpdateTaskModelType, AxiosResponse<ResponseType<{
            item: TaskType
        }>>>(`todo-lists/${todolistID}/tasks/${taskID}`, taskModel);
    }
}

export const authAPI = {
    login(userData: LoginParamsType) {
        return instance.post<LoginParamsType, AxiosResponse<ResponseType<{ userId: number }>>>(`auth/login`, userData);
    },
    authMe() {
        return instance.get<ResponseType<authMeResponseType>>(`auth/me`);
    },
    logout() {
        return instance.delete<ResponseType>(`auth/login`);
    }
}

// app types
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

export enum ResultCodes {
    OK = 0,
    Error = 1,
    Captcha = 10,
}

export type UpdateTaskModelType = {
    title?: string
    description?: string | null
    completed?: boolean
    status?: TaskStatuses
    priority?: TodoTaskPriorities
    startDate?: string | null
    deadline?: string | null
}

export type ResponseType<T = {}> = {
    data: T,
    messages: string[]
    fieldErrors: string[]
    resultCode: number
}

export type authMeResponseType = {
    id: number
    email: string
    login: string
}

type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
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