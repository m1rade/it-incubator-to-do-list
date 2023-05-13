import {
    tasksReducer,
    TasksStateType,
    tasksThunks
} from "features/TodoListsPage/TodoList/Task/tasks-reducer";
import {todosThunks} from "features/TodoListsPage/TodoList/todolists-reducer";
import {TaskStatuses, TodoTaskPriorities} from "common/enums";

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
    const taskModel = {taskID: "2", todolistID: "todolistID2"};

    const action = tasksThunks.deleteTask.fulfilled(taskModel, "requiredId", taskModel);

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
    };
    const action = tasksThunks.addTask.fulfilled({
        todolistID: task.todolistID,
        task
    }, "requestId", {todolistID: task.todolistID, title: task.title});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistID1"].length).toBe(3);
    expect(endState["todolistID2"].length).toBe(4);
    expect(endState["todolistID2"][3].id).toBeDefined();
    expect(endState["todolistID2"][3].title).toBe("juice");
    expect(endState["todolistID2"][3].status).toBe(TaskStatuses.New);
});
test("status of specified task should be changed", () => {
    const taskModel = {
        todolistID: "todolistID2",
        taskID: "2",
        taskModel: {status: TaskStatuses.New}
    }

    const action = tasksThunks.updateTask.fulfilled(taskModel, 'requestId', taskModel);

    const endState = tasksReducer(startState, action)

    expect(endState["todolistID1"][1].status).toBe(TaskStatuses.Completed);
    expect(endState["todolistID2"][1].status).toBe(TaskStatuses.New);
});
test("title of specified task should be changed", () => {
    const taskModel = {
        todolistID: "todolistID2",
        taskID: "2",
        taskModel: {title: "yogurt"}
    }

    const action = tasksThunks.updateTask.fulfilled(taskModel, 'requestId', taskModel);

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

    const action = todosThunks.addTodo.fulfilled({todolist}, "requestId", todolist.title);

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
    const todolistID = "todolistID2"

    const action = todosThunks.deleteTodo.fulfilled({todolistID}, "requestId", todolistID);

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistID2"]).not.toBeDefined();
});


test("tasks should be added for todolist", () => {
    const action = tasksThunks.fetchTasks.fulfilled({
        todolistID: "todolistID1",
        tasks: startState["todolistID1"]
    }, "requestId", "todolistID1");

    const endState = tasksReducer({
        "todolistID2": [],
        "todolistID1": []
    }, action)

    expect(endState["todolistID1"].length).toBe(3)
    expect(endState["todolistID2"].length).toBe(0)
})