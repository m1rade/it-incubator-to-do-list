import { RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTodosTasks } from "common/actions";
import { ChangeTodoTitleArgsType, todolistAPI, TodolistType } from "features/TodoListsPage/TodoList/todolistsAPI";
import { ResultCodes } from "common/enums";
import { createAppAsyncThunk } from "common/hooks";

const fetchTodos = createAppAsyncThunk<{ todos: TodolistType[] }, void>("todos/fetchTodos",
    async () => {
        const resp = await todolistAPI.getTodolists();
        return { todos: resp.data };
    });

const addTodo = createAppAsyncThunk<{ todolist: TodolistType }, string>("todos/addTodo",
    async (title, thunkAPI) => {
        const resp = await todolistAPI.createTodolist(title);

        if (resp.data.resultCode === ResultCodes.OK) {
            return { todolist: resp.data.data.item };
        } else {
            return thunkAPI.rejectWithValue({ data: resp.data, isShowError: true });
        }
    });

const deleteTodo = createAppAsyncThunk<{ todolistID: string }, string>(
    "todos/deleteTodo",
    async (todolistID, thunkAPI) => {
        // TODO 500 error when deleting todolist
        const resp = await todolistAPI.deleteTodolist(todolistID);

        thunkAPI.dispatch(todolistsActions.changeTodolistEntityStatus({
            todolistID,
            entityStatus: "loading",
        }));

        if (resp.data.resultCode === ResultCodes.OK) {
            return { todolistID };
        } else {
            return thunkAPI.rejectWithValue({ data: resp.data, isShowError: true });
        }

    },
);

const changeTodoTitle = createAppAsyncThunk<ChangeTodoTitleArgsType, ChangeTodoTitleArgsType>(
    "todos/changeTodoTitle",
    async (args, thunkAPI) => {
        const resp = await todolistAPI.changeTodolistTitle({ ...args });

        thunkAPI.dispatch(todolistsActions.changeTodolistEntityStatus({
            todolistID: args.todolistID,
            entityStatus: "loading",
        }));

        if (resp.data.resultCode === ResultCodes.OK) {
            return { ...args };
        } else {
            thunkAPI.dispatch(todolistsActions.changeTodolistEntityStatus({
                todolistID: args.todolistID,
                entityStatus: "failed",
            }));

            return thunkAPI.rejectWithValue({ data: resp.data, isShowError: true });
        }
    },
);

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        changeTodolistFilter: (
            state,
            action: PayloadAction<{
                todolistID: string;
                filter: FilterValuesType;
            }>,
        ) => {
            const todo = state.find(tl => tl.id === action.payload.todolistID);
            if (todo) todo.filter = action.payload.filter;
        },
        changeTodolistEntityStatus: (
            state,
            action: PayloadAction<{
                todolistID: string;
                entityStatus: RequestStatusType;
            }>,
        ) => {
            const todo = state.find(tl => tl.id === action.payload.todolistID);
            if (todo) todo.entityStatus = action.payload.entityStatus;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(todosThunks.fetchTodos.fulfilled, (state, action) => {
                return action.payload.todos.map(t => ({ ...t, filter: "all", entityStatus: "idle" }));
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
                if (todo) {
                    todo.title = action.payload.title;
                    todo.entityStatus = "succeeded";
                }
            })
            .addCase(clearTodosTasks.type, () => {
                return [];
            });
    },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todosThunks = { fetchTodos, addTodo, deleteTodo, changeTodoTitle };

// types
export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
};
