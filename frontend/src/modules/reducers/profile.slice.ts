import { LaunchedAxios } from "@modules/api/api";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { LoadingStatus } from "./loadstatus";

export const PROFILE_FEATURE_KEY = "profile";

export interface ProfileEntity {
    id: string
    first_name: string
    last_name: string
    birth: string
    username: string
    email: string
    created_at: string
    updated_at: string
    profile_b64?: string;
}

export interface CurrentProfileState {
    profile: ProfileEntity | null;
    loadingStatus: LoadingStatus;
    error?: string | null;
}

export const getProfile = createAsyncThunk<ProfileEntity>(
    "profile/get",
    async (_, thunkAPI) => {
        try {
            const response = await LaunchedAxios.get("/profile/my");

            if (response.data.ok) {
                return response.data.subdata as ProfileEntity 
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

export const getProfileImage = createAsyncThunk<string, string>(
    "profile/image",
    async (uid, thunkAPI) => {
        try {
            const response = await LaunchedAxios.get(`/profile/signle/${uid}/image`);
    
            if (response.data.ok) {
                return response.data.subdata.result as string 
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
)

const csrfSlice = createSlice({
    name: PROFILE_FEATURE_KEY,
    initialState: {
        profile: null,
        loadingStatus: LoadingStatus.NotLoaded,
        error: null,
    } as CurrentProfileState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProfile.pending, (state: CurrentProfileState) => {
                state.loadingStatus = LoadingStatus.Loading;
            })
            .addCase(
                getProfile.fulfilled,
                (
                    state: CurrentProfileState,
                    action: PayloadAction<ProfileEntity>
                ) => {
                    state.profile = action.payload;
                    state.loadingStatus = LoadingStatus.Loaded;
                }
            )
            .addCase(getProfile.rejected, (state: CurrentProfileState, action) => {
                state.loadingStatus = LoadingStatus.Error;
                state.error = action.error.message;
            })
            .addCase(
                getProfileImage.fulfilled,
                (
                    state: CurrentProfileState,
                    action: PayloadAction<string>
                ) => {
                    if (state.profile) {
                        state.profile.profile_b64 = action.payload;
                    }
                }
            )
            .addCase(getProfileImage.rejected, (state: CurrentProfileState, action) => {
                state.loadingStatus = LoadingStatus.Error;
                state.error = action.error.message;
            });
    },
});

export const profileReducer = csrfSlice.reducer;
export const profileActions = csrfSlice.actions;