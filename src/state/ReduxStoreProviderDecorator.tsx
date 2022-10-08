import React from "react";
import {Provider} from "react-redux";
import {combineReducers, legacy_createStore} from "redux";
import {v1} from "uuid";
import {todoLists_reducer} from "./todoLists_reducer";
import {tasks_reducer} from "./tasks_reducer";

const rootReducer = combineReducers({
    todoLists: todoLists_reducer,
    tasks: tasks_reducer
});

export type StorybookRootStateType = ReturnType<typeof rootReducer>

const initialGlobalState = {
    todoLists: [
        {id: "todolistId1", title: "What to learn", filter: "all"},
        {id: "todolistId2", title: "What to buy", filter: "all"}
    ],
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: false}
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk", isDone: false},
            {id: v1(), title: "React Book", isDone: true}
        ]
    }
}

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as StorybookRootStateType)

export const ReduxStoreProviderDecorator = (storyFunc: () => JSX.Element) => {
    return <Provider store={storyBookStore}>{storyFunc()}</Provider>
}