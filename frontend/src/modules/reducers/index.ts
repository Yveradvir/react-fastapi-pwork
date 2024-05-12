import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { PROFILE_FEATURE_KEY, profileReducer } from "./profile.slice";
import { POST_IMAGES_FEATURE_KEY, postImagesReducer } from "./post_images.slice";
import { POSTS_FEATURE_KEY, postsReducer } from "./posts.slice";
import { GROUPS_FEATURE_KEY, groupsReducer } from "./groups.slice";
import { FILTER_FEATURE_KEY, filterReducer } from "./filter.slice";

export const store = configureStore({
    reducer: {
        [PROFILE_FEATURE_KEY]: profileReducer,
        [POST_IMAGES_FEATURE_KEY]: postImagesReducer,
        [POSTS_FEATURE_KEY]: postsReducer,
        [GROUPS_FEATURE_KEY]: groupsReducer,
        [FILTER_FEATURE_KEY]: filterReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: import.meta.env.DEV
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()