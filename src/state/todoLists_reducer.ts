import {v1} from "uuid";
import {FilterValuesType, TodoListsType} from "../App";

export type ActionType =
    | RemoveTodolistACType
    | ChangeTodoListTitleACType
    | ChangeTodoListFilterACType
    | AddTodoListACType;

export const todolistID1 = v1();
export const todolistID2 = v1();

const initialState: Array<TodoListsType> = [
    {id: todolistID1, title: "What to learn", filter: "all"},
    {id: todolistID2, title: "What to buy", filter: "all"},
]

export const todoLists_reducer = (
    state: Array<TodoListsType> = initialState,
    action: ActionType
): Array<TodoListsType> => {
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
            const newTodoListID = action.todoListID;
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

export type RemoveTodolistACType = ReturnType<typeof removeTodoListAC>;
export const removeTodoListAC = (todoListID: string) => ({
    type: "REMOVE-TODOLIST" as const,
    payload: {
        todoListID,
    },
});

type ChangeTodoListTitleACType = ReturnType<typeof changeTodoListTitleAC>;
export const changeTodoListTitleAC = (todoListID: string, title: string) => ({
    type: "CHANGE-TODOLIST-TITLE" as const,
    payload: {
        todoListID,
        title,
    },
});

export type AddTodoListACType = ReturnType<typeof addTodoListAC>;
export const addTodoListAC = (title: string) => ({
    type: "ADD-TODOLIST" as const,
    todoListID: v1(),
    payload: {
        title,
    },
});

type ChangeTodoListFilterACType = ReturnType<typeof changeTodoListFilterAC>;
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
