import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    EntityId,
    EntityState,
    PayloadAction,
} from "@reduxjs/toolkit";
import {
    InitialMixin,
    LoadingStatus,
    ReduxRejfullTools,
    RejectedError,
} from "./main";
import { LaunchedAxios } from "@modules/api/api";
import { store } from ".";

export const GROUPS_FEATURE_KEY = "groups";

export interface GroupEntity extends InitialMixin {
    id: EntityId;
    title: string;
    content: string;
    author_id: string;
}

export interface GroupsState extends EntityState<GroupEntity, EntityId> {
    loadingStatus: LoadingStatus;
    totalCount: number;
    error?: RejectedError | null;
    ids: EntityId[];
}

export const groupsAdapter = createEntityAdapter<GroupEntity>();

export const fetchCount = createAsyncThunk<number>(
    "groups/fetchCount",
    async (_, thunkAPI) => {
        try {
            const response = await LaunchedAxios.get("/group/count");
            return response.data.subdata.result;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                ReduxRejfullTools.standartAxiosReject(error)
            );
        }
    }
);

export const fetchGroups = createAsyncThunk<
    GroupEntity[],
    { isMine: boolean; page: number }
>("groups/fetchGroups", async ({ isMine, page }, thunkAPI) => {
    try {
        const filter = store.getState().filter.filter;
        const response = await LaunchedAxios.get("/group/", {
            params: {
                ...filter,
                page,
                isMine,
            },
        });
        return response.data.subdata;
    } catch (error) {
        return thunkAPI.rejectWithValue(
            ReduxRejfullTools.standartAxiosReject(error)
        );
    }
});

export const initialGroupsState: GroupsState = groupsAdapter.getInitialState({
    loadingStatus: LoadingStatus.NotLoaded,
    error: null,
    totalCount: 10,
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
                state.error = action.payload as RejectedError;
            })
            .addCase(
                fetchCount.fulfilled,
                (state: GroupsState, action) => {
                    state.totalCount = action.payload;
                }
            )
            .addCase(fetchCount.rejected, (state: GroupsState, action) => {
                state.loadingStatus = LoadingStatus.Error;
                state.error = action.payload as RejectedError;
            });
    },
});

export const groupsReducer = groupsSlice.reducer;
export const groupsActions = groupsSlice.actions;

const { selectAll } = groupsAdapter.getSelectors();
export const selectAllGroups = selectAll;
