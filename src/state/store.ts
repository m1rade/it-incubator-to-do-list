import {combineReducers, legacy_createStore} from "redux";
import {todoLists_reducer} from "./todoLists_reducer";
import {tasks_reducer} from "./tasks_reducer";

const rootReducer = combineReducers({
    todoList: todoLists_reducer,
    tasks: tasks_reducer
});

export type AppRootStateType = ReturnType<typeof rootReducer>

export const store = legacy_createStore(rootReducer);

// @ts-ignore
window.store = store;