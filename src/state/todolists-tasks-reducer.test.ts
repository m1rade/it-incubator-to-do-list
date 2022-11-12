import {TasksStateType, TodoListsType} from "../misc/App_old";
import {addTodoListAC, todoLists_reducer} from "./todoLists_reducer";
import {tasks_reducer} from "./tasks_reducer";

test("ids should be equals", () => {
    const startTasksState: TasksStateType = {};
    const startTodoListsState: Array<TodoListsType> = [];

    const action = addTodoListAC("new todolist");

    const endTasksState = tasks_reducer(startTasksState, action)
    const endTodoListsState = todoLists_reducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(action.todoListID);
    expect(idFromTodoLists).toBe(action.todoListID);
});
