import {todolistAPI, TodolistType} from "../../../api/todolist-api";
import {Dispatch} from "redux";


const initialState: TodolistDomainType[] = [];

// reducer
export const todoLists_reducer = (
    state: TodolistDomainType[] = initialState,
    action: TodosActionType
): TodolistDomainType[] => {
    switch (action.type) {
        case "SET-TODOS":
            return action.todos.map(t => ({...t, filter: "all"}));
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
                id: action.todoList.id,
                title: action.todoList.title,
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
export const addTodoListAC = (todoList: TodolistType) => ({
    type: "ADD-TODOLIST",
    todoList
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
export const fetchTodoTC = () =>
    (dispatch: Dispatch<TodosActionType>) => {
        todolistAPI.getTodolists()
            .then((resp) => {
                const data = resp.data;
                dispatch(setTodolistsAC(data));
            })
    }

export const addTodoTC = (title: string) =>
    (dispatch: Dispatch<TodosActionType>) => {
        todolistAPI.createTodolist(title)
            .then(resp => {
                dispatch(addTodoListAC(resp.data.data.item))
            })
    }

export const deleteTodoTC = (todoListID: string) =>
    (dispatch: Dispatch<TodosActionType>) => {
        todolistAPI.deleteTodolist(todoListID)
            .then(resp => {
                dispatch(removeTodoListAC(todoListID))
            })
    }

export const changeTodoTitleTC = (todoListID: string, title: string) =>
    (dispatch: Dispatch<TodosActionType>) => {
        todolistAPI.changeTodolistTitle(todoListID, title)
            .then(resp => {
                dispatch(changeTodoListTitleAC(todoListID, title))
            })
    }


// types
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