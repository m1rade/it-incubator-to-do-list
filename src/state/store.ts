import {combineReducers, createStore} from "redux";
import {todoLists_reducer} from "./todoLists_reducer";
import {tasks_reducer} from "./tasks_reducer";

const rootReducer = combineReducers({
    todoList: todoLists_reducer,
    tasks: tasks_reducer
})

export type AppRootStateType = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer);

// @ts-ignore
window.store = store;