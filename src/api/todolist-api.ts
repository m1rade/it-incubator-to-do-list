import axios from "axios";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "c2f95e37-50c6-42af-975e-1d3b28d3998b",
    },
})

export const todolistAPI = {
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(
            `todo-lists/${todolistId}`,
            {title}
        )
    },
    getTodolists() {
        return instance.get<TodolistType[]>("todo-lists");
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", {title});
    },
    deleteTodolist(todolistID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistID}`);
    },
    createTask(todolistID: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistID}/tasks`, {title});
    },
    getTasks(todolistID: string, count?: number, page?: number) {
        return instance.get<ResponseType<{ items: TaskType[] }>>(`todo-lists/${todolistID}/tasks?count=${count}&page=${page}`);
    },
    deleteTask(todolistID: string, taskID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistID}/tasks/${taskID}`);
    },
    updateTask(todolistID: string, taskID: string, taskItem: UpdateTaskType) {
        return instance.put<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistID}/tasks/${taskID}`, taskItem);
    }
}

type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number,
}

type TaskType = {
    addedDate: string,
    deadline: string | null,
    description: string | null,
    id: string,
    order: number,
    priority: number
    startDate: string | null,
    status: number,
    title: string,
    todoListId: string,
    completed: boolean,
}

type UpdateTaskType = {
    title: string,
    description: string | null,
    completed: boolean,
    status: number,
    priority: number,
    startDate: string | null,
    deadline: string | null,
}

type ResponseType<T = {}> = {
    data: T,
    messages: string[],
    fieldErrors: string[],
    resultCode: number,
}