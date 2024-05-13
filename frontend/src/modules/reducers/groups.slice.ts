import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    EntityState,
    PayloadAction,
} from "@reduxjs/toolkit";
import { InitialMixin, LoadingStatus, RejectedError } from "./main";
import { LaunchedAxios } from "@modules/api/api";

export const GROUPS_FEATURE_KEY = "groups";

export interface GroupEntity extends InitialMixin {
    id: string;
    title: string;
    content: string;
    author_id: string;
}

export interface GroupsState extends EntityState<GroupEntity, string> {
    loadingStatus: LoadingStatus;
    error?: RejectedError | null;
}

export const groupsAdapter = createEntityAdapter<GroupEntity>();
export const fetchGroups = createAsyncThunk<GroupEntity[], {isMine: boolean, page: number}>(
    "groups/fetchStatus",
    async ({isMine, page}, thunkAPI) => {
        try {
            return await LaunchedAxios.get("/group/", {
                params: {
                    ...thunkAPI.getState().filter.filter,
                    page, isMine
                }
            });
        } catch (error) {
            return thunkAPI.rejectWithValue("Something went wrong");
        }
    }
);

export const initialGroupsState: GroupsState = groupsAdapter.getInitialState({
    loadingStatus: LoadingStatus.NotLoaded,
    error: null,
});

export const groupsSlice = createSlice({
    name: GROUPS_FEATURE_KEY,
    initialState: initialGroupsState,
    reducers: {
        addOne: groupsAdapter.addOne,
        removeOne: groupsAdapter.removeOne,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroups.pending, (state: GroupsState) => {
                state.loadingStatus = LoadingStatus.Loading;
            })
            .addCase(
                fetchGroups.fulfilled,
                (state: GroupsState, action: PayloadAction<GroupEntity[]>) => {
                    groupsAdapter.setAll(state, action.payload);
                    state.loadingStatus = LoadingStatus.Loaded;
                }
            )
            .addCase(fetchGroups.rejected, (state: GroupsState, action) => {
                state.loadingStatus = LoadingStatus.Error;
                state.error = action.error as RejectedError;
            });
    },
});

export const groupsReducer = groupsSlice.reducer;
export const groupsActions = groupsSlice.actions;

const { selectAll } = groupsAdapter.getSelectors();
export const selectAllGroups = selectAll;
