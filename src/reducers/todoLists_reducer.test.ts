import {
    addTodoListAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    removeTodoListAC,
    todoLists_reducer,
} from "./todoLists_reducer";
import {v1} from "uuid";
import {FilterValuesType, TodoListsType} from "../App";

test("correct todolist should be removed", () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    const startState: Array<TodoListsType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"},
    ];

    const endState = todoLists_reducer(
        startState,
        removeTodoListAC(todolistId1)
    );

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newTodolistTitle = "New Todolist";

    const startState: Array<TodoListsType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"},
    ];

    const endState = todoLists_reducer(
        startState,
        addTodoListAC(newTodolistTitle)
    );

    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe(newTodolistTitle);
    expect(endState[2].filter).toBe("all");
});

test("correct todolist should change its name", () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newTodolistTitle = "New Todolist";

    const startState: Array<TodoListsType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"},
    ];

    const endState = todoLists_reducer(
        startState,
        changeTodoListTitleAC(todolistId2, newTodolistTitle)
    );

    expect(endState[0].title).toBe("What to learn");
    expect(endState).not.toBe(startState);
    expect(endState[0].title).toBe(startState[0].title);
    expect(endState[1].title).not.toBe(startState[1].title);
    expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter of todolist should be changed", () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newFilter: FilterValuesType = "completed";

    const startState: Array<TodoListsType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"},
    ];

    const endState = todoLists_reducer(
        startState,
        changeTodoListFilterAC(todolistId2, newFilter)
    );

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});
