import {v1} from "uuid";
import {FilterValuesType, TodoListsType} from "../App";

export type ActionType =
    | RemoveTodolistACType
    | changeTodoListTitleACType
    | changeTodoListFilterACType
    | addTodoListACType;

export const todoLists_reducer = (
    state: Array<TodoListsType>,
    action: ActionType
) => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter((el) => el.id !== action.payload.todoListID);
        case "CHANGE-TODOLIST-TITLE":
            return state.map((el) =>
                el.id === action.payload.todoListID
                    ? {...el, title: action.payload.title}
                    : el
            );
        case "ADD-TODOLIST":
            const newTodoListID = v1();
            const newTodoList: TodoListsType = {
                id: newTodoListID,
                title: action.payload.title,
                filter: "all",
            };
            return [...state, newTodoList];
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

type RemoveTodolistACType = ReturnType<typeof removeTodoListAC>;
export const removeTodoListAC = (todoListID: string) => ({
    type: "REMOVE-TODOLIST" as const,
    payload: {
        todoListID,
    },
});

type changeTodoListTitleACType = ReturnType<typeof changeTodoListTitleAC>;
export const changeTodoListTitleAC = (todoListID: string, title: string) => ({
    type: "CHANGE-TODOLIST-TITLE" as const,
    payload: {
        todoListID,
        title,
    },
});

type addTodoListACType = ReturnType<typeof addTodoListAC>;
export const addTodoListAC = (title: string) => ({
    type: "ADD-TODOLIST" as const,
    payload: {
        title,
    },
});

type changeTodoListFilterACType = ReturnType<typeof changeTodoListFilterAC>;
export const changeTodoListFilterAC = (
    todoListID: string,
    value: FilterValuesType
) => ({
    type: "CHANGE-TODOLIST-FILTER" as const,
    payload: {
        todoListID,
        value,
    },
});
