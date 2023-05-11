import {TaskStatuses, TodoTaskPriorities} from "api/todolist-api";
import {tasksActions, tasksReducer, TasksStateType} from "features/TodoListsPage/TodoList/Task/tasks-reducer";
import {todolistsActions} from "features/TodoListsPage/TodoList/todolists-reducer";

let startState: TasksStateType = {};
beforeEach(() => {
    startState = {
        "todolistID1": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                todolistID: "todolistID1",
                description: "",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TodoTaskPriorities.Low,
                entityStatus: "idle",
                completed: false
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.Completed,
                todolistID: "todolistID1",
                description: "",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TodoTaskPriorities.Low,
                completed: false,
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                todolistID: "todolistID1",
                description: "",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TodoTaskPriorities.Low,
                completed: false,
                entityStatus: "idle"
            },
        ],
        "todolistID2": [
            {
                id: "1",
                title: "bread",
                status: TaskStatuses.New,
                todolistID: "todolistID2",
                description: "",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TodoTaskPriorities.Low,
                completed: false,
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "milk",
                status: TaskStatuses.Completed,
                todolistID: "todolistID2",
                description: "",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TodoTaskPriorities.Low,
                completed: false,
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                todolistID: "todolistID2",
                description: "",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TodoTaskPriorities.Low,
                completed: false,
                entityStatus: "idle"
            }
        ]
    };
});

test("correct task should be deleted from correct array", () => {
    const action = tasksActions.removeTask({taskID: "2", todolistID: "todolistID2"});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistID1"].length).toBe(3);
    expect(endState["todolistID2"].length).toBe(2);
    expect(endState["todolistID2"].every(t => t.id !== "2")).toBeTruthy();
});
test("correct task should be added to correct array", () => {
    const task = {
        addedDate: "",
        deadline: null,
        description: null,
        id: "id exists",
        order: 0,
        priority: 0,
        startDate: null,
        status: TaskStatuses.New,
        title: "juice",
        todolistID: "todolistID2",
        completed: false,
    }
    const action = tasksActions.addTask({todolistID: task.todolistID, task});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistID1"].length).toBe(3);
    expect(endState["todolistID2"].length).toBe(4);
    expect(endState["todolistID2"][0].id).toBeDefined();
    expect(endState["todolistID2"][0].title).toBe("juice");
    expect(endState["todolistID2"][0].status).toBe(TaskStatuses.New);
});
test("status of specified task should be changed", () => {
    const task = {
        addedDate: "",
        deadline: null,
        description: null,
        id: "id exists",
        order: 0,
        priority: 0,
        startDate: null,
        status: TaskStatuses.New,
        title: "yogurt",
        todolistID: "todolistID2",
        completed: false,
    }

    const action = tasksActions.updateTask({todolistID: "todolistID2", taskID: "2", task});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistID1"][1].status).toBe(TaskStatuses.Completed);
    expect(endState["todolistID2"][1].status).toBe(TaskStatuses.New);
});
test("title of specified task should be changed", () => {
    const task = {
        addedDate: "",
        deadline: null,
        description: null,
        id: "id exists",
        order: 0,
        priority: 0,
        startDate: null,
        status: TaskStatuses.New,
        title: "yogurt",
        todolistID: "todolistID2",
        completed: false,
    }


    const action = tasksActions.updateTask({todolistID: "todolistID2", taskID: "2", task});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistID1"][1].title).toBe("JS");
    expect(endState["todolistID2"][1].title).toBe("yogurt");
    expect(endState["todolistID2"][0].title).toBe("bread");
});
test("new array should be added when new todolist is added", () => {
    const todolist = {
        id: "blabla",
        title: "new todolist",
        order: 0,
        addedDate: ""
    }

    const action = todolistsActions.addTodolist({todolist});

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== "todolistID1" && k !== "todolistID2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});
test("propertry with todolistID should be deleted", () => {
    const action = todolistsActions.removeTodolist({todolistID: "todolistID2"});

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistID2"]).not.toBeDefined();
});

test("empty arrays should be added when we set todolists", () => {
    const action = todolistsActions.setTodolists({
        todos: [
            {id: "1", title: "title 1", order: 0, addedDate: ""},
            {id: "2", title: "title 2", order: 0, addedDate: ""}
        ]
    })

    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState["1"]).toBeDefined()
    expect(endState["2"]).toBeDefined()
})
test("tasks should be added for todolist", () => {
    const action = tasksActions.setTasks({todolistID: "todolistID1", tasks: startState["todolistID1"]});

    const endState = tasksReducer({
        "todolistID2": [],
        "todolistID1": []
    }, action)

    expect(endState["todolistID1"].length).toBe(3)
    expect(endState["todolistID2"].length).toBe(0)
})