import {v1} from "uuid";
import {todolistAPI, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";


export type TodosActionType =
    | RemoveTodolistACType
    | ChangeTodoListTitleACType
    | ChangeTodoListFilterACType
    | AddTodoListACType
    | SetTodolistsACType

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
}


const initialState: TodolistDomainType[] = [];

export const todoLists_reducer = (
    state: TodolistDomainType[] = initialState,
    action: TodosActionType
): TodolistDomainType[] => {
    switch (action.type) {
        case "SET-TODOS": {
            return action.todos.map(t => ({...t, filter: "all"}));
        }
        case "REMOVE-TODOLIST":
            return state.filter((el) => el.id !== action.todoListID);
        case "CHANGE-TODOLIST-TITLE":
            return state.map((el) =>
                el.id === action.payload.todoListID
                    ? {...el, title: action.payload.title}
                    : el
            );
        case "ADD-TODOLIST":
            return [...state, {
                id: action.payload.todoListID,
                title: action.payload.title,
                filter: "all",
                addedDate: "",
                order: 0,
            }];
        case "CHANGE-TODOLIST-FILTER":
            return state.map((el) =>
                el.id === action.payload.todoListID
                    ? {...el, filter: action.payload.value}
                    : el
            );
        default:
            return state;
    }
};


// Action Creators
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>
export const setTodolistsAC = (todos: TodolistType[]) => ({
    type: "SET-TODOS",
    todos
} as const);

export type RemoveTodolistACType = ReturnType<typeof removeTodoListAC>;
export const removeTodoListAC = (todoListID: string) => ({
    type: "REMOVE-TODOLIST",
    todoListID,
} as const);

type ChangeTodoListTitleACType = ReturnType<typeof changeTodoListTitleAC>;
export const changeTodoListTitleAC = (todoListID: string, title: string) => ({
    type: "CHANGE-TODOLIST-TITLE",
    payload: {
        todoListID,
        title,
    }
} as const);

export type AddTodoListACType = ReturnType<typeof addTodoListAC>;
export const addTodoListAC = (title: string) => ({
    type: "ADD-TODOLIST",
    payload: {
        todoListID: v1(),
        title,
    }
} as const);

type ChangeTodoListFilterACType = ReturnType<typeof changeTodoListFilterAC>;
export const changeTodoListFilterAC = (
    todoListID: string,
    value: FilterValuesType
) => ({
    type: "CHANGE-TODOLIST-FILTER",
    payload: {
        todoListID,
        value,
    }
} as const);


// Thunk Creators
export const fetchTodoTC = () => (dispatch: Dispatch) => {
    todolistAPI.getTodolists()
        .then((resp) => {
            const data = resp.data;
            dispatch(setTodolistsAC(data));
        })
}
