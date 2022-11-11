import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {todoLists_reducer, TodosActionType} from "./todoLists_reducer";
import {tasks_reducer, TasksActionType} from "./tasks_reducer";
import thunk, {ThunkDispatch} from "redux-thunk";

const rootReducer = combineReducers({
    todoList: todoLists_reducer,
    tasks: tasks_reducer
});

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppActionsType = TodosActionType | TasksActionType;
export type AppDispatch = ThunkDispatch<AppRootStateType, any, AppActionsType>

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

// @ts-ignore
window.store = store;