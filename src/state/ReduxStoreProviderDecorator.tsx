import React from "react";
import {Provider} from "react-redux";
import {combineReducers, legacy_createStore} from "redux";
import {todoLists_reducer} from "../features/TodoListsPage/TodoList/todoLists_reducer";
import {tasks_reducer} from "../features/TodoListsPage/TodoList/Task/tasks_reducer";
import {appReducer} from "../app/app_reducer";
import {authReducer} from "../features/LoginPage/auth_reducer";

const rootReducer = combineReducers({
    todoLists: todoLists_reducer,
    tasks: tasks_reducer,
    app: appReducer,
    auth: authReducer,
});
export type AppRootStateType = ReturnType<typeof rootReducer>;

const initialGlobalState = {}

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType)

export const ReduxStoreProviderDecorator = (storyFunc: () => JSX.Element) => {
    return <Provider store={storyBookStore}>{storyFunc()}</Provider>
}