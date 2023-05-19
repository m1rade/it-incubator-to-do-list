import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
};

export type AppInitialStateType = typeof initialState;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error;
        },
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status;
        },
        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized;
        },
    },
    extraReducers: builder => {
        builder
            .addMatcher(
                (action) => {
                    return action.type.endsWith("/pending");
                },
                (state) => {
                    state.status = "loading";
                })
            .addMatcher((action) => {
                    return action.type.endsWith("fulfilled");
                },
                (state) => {
                    state.status = "succeeded";
                })
            .addMatcher((action) => {
                    return action.type.endsWith("rejected");
                },
                (state, action) => {
                    // handle server errors that come with HTTP status code 200
                    if (action.payload) {
                        if (action.payload.isShowError) {
                            state.error = action.payload.data.messages.length ? action.payload.data.messages[0] : "Some error occurred";
                        }
                        state.status = "failed";
                    } else {
                        // handle errors with standard HTTP status codes
                        state.error = action.error.message.length ? action.error.message : "Some error occurred";
                        state.status = "failed";

                    }
                });
    },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
