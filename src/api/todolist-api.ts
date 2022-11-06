import axios from "axios";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "c2f95e37-50c6-42af-975e-1d3b28d3998b",
    },
})

// const settings = {
//     withCredentials: true,
//     headers: {
//         "API-KEY": "c2f95e37-50c6-42af-975e-1d3b28d3998b"
//     }
// }

export const todolistAPI = {
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(
            `todo-lists/${todolistId}`,
            {title: title}
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
    }
}

type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number,
}

type ResponseType<T = {}> = {
    data: T,
    messages: string[],
    fieldErrors: string[],
    resultCode: number,
}

// type CreateTodolistResponseType = {
//     data: {
//         item: TodolistType,
//     }
//     resultCode: number,
//     messages: string[],
//     fieldErrors: string[],
// }
//
// type UpdateTodolistResponseType = {
//     data: {},
//     messages: string[],
//     fieldErrors: string[],
//     resultCode: number,
// }