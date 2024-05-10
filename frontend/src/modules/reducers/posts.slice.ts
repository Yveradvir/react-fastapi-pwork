import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    EntityState,
    PayloadAction,
} from "@reduxjs/toolkit";
import { LoadingStatus, RejectedError } from "./main";

export const POSTS_FEATURE_KEY = "posts";

export interface PostsEntity {
    id: string;
}

export interface PostsState extends EntityState<PostsEntity, string> {
    loadingStatus: LoadingStatus;
    error?: RejectedError | null;
}

export const postsAdapter = createEntityAdapter<PostsEntity>();
export const fetchPosts = createAsyncThunk<PostsEntity[]>(
    "posts/fetchStatus",
    async (_, thunkAPI) => {
        try {
            const data: PostsEntity[] = [];
            
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue("Something went wrong")
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
                (state: PostsState, action: PayloadAction<PostsEntity[]>) => {
                    postsAdapter.setAll(state, action.payload);
                    state.loadingStatus = LoadingStatus.Loaded;
                }
            )
            .addCase(fetchPosts.rejected, (state: PostsState, action) => {
                state.loadingStatus = LoadingStatus.Error;
                state.error = action.error as RejectedError;
            });
    },
});

export const postsReducer = postsSlice.reducer;
export const postsActions = postsSlice.actions;

const { selectAll } = postsAdapter.getSelectors();

export const selectAllPosts = selectAll;
