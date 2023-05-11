import {v1} from "uuid";
import {RequestStatusType} from "app/app-reducer";
import {TodolistType} from "api/todolist-api";
import {
    FilterValuesType,
    TodolistDomainType,
    todolistsActions,
    todolistsReducer
} from "features/TodoListsPage/TodoList/todolists-reducer";

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
    const endState = todolistsReducer(startState, todolistsActions.removeTodolist({todolistID: todolistID1}))

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


    const endState = todolistsReducer(startState, todolistsActions.addTodolist({todolist}))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(todolist.title)
    expect(endState[0].filter).toBe("all")
})

test("correct todolist should change its name", () => {
    let newTodolistTitle = "New Todolist"

    const action = todolistsActions.changeTodolistTitle({todolistID: todolistID2, title: newTodolistTitle})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe("What to learn")
    expect(endState[1].title).toBe(newTodolistTitle)
})

test("correct filter of todolist should be changed", () => {
    let filter: FilterValuesType = "completed"

    const action = todolistsActions.changeTodolistFilter({todolistID: todolistID2, filter})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe("all")
    expect(endState[1].filter).toBe(filter)
})
test("todolists should be added", () => {

    const action = todolistsActions.setTodolists({todos: startState})

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