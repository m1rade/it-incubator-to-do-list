import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { AppDispatch, AppRootStateType } from "app/store";
import { ServerResponseType } from "common/types";
import { todolistsActions } from "features/TodoListsPage/TodoList/todolists-reducer";
import { tasksActions } from "features/TodoListsPage/TodoList/Tasks/Task/tasks-reducer";
import { handleServerNetworkError } from "common/utils";

/**
 * The function helps to eliminate repetitive code in Redux thunks such as the setting of app or entity statuses and error handling
 * @param thunkAPI - is an object containing references to the dispatch and extra arguments from the thunk middleware as well as a utility function called rejectWithValue
 * @param logic - a function that will be wrapped
 * @param todolistID [optional] - is needed to change entity status in the state
 * @param taskID [optional] - is needed to change entity status in the state
 */
export const thunkTryCatch = async (
    thunkAPI: BaseThunkAPI<AppRootStateType, any, AppDispatch, null | ServerResponseType>,
    logic: Function,
    todolistID?: string,
    taskID?: string
) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    // dispatch(appActions.setAppStatus({ status: "loading" }));

    todolistID && dispatch(todolistsActions.changeTodolistEntityStatus({ todolistID, entityStatus: "loading" }));

    todolistID &&
        taskID &&
        dispatch(
            tasksActions.changeTaskEntityStatus({
                todolistID,
                taskID,
                entityStatus: "loading",
            })
        );

    try {
        return await logic();
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
    } finally {
        // dispatch(appActions.setAppStatus({ status: "idle" }));

        todolistID && dispatch(todolistsActions.changeTodolistEntityStatus({ todolistID, entityStatus: "idle" }));

        todolistID &&
            taskID &&
            dispatch(
                tasksActions.changeTaskEntityStatus({
                    todolistID,
                    taskID,
                    entityStatus: "idle",
                })
            );
    }
};
