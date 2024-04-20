import { LaunchedAxios } from "@modules/api/api";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const PROFILE_FEATURE_KEY = "profile";

export interface ProfileEntity {
    first_name: string
    last_name: string
    birth: string
    username: string
    email: string
}

export interface CurrentProfileState {
    profile: ProfileEntity | null;
    loadingStatus: "not loaded" | "loading" | "loaded" | "error";
    error?: string | null;
}

export const getProfile = createAsyncThunk<ProfileEntity>(
    "profile/get",
    async (_, thunkAPI) => {
        try {
            const response = await LaunchedAxios.get("/profile/my");

            if (response.data.ok) {
                return response.data.subdata as ProfileEntity; 
            } else {
                return thunkAPI.rejectWithValue("Response data not OK");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response){
                    return thunkAPI.rejectWithValue(error.response.data.detail);
                }
            }

            return thunkAPI.rejectWithValue("Something went wrong")
        }
    }
);

const csrfSlice = createSlice({
    name: PROFILE_FEATURE_KEY,
    initialState: {
        profile: null,
        loadingStatus: "not loaded",
        error: null,
    } as CurrentProfileState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProfile.pending, (state: CurrentProfileState) => {
                state.loadingStatus = "loading";
            })
            .addCase(
                getProfile.fulfilled,
                (
                    state: CurrentProfileState,
                    action: PayloadAction<ProfileEntity>
                ) => {
                    state.profile = action.payload;
                    state.loadingStatus = "loaded";
                }
            )
            .addCase(getProfile.rejected, (state: CurrentProfileState, action) => {
                state.loadingStatus = "error";
                state.error = action.error.message;
            });
    },
});

export const profileReducer = csrfSlice.reducer;
export const profileActions = csrfSlice.actions;
