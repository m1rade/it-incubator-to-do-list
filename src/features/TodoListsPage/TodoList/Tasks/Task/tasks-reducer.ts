import { todosThunks } from "features/TodoListsPage/TodoList/todolists-reducer";
import { appActions, RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleServerAppError, thunkTryCatch } from "common/utils";
import { clearTodosTasks } from "common/actions";
import { createAppAsyncThunk } from "common/hooks";
import {
    CreateTaskArgsType,
    DeleteTaskArgsType,
    TaskType,
    todolistAPI,
    UpdateTaskArgsType,
} from "features/TodoListsPage/TodoList/todolistsAPI";
import { ResultCodes } from "common/enums";

const fetchTasks = createAppAsyncThunk<{ todolistID: string; tasks: TaskType[] }, string>(
    "tasks/fetchTasks",
    async (todolistID, thunkAPI) => {
        return thunkTryCatch(thunkAPI, async () => {
            const resp = await todolistAPI.getTasks(todolistID);

            return { todolistID, tasks: resp.data.items };
        });
    }
);

const addTask = createAppAsyncThunk<{ todolistID: string; task: TaskType }, CreateTaskArgsType>(
    "tasks/addTask",
    async (args, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        return thunkTryCatch(thunkAPI, async () => {
            const resp = await todolistAPI.createTask({ todolistID: args.todolistID, title: args.title });

            if (resp.data.resultCode === ResultCodes.OK) {
                return { todolistID: args.todolistID, task: resp.data.data.item };
            } else {
                handleServerAppError(resp.data, dispatch);
                return rejectWithValue(resp.data);
            }
        });
    }
);

const updateTask = createAppAsyncThunk<UpdateTaskArgsType, UpdateTaskArgsType>(
    "tasks/updateTask",
    async (args, thunkAPI) => {
        const { dispatch, rejectWithValue, getState } = thunkAPI;

        const task = getState().tasks[args.todolistID].find(t => t.id === args.taskID);

        if (task) {
            return thunkTryCatch(
                thunkAPI,
                async () => {
                    const resp = await todolistAPI.updateTask(args.todolistID, args.taskID, {
                        ...task,
                        ...args.taskModel,
                    });
                    if (resp.data.resultCode === ResultCodes.OK) {
                        return args;
                    } else {
                        handleServerAppError(resp.data, dispatch);
                        return rejectWithValue(null);
                    }
                },
                args.todolistID,
                args.taskID
            );
        } else {
            dispatch(appActions.setAppError({ error: "A task not found" }));
            return rejectWithValue(null);
        }
    }
);

const deleteTask = createAppAsyncThunk<DeleteTaskArgsType, DeleteTaskArgsType>(
    "tasks/deleteTask",
    async (args, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        return thunkTryCatch(thunkAPI, async () => {
            const resp = await todolistAPI.deleteTask(args);

            if (resp.data.resultCode === ResultCodes.OK) {
                return args;
            } else {
                handleServerAppError(resp.data, dispatch);
                return rejectWithValue(null);
            }
        });
    }
);

const initialState: TasksStateType = {};

const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        changeTaskEntityStatus: (
            state,
            action: PayloadAction<{
                todolistID: string;
                taskID: string;
                entityStatus: RequestStatusType;
            }>
        ) => {
            const tasks = state[action.payload.todolistID];
            const index = tasks.findIndex(t => t.id === action.payload.taskID);
            if (index !== -1) tasks[index].entityStatus = action.payload.entityStatus;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistID] = action.payload.tasks.map(t => ({
                    ...t,
                    entityStatus: "idle",
                }));
            })
            .addCase(addTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistID];
                tasks.push({ ...action.payload.task, entityStatus: "idle" });
            })
            .addCase(tasksThunks.updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistID];
                const index = tasks.findIndex(t => t.id === action.payload.taskID);
                if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.taskModel };
            })
            .addCase(tasksThunks.deleteTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistID];
                const index = tasks.findIndex(t => t.id === action.payload.taskID);
                if (index !== -1) tasks.splice(index, 1);
            })
            .addCase(todosThunks.addTodo.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = [];
            })
            .addCase(todosThunks.deleteTodo.fulfilled, (state, action) => {
                delete state[action.payload.todolistID];
            })
            .addCase(todosThunks.fetchTodos.fulfilled, (state, action) => {
                action.payload.todos.forEach(tl => {
                    state[tl.id] = [];
                });
            })
            .addCase(clearTodosTasks, () => {
                return {};
            });
    },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { fetchTasks, addTask, updateTask, deleteTask };

// types
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType;
};

export type TasksStateType = {
    [key: string]: TaskDomainType[];
};
