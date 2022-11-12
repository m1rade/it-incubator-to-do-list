import {addTodoListAC, TodolistDomainType, todoLists_reducer} from "./todoLists_reducer";
import {tasks_reducer, TasksStateType} from "./tasks_reducer";
import {v1} from "uuid";

let newTodolistID: string;

beforeEach(() => {
    newTodolistID = v1();
});


test("ids should be equals", () => {
    const startTasksState: TasksStateType = {};
    const startTodoListsState: Array<TodolistDomainType> = [];

    const newTodolist = {
        id: newTodolistID,
        title: "What to read",
        filter: "all",
        addedDate: "",
        order: 0,
    };

    const action = addTodoListAC(newTodolist);

    const endTasksState = tasks_reducer(startTasksState, action)
    const endTodoListsState = todoLists_reducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(newTodolistID);
    expect(idFromTodoLists).toBe(newTodolistID);
});
