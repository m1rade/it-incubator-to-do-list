import React from "react";
import {Provider} from "react-redux";
import {combineReducers, legacy_createStore} from "redux";
import {todoLists_reducer} from "./todoLists_reducer";
import {tasks_reducer} from "./tasks_reducer";

const rootReducer = combineReducers({
    todoLists: todoLists_reducer,
    tasks: tasks_reducer
});
export type AppRootStateType = ReturnType<typeof rootReducer>;

const initialGlobalState = {}

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType)

export const ReduxStoreProviderDecorator = (storyFunc: () => JSX.Element) => {
    return <Provider store={storyBookStore}>{storyFunc()}</Provider>
}