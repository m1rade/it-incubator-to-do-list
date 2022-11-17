import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {todoLists_reducer, TodosActionType} from "../features/TodoListsPage/TodoList/todoLists_reducer";
import {tasks_reducer, TasksActionType} from "../features/TodoListsPage/TodoList/Task/tasks_reducer";
import thunk, {ThunkDispatch} from "redux-thunk";
import {AppActionsType, appReducer} from "../app/app_reducer";
import {AuthActionsType, authReducer} from "../features/LoginPage/auth_reducer";

const rootReducer = combineReducers({
    todoList: todoLists_reducer,
    tasks: tasks_reducer,
    app: appReducer,
    auth: authReducer,
});

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppRootActionsType =
    TodosActionType
    | TasksActionType
    | AppActionsType
    | AuthActionsType;
export type AppDispatch = ThunkDispatch<AppRootStateType, any, AppRootActionsType>

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

// @ts-ignore
window.store = store;