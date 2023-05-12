import {todolistsActions} from "features/TodoListsPage/TodoList/todolists-reducer";
import {appActions, RequestStatusType,} from "app/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "common/utils";
import {clearTodosTasks} from "common/actions";
import {createAppAsyncThunk} from "common/hooks";
import {
    CreateTaskArgsType,
    DeleteTaskArgsType,
    TaskType,
    todolistAPI,
    UpdateTaskArgsType
} from "features/TodoListsPage/TodoList/todolistsAPI";
import {ResultCodes} from "common/enums";


const fetchTasks = createAppAsyncThunk<{ todolistID: string, tasks: TaskType[] }, string>("tasks/fetchTasks",
    async (todolistID, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;

        dispatch(appActions.setAppStatus({status: "loading"}));

        try {
            const resp = await todolistAPI.getTasks(todolistID);

            dispatch(appActions.setAppStatus({status: "succeeded"}));

            return {todolistID, tasks: resp.data.items};
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    });

const addTask = createAppAsyncThunk<{ todolistID: string, task: TaskType }, CreateTaskArgsType>("tasks/addTask",
    async (args, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;

        dispatch(appActions.setAppStatus({status: "loading"}));
        dispatch(todolistsActions.changeTodolistEntityStatus({todolistID: args.todolistID, entityStatus: "loading"}));

        try {
            const resp = await todolistAPI.createTask({todolistID: args.todolistID, title: args.title});

            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(todolistsActions.changeTodolistEntityStatus({
                    todolistID: args.todolistID,
                    entityStatus: "succeeded"
                }));
                dispatch(appActions.setAppStatus({status: "succeeded"}));

                return {todolistID: args.todolistID, task: resp.data.data.item};
            } else {
                handleServerAppError(resp.data, dispatch, args.todolistID);
                return rejectWithValue(null);
            }

        } catch (e) {
            handleServerNetworkError(e, dispatch, args.todolistID);
            return rejectWithValue(null);
        }

    });

const updateTask = createAppAsyncThunk<UpdateTaskArgsType, UpdateTaskArgsType>("tasks/updateTask",
    async (args, thunkAPI) => {
        const {dispatch, rejectWithValue, getState} = thunkAPI;

        const task = getState().tasks[args.todolistID].find(t => t.id === args.taskID);

        if (task) {
            dispatch(appActions.setAppStatus({status: "loading"}));
            dispatch(tasksActions.changeTaskEntityStatus({
                todolistID: args.todolistID,
                taskID: args.taskID,
                entityStatus: "loading"
            }));

            try {
                const resp = await todolistAPI.updateTask(args.todolistID, args.taskID, {...task, ...args.taskModel});

                if (resp.data.resultCode === ResultCodes.OK) {
                    dispatch(tasksActions.changeTaskEntityStatus({
                        todolistID: args.todolistID,
                        taskID: args.taskID,
                        entityStatus: "succeeded"
                    }));
                    dispatch(appActions.setAppStatus({status: "succeeded"}));
                    return args;

                } else {
                    handleServerAppError(resp.data, dispatch, args.todolistID);
                    return rejectWithValue(null);
                }

            } catch (e) {
                handleServerNetworkError(e, dispatch, args.todolistID);
                return rejectWithValue(null);
            }
        } else {
            dispatch(appActions.setAppError({error: "A task not found"}));
            return rejectWithValue(null);
        }
    });

const deleteTask = createAppAsyncThunk<DeleteTaskArgsType, DeleteTaskArgsType>("tasks/deleteTask",
    async (args, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;

        dispatch(appActions.setAppStatus({status: "loading"}));
        dispatch(tasksActions.changeTaskEntityStatus({...args, entityStatus: "loading"}));

        try {
            const resp = await todolistAPI.deleteTask(args);

            if (resp.data.resultCode === ResultCodes.OK) {
                dispatch(appActions.setAppStatus({status: "succeeded"}));
                return args;

            } else {
                handleServerAppError(resp.data, dispatch);
                return rejectWithValue(null);
            }

        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    });


const initialState: TasksStateType = {};

const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        changeTaskEntityStatus: (state, action: PayloadAction<{
            todolistID: string,
            taskID: string,
            entityStatus: RequestStatusType
        }>) => {
            const tasks = state[action.payload.todolistID];
            const index = tasks.findIndex((t) => t.id === action.payload.taskID);
            if (index !== -1) tasks[index].entityStatus = action.payload.entityStatus;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistID] = action.payload.tasks.map(t => ({...t, entityStatus: "idle"}));
            })
            .addCase(addTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistID];
                tasks.push({...action.payload.task, entityStatus: "idle"});
            })
            .addCase(tasksThunks.updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistID];
                const index = tasks.findIndex((t) => t.id === action.payload.taskID);
                if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.taskModel};
            })
            .addCase(tasksThunks.deleteTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistID];
                const index = tasks.findIndex((t) =>
                    t.id === action.payload.taskID);
                if (index !== -1) tasks.splice(index, 1);
            })
            .addCase(todolistsActions.addTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.todolistID];
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
                action.payload.todos.forEach(tl => {
                    state[tl.id] = [];
                });
            })
            .addCase(clearTodosTasks, () => {
                return {}
            })
    }
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = {fetchTasks, addTask, updateTask, deleteTask};



// types
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}

export type TasksStateType = {
    [key: string]: TaskDomainType[],
};