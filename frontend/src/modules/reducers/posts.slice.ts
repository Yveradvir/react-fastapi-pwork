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
import { store } from ".";
import { LaunchedAxios } from "@modules/api/api";
import { PostProps } from "@modules/validations/post.vd";

export const POSTS_FEATURE_KEY = "posts";

export interface PostEntity extends InitialMixin {
    id: EntityId;

    author_id: string;
    group_id: string;

    title: string;
    content: string;

    main: string | null;
    post_props: PostProps;
}

export interface PostsState extends EntityState<PostEntity, EntityId> {
    loadingStatus: LoadingStatus;
    error?: RejectedError | null;
    ids: EntityId[];
}

export const postsAdapter = createEntityAdapter<PostEntity>();
export const fetchPosts = createAsyncThunk<PostEntity[], number>(
    "posts/fetchStatus",
    async (page, thunkAPI) => {
        try {
            const filter = store.getState().filter.filter;
            const response = await LaunchedAxios.get("/group/", {
                params: {
                    ...filter,
                    page,
                },
            });
            return response.data.subdata;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                ReduxRejfullTools.standartAxiosReject(error)
            );
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
