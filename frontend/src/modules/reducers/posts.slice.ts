import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    EntityId,
    EntityState,
    PayloadAction,
} from "@reduxjs/toolkit";
import { InitialMixin, LoadingStatus, ReduxRejfullTools, RejectedError } from "./main";

export const POSTS_FEATURE_KEY = "posts";

export interface PostEntity extends InitialMixin {
    id: string;
}

export interface PostsState extends EntityState<PostEntity, EntityId> {
    loadingStatus: LoadingStatus;
    error?: RejectedError | null;
    ids: EntityId[];
}

export const postsAdapter = createEntityAdapter<PostEntity>({
    selectId: (group: PostEntity) => group.id,
});

export const fetchPosts = createAsyncThunk<PostEntity[]>(
    "posts/fetchStatus",
    async (_, thunkAPI) => {
        try {
            const data: PostEntity[] = [];
            
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(ReduxRejfullTools.standartAxiosReject(error))
        }
    }
);

export const initialPostsState: PostsState = postsAdapter.getInitialState({
    loadingStatus: LoadingStatus.NotLoaded,
    error: null,
});

export const postsSlice = createSlice({
    name: POSTS_FEATURE_KEY,
    initialState: initialPostsState,
    reducers: {
        addOne: postsAdapter.addOne,
        removeOne: postsAdapter.removeOne,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state: PostsState) => {
                state.loadingStatus = LoadingStatus.Loading;
            })
            .addCase(
                fetchPosts.fulfilled,
                (state: PostsState, action: PayloadAction<PostEntity[]>) => {
                    postsAdapter.setAll(state, action.payload);
                    state.loadingStatus = LoadingStatus.Loaded;
                }
            )
            .addCase(fetchPosts.rejected, (state: PostsState, action) => {
                state.loadingStatus = LoadingStatus.Error;
                state.error = action.payload as RejectedError;
            });
    },
});

export const postsReducer = postsSlice.reducer;
export const postsActions = postsSlice.actions;

const { selectAll } = postsAdapter.getSelectors();

export const selectAllPosts = selectAll;
