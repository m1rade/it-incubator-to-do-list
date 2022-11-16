import {addTaskAC, removeTaskAC, tasks_reducer, TasksStateType, updateTaskAC} from "./tasks_reducer";
import {addTodoListAC, removeTodoListAC} from "../todoLists_reducer";
import {v1} from "uuid";
import {TaskStatuses} from "../../../../api/todolist-api";


let startState: TasksStateType;

beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                addedDate: "",
                deadline: null,
                description: null,
                order: 0,
                priority: 0,
                startDate: null,
                status: 0,
                todoListId: "todolistId1",
                completed: false,
            },
            {
                id: "2", title: "JS",
                addedDate: "",
                deadline: null,
                description: null,
                order: 0,
                priority: 0,
                startDate: null,
                status: 0,
                todoListId: "todolistId1",
                completed: false,
            },
            {
                id: "3", title: "React",
                addedDate: "",
                deadline: null,
                description: null,
                order: 0,
                priority: 0,
                startDate: null,
                status: 0,
                todoListId: "todolistId1",
                completed: false,
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                addedDate: "",
                deadline: null,
                description: null,
                order: 0,
                priority: 0,
                startDate: null,
                status: 0,
                todoListId: "todolistId2",
                completed: false,
            },
            {
                id: "2",
                title: "milk",
                addedDate: "",
                deadline: null,
                description: null,
                order: 0,
                priority: 0,
                startDate: null,
                status: 0,
                todoListId: "todolistId2",
                completed: false,
            },
            {
                id: "3",
                title: "tea",
                addedDate: "",
                deadline: null,
                description: null,
                order: 0,
                priority: 0,
                startDate: null,
                status: 0,
                todoListId: "todolistId2",
                completed: false,
            }
        ]
    };
})


test("correct task should be deleted from correct array", () => {
    const endState = tasks_reducer(startState, removeTaskAC("todolistId2", "2"));

    expect(endState).toEqual({
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                addedDate: "",
                deadline: null,
                description: null,
                order: 0,
                priority: 0,
                startDate: null,
                status: 0,
                todoListId: "todolistId1",
                completed: false,
            },
            {
                id: "2", title: "JS",
                addedDate: "",
                deadline: null,
                description: null,
                order: 0,
                priority: 0,
                startDate: null,
                status: 0,
                todoListId: "todolistId1",
                completed: false,
            },
            {
                id: "3", title: "React",
                addedDate: "",
                deadline: null,
                description: null,
                order: 0,
                priority: 0,
                startDate: null,
                status: 0,
                todoListId: "todolistId1",
                completed: false,
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                addedDate: "",
                deadline: null,
                description: null,
                order: 0,
                priority: 0,
                startDate: null,
                status: 0,
                todoListId: "todolistId2",
                completed: false,
            },
            {
                id: "3",
                title: "tea",
                addedDate: "",
                deadline: null,
                description: null,
                order: 0,
                priority: 0,
                startDate: null,
                status: 0,
                todoListId: "todolistId2",
                completed: false,
            }
        ]
    });

});

test("correct task should be added to correct array", () => {
    const newTask = {
        id: v1(),
        title: "juice",
        addedDate: "",
        deadline: null,
        description: null,
        order: 0,
        priority: 0,
        startDate: null,
        status: 0,
        todoListId: "todolistId2",
        completed: false,
    }

    const endState = tasks_reducer(startState, addTaskAC("todolistId2", newTask));

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].title).toBe("juice");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});

test("status of specified task should be changed", () => {
    const updatedTask = {
        id: "2",
        title: "milk",
        addedDate: "",
        deadline: null,
        description: null,
        order: 0,
        priority: 0,
        startDate: null,
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        completed: false,
    }

    const endState = tasks_reducer(startState, updateTaskAC("todolistId2", "2", updatedTask));

    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.Completed);
    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.New);
    expect(endState).not.toEqual(startState);
});

test("title of specified task should be changed", () => {
    const updatedTask = {
        id: "2",
        title: "Snickers",
        addedDate: "",
        deadline: null,
        description: null,
        order: 0,
        priority: 0,
        startDate: null,
        status: 0,
        todoListId: "todolistId2",
        completed: false,
    }

    const endState = tasks_reducer(startState, updateTaskAC("todolistId2", "2", updatedTask));

    expect(endState["todolistId2"][1].title).toBe("Snickers");
    expect(endState["todolistId1"][1].title).toBe("JS");
    expect(endState).not.toEqual(startState);
});

test("new array should be added when new todolist is added", () => {
    let newTodolistID = v1();

    let newTodolist = {
        id: newTodolistID,
        title: "What to read",
        filter: "all",
        addedDate: "",
        order: 0,
    };

    const endState = tasks_reducer(startState, addTodoListAC(newTodolist));

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== "todolistId1" && k !== "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(newKey).toBe(newTodolistID);
    expect(endState[newKey]).toEqual([]);
});

test("property with todolistId should be deleted", () => {
    const endState = tasks_reducer(startState, removeTodoListAC("todolistId2"))

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(startState).not.toEqual(endState);
    expect(endState["todolistId2"]).toBeUndefined();
});
