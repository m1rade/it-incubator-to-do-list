import {combineReducers} from "redux"
import {appReducer} from "./app-reducer"
import {authReducer} from "features/Auth/auth-reducer"
import {configureStore} from "@reduxjs/toolkit";
import {todolistsReducer} from "features/TodoListsPage/TodoList/todolists-reducer";
import {tasksReducer} from "features/TodoListsPage/TodoList/Task/tasks-reducer";


export const store = configureStore({
    reducer: combineReducers({
        tasks: tasksReducer,
        todolists: todolistsReducer,
        app: appReducer,
        auth: authReducer
    })
});


export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


// @ts-ignore
window.store = store;
