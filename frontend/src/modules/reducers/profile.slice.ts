import { LaunchedAxios } from "@modules/api/api";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoadingStatus, ReduxRejfullTools, RejectedError } from "./main";

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
    profileImageStatus: LoadingStatus;
    error?: RejectedError | null;
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
                return thunkAPI.rejectWithValue({
                    status_code: 500
                });
            }
        } catch (error) {
            return thunkAPI.rejectWithValue("Something went wrong")
        }
    }
)

export interface GroupsTitleId { title: string; uuid: string; }
export const getGroups = createAsyncThunk<List<GroupsTitleId>, string>(
    "profile/groups",
    async (uid, thunkAPI) => {
        try {
            const response = await LaunchedAxios.get(`/profile/single/${uid}/groups`);
    
            if (response.data.ok) {
                return response.data.subdata as GroupsNameUuid
            } else {
                return thunkAPI.rejectWithValue({
                    status_code: 500
                });
            }
        } catch (error) {
            return thunkAPI.rejectWithValue("Something went wrong")
        }
    }
)

const profileSlice = createSlice({
    name: PROFILE_FEATURE_KEY,
    initialState: {
        profile: null,
        loadingStatus: LoadingStatus.NotLoaded,
        profileImageStatus: LoadingStatus.NotLoaded,
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
            .addCase(getProfileImage.pending, (state: CurrentProfileState) => {
                state.profileImageStatus = LoadingStatus.Loading;
            })
            .addCase(getProfile.rejected, (state: CurrentProfileState, action) => {
                console.log(action);
                
                state.loadingStatus = LoadingStatus.Error;
                state.error = action.payload as RejectedError;
            })
            .addCase(
                getProfileImage.fulfilled,
                (
                    state: CurrentProfileState,
                    action: PayloadAction<string>
                ) => {
                    if (state.profile) {
                        state.profile.profile_b64 = action.payload;
                        state.profileImageStatus = LoadingStatus.Loaded;
                    }
                }
            )
            .addCase(getProfileImage.rejected, (state: CurrentProfileState, action) => {
                state.profileImageStatus = LoadingStatus.Error;
                state.error = action.payload as RejectedError;
            });
    },
});

export const profileReducer = profileSlice.reducer;
export const profileActions = profileSlice.actions;