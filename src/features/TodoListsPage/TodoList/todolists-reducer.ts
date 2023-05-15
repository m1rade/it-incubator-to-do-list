import {RequestStatusType,} from "app/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, thunkTryCatch} from "common/utils";
import {clearTodosTasks} from "common/actions";
import {ChangeTodoTitleArgsType, todolistAPI, TodolistType} from "features/TodoListsPage/TodoList/todolistsAPI";
import {ResultCodes} from "common/enums";
import {createAppAsyncThunk} from "common/hooks";


const fetchTodos = createAppAsyncThunk<{ todos: TodolistType[] }, void>("todos/fetchTodos",
    async (_, thunkAPI) => {
        return thunkTryCatch(thunkAPI, async () => {
            const resp = await todolistAPI.getTodolists();
            return {todos: resp.data}
        });
    });

const addTodo = createAppAsyncThunk<{ todolist: TodolistType }, string>("todos/addTodo",
    async (title, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;

        return thunkTryCatch(thunkAPI, async () => {
            const resp = await todolistAPI.createTodolist(title);

            if (resp.data.resultCode === ResultCodes.OK) {
                return {todolist: resp.data.data.item}
            } else {
                handleServerAppError(resp.data, dispatch);
                return rejectWithValue(null);
            }
        });
    });


const deleteTodo = createAppAsyncThunk<{ todolistID: string }, string>("todo/deleteTodo",
    async (todolistID, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        // TODO 500 error when deleting todolist
        return thunkTryCatch(thunkAPI, async () => {
            const resp = await todolistAPI.deleteTodolist(todolistID);

            if (resp.data.resultCode === ResultCodes.OK) {
                return {todolistID}
            } else {
                handleServerAppError(resp.data, dispatch);
                return rejectWithValue(null);
            }
        }, todolistID);
    });

const changeTodoTitle = createAppAsyncThunk<ChangeTodoTitleArgsType, ChangeTodoTitleArgsType>("todo/changeTodoTitle",
    async (args, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;

        return thunkTryCatch(thunkAPI, async () => {
            const resp = await todolistAPI.changeTodolistTitle({...args});

            if (resp.data.resultCode === ResultCodes.OK) {
                return {...args}
            } else {
                handleServerAppError(resp.data, dispatch);
                return rejectWithValue(null);
            }
        }, args.todolistID);
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