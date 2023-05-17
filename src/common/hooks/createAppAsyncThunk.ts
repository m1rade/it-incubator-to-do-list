import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, AppRootStateType } from "app/store";
import { ServerResponseType } from "common/types";

/**
 * This function reduces repetition of code that sets up createAsyncThunk types when thunks is created
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType;
    dispatch: AppDispatch;
    rejectValue: null | RejectedWithValueType;
}>();

export type RejectedWithValueType = {
    data: ServerResponseType
    isShowError: boolean
}