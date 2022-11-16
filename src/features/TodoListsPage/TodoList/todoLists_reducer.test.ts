import {
    addTodoListAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    FilterValuesType,
    removeTodoListAC,
    TodolistDomainType,
    todoLists_reducer
} from "./todoLists_reducer";
import {v1} from "uuid";

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType>;

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {
            id: todolistId1,
            title: "What to learn",
            filter: "all",
            addedDate: "",
            order: 0,
        },
        {
            id: todolistId2,
            title: "What to buy",
            filter: "all",
            addedDate: "",
            order: 0,
        },
    ];
})

test("correct todolist should be removed", () => {
    const endState = todoLists_reducer(startState, removeTodoListAC(todolistId1));

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
    let newTodolistID = v1();

    let newTodolist = {
        id: newTodolistID,
        title: "What to read",
        filter: "all",
        addedDate: "",
        order: 0,
    };

    const endState = todoLists_reducer(startState, addTodoListAC(newTodolist));

    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe(newTodolist.title);
    expect(endState[2].filter).toBe("all");
    expect(endState[2].id).toBe(newTodolistID);
});

test("correct todolist should change its name", () => {
    let newTodolistTitle = "New Todolist name";

    const endState = todoLists_reducer(startState, changeTodoListTitleAC(todolistId2, newTodolistTitle));

    expect(endState[0].title).toBe("What to learn");
    expect(endState).not.toBe(startState);
    expect(endState[0].title).toBe(startState[0].title);
    expect(endState[1].title).not.toBe(startState[1].title);
    expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter of todolist should be changed", () => {
    let newFilter: FilterValuesType = "completed";

    const endState = todoLists_reducer(startState, changeTodoListFilterAC(todolistId2, newFilter));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});
