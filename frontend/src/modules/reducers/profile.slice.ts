import { LaunchedAxios } from "@modules/api/api";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoadingStatus, ReduxRejfullTools, RejectedError } from "./main";

export const PROFILE_FEATURE_KEY = "profile";

export interface GroupsTitleId { title: string; uuid: string; }
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
    api_key: string;
}

export interface CurrentProfileState {
    profile: ProfileEntity | null;
    loadingStatus: LoadingStatus;
    profileImageStatus: LoadingStatus;
    error?: RejectedError | null;
    groups?: GroupsTitleId[] | null;
}

export const getProfile = createAsyncThunk<ProfileEntity>(
    "profile/get",
    async (_, thunkAPI) => {
        try {
            const response = await LaunchedAxios.get("/profile/my");

            if (response.data.ok) {
                return response.data.subdata as ProfileEntity 
            } else {
                return thunkAPI.rejectWithValue(ReduxRejfullTools.standartReject());
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(ReduxRejfullTools.standartAxiosReject(error));
        }
    }
);

export const getProfileImage = createAsyncThunk<string, string>(
    "profile/image",
    async (uid, thunkAPI) => {
        try {
            const response = await LaunchedAxios.get(`/profile/single/${uid}/image`);
    
            if (response.data.ok) {
                return response.data.subdata.result as string 
            } else {
                return thunkAPI.rejectWithValue(ReduxRejfullTools.standartReject());
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(ReduxRejfullTools.standartAxiosReject(error))
        }
    }
)

export const getProfileGroups = createAsyncThunk<GroupsTitleId[] | null, string>(
    "profile/groups",
    async (uid, thunkAPI) => {
        try {
            const response = await LaunchedAxios.get(`/profile/single/${uid}/groups`);
    
            if (response.data.ok) {
                const sdata = response.data.subdata;
                return sdata.lenght !== 0 
                    ? sdata as GroupsTitleId[]
                    : null
                 
            } else {
                return thunkAPI.rejectWithValue(ReduxRejfullTools.standartReject());
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(ReduxRejfullTools.standartAxiosReject(error))
        }
    }
)

const profileSlice = createSlice({
    name: PROFILE_FEATURE_KEY,
    initialState: {
        profile: null,
        groups: null,
        loadingStatus: LoadingStatus.ANotLoaded,
        profileImageStatus: LoadingStatus.ANotLoaded,
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
                    state.error = null;
                }
            )
            .addCase(getProfile.rejected, (state: CurrentProfileState, action) => {                
                state.loadingStatus = LoadingStatus.Error;
                state.error = action.payload as RejectedError;
            })
            .addCase(getProfileImage.pending, (state: CurrentProfileState) => {
                state.profileImageStatus = LoadingStatus.Loading;
            })
            .addCase(
                getProfileImage.fulfilled,
                (
                    state: CurrentProfileState,
                    action: PayloadAction<string>
                ) => {
                    if (state.profile) {
                        state.profile.profile_b64 = action.payload;
                        if (action.payload == null) {
                            state.profileImageStatus = LoadingStatus.NotLoaded;
                        } else { 
                            state.profileImageStatus = LoadingStatus.Loaded;
                        } 
                        state.error = null;
                    }
                }
            )
            .addCase(getProfileImage.rejected, (state: CurrentProfileState, action) => {
                state.profileImageStatus = LoadingStatus.Error;
                state.error = action.payload as RejectedError;
            })
            .addCase(
                getProfileGroups.fulfilled,
                (
                    state: CurrentProfileState,
                    action: PayloadAction<GroupsTitleId[] | null>
                ) => {
                    if (state.profile) {
                        state.groups = action.payload;
                        state.error = null;
                    }
                }
            )
            .addCase(getProfileGroups.rejected, (state: CurrentProfileState, action) => {
                state.error = action.payload as RejectedError;
            });
    },
});

export const profileReducer = profileSlice.reducer;
export const profileActions = profileSlice.actions;