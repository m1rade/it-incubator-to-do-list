import {v1} from "uuid";
import {RequestStatusType} from "app/app-reducer";
import {
    FilterValuesType,
    TodolistDomainType,
    todolistsActions,
    todolistsReducer, todosThunks
} from "features/TodoListsPage/TodoList/todolists-reducer";
import {TodolistType} from "features/TodoListsPage/TodoList/todolistsAPI";
import {tasksReducer} from "features/TodoListsPage/TodoList/Tasks/Task/tasks-reducer";

let todolistID1: string
let todolistID2: string
let startState: Array<TodolistDomainType> = []

beforeEach(() => {
    todolistID1 = v1()
    todolistID2 = v1()
    startState = [
        {id: todolistID1, title: "What to learn", filter: "all", entityStatus: "idle", addedDate: "", order: 0},
        {id: todolistID2, title: "What to buy", filter: "all", entityStatus: "idle", addedDate: "", order: 0}
    ]
})

test("correct todolist should be removed", () => {
    const todolistID = todolistID1

    const endState = todolistsReducer(startState, todosThunks.deleteTodo.fulfilled({todolistID}, "requestId", todolistID))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistID2)
})

test("correct todolist should be added", () => {
    let todolist: TodolistType = {
        title: "New Todolist",
        id: "any id",
        addedDate: "",
        order: 0
    }


    const endState = todolistsReducer(startState, todosThunks.addTodo.fulfilled({todolist}, "requestId", todolist.title))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(todolist.title)
    expect(endState[0].filter).toBe("all")
})

test("correct todolist should change its name", () => {
    let newTodolistTitle = {todolistID: todolistID2, title: "New Todolist"}

    const action = todosThunks.changeTodoTitle.fulfilled(newTodolistTitle, "requestId",newTodolistTitle )

    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe("What to learn")
    expect(endState[1].title).toBe("New Todolist")
})

test("correct filter of todolist should be changed", () => {
    let filter: FilterValuesType = "completed"

    const action = todolistsActions.changeTodolistFilter({todolistID: todolistID2, filter})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe("all")
    expect(endState[1].filter).toBe(filter)
})
test("todolists should be added", () => {

    const action = todosThunks.fetchTodos.fulfilled({todos: startState}, "requestId")

    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})
test("correct entity status of todolist should be changed", () => {
    let entityStatus: RequestStatusType = "loading"

    const action = todolistsActions.changeTodolistEntityStatus({todolistID: todolistID2, entityStatus})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].entityStatus).toBe("idle")
    expect(endState[1].entityStatus).toBe(entityStatus)
})
test("empty arrays should be added when we set todolists", () => {
    const action = todosThunks.fetchTodos.fulfilled({
        todos: [
            {id: "1", title: "title 1", order: 0, addedDate: ""},
            {id: "2", title: "title 2", order: 0, addedDate: ""}
        ]
    }, "requestId")

    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState["1"]).toBeDefined()
    expect(endState["2"]).toBeDefined()
})