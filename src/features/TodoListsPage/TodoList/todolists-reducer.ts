import {appActions, RequestStatusType,} from "app/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "common/utils";
import {clearTodosTasks} from "common/actions";
import {ChangeTodoTitleArgsType, todolistAPI, TodolistType} from "features/TodoListsPage/TodoList/todolistsAPI";
import {ResultCodes} from "common/enums";
import {createAppAsyncThunk} from "common/hooks";


const fetchTodos = createAppAsyncThunk<{ todos: TodolistType[] }, void>("todos/fetchTodos",
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;

        dispatch(appActions.setAppStatus({status: "loading"}));

        try {
            const resp = await todolistAPI.getTodolists();
            return {todos: resp.data}
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    });

const addTodo = createAppAsyncThunk<{ todolist: TodolistType }, string>("todos/addTodo",
    async (title, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;

        dispatch(appActions.setAppStatus({status: "loading"}));

        try {
            const resp = await todolistAPI.createTodolist(title);

            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(appActions.setAppStatus({status: "succeeded"}));
                return {todolist: resp.data.data.item}
            } else {
                handleServerAppError(resp.data, dispatch);
                return rejectWithValue(null);
            }

        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    });

const deleteTodo = createAppAsyncThunk<{
    todolistID: string
}, string>("todo/deleteTodo",
    async (todolistID, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;

        dispatch(appActions.setAppStatus({status: "loading"}));
        dispatch(todolistsActions.changeTodolistEntityStatus({todolistID, entityStatus: "loading"}));

        try {
            const resp = await todolistAPI.deleteTodolist(todolistID);

            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(appActions.setAppStatus({status: "succeeded"}));

                return {todolistID}
            } else {
                handleServerAppError(resp.data, dispatch);
                return rejectWithValue(null);
            }

        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    })

const changeTodoTitle = createAppAsyncThunk<ChangeTodoTitleArgsType, ChangeTodoTitleArgsType>("todo/changeTodoTitle",
    async (args, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;

        dispatch(appActions.setAppStatus({status: "loading"}));
        dispatch(todolistsActions.changeTodolistEntityStatus({todolistID: args.todolistID, entityStatus: "loading"}));

        try {
            const resp = await todolistAPI.changeTodolistTitle({...args});

            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(appActions.setAppStatus({status: "succeeded"}));
                dispatch(todolistsActions.changeTodolistEntityStatus({
                    todolistID: args.todolistID,
                    entityStatus: "succeeded"
                }));

                return {...args}
            } else {
                handleServerAppError(resp.data, dispatch);
                return rejectWithValue(null);
            }

        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    })

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        changeTodolistFilter: (state, action: PayloadAction<{
            todolistID: string,
            filter: FilterValuesType
        }>) => {
            const todo = state.find(tl => tl.id === action.payload.todolistID);
            if (todo) todo.filter = action.payload.filter;
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{
            todolistID: string,
            entityStatus: RequestStatusType
        }>) => {
            const todo = state.find(tl => tl.id === action.payload.todolistID);
            if (todo) todo.entityStatus = action.payload.entityStatus;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(todosThunks.fetchTodos.fulfilled, (state, action) => {
                return action.payload.todos.map(t => ({...t, filter: "all", entityStatus: "idle"}));
            })
            .addCase(todosThunks.addTodo.fulfilled, (state, action) => {
                state.unshift({
                    ...action.payload.todolist,
                    filter: "all",
                    entityStatus: "idle",
                });
            })
            .addCase(todosThunks.deleteTodo.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todolistID);
                if (index !== -1) state.splice(index, 1);
            })
            .addCase(todosThunks.changeTodoTitle.fulfilled, (state, action) => {
                const todo = state.find(tl => tl.id === action.payload.todolistID);
                if (todo) todo.title = action.payload.title;
            })
            .addCase(clearTodosTasks.type, () => {
                return []
            })
    }
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todosThunks = {fetchTodos, addTodo, deleteTodo, changeTodoTitle}


// types
export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}