import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LoadingStatus, RejectedError } from "./main";
import { PostImages } from "@modules/validations/post.vd";
import { YvesFile } from "@modules/utils/const";
import blobToBase64 from "@modules/utils/blob";

export const POST_IMAGES_FEATURE_KEY = "post_images";

export interface PostImagesEntity extends PostImages {}
export interface PostImagesState {
    images: PostImagesEntity | null;
    loadingStatus: LoadingStatus;
    error?: RejectedError | null;
}

const initialState: PostImagesState = {
    images: {
        main: "",
        second: "",
        third: "",
        fourth: "",
        fifth: ""
    },
    loadingStatus: LoadingStatus.NotLoaded,
    error: null,
};

const postImagesSlice = createSlice({
    name: POST_IMAGES_FEATURE_KEY,
    initialState,
    reducers: {
        change: (state, action: PayloadAction<{ image: YvesFile; name: string }>) => {
            const { image, name } = action.payload;

            if (image && state.images) {
                if (typeof image !== "string") {
                    const blob = image instanceof Blob ? image : new Blob([image]);
                    blobToBase64(blob).then((base64) => {
                        state.images[name] = base64;
                    });
                } else {
                    state.images[name] = image;
                }
            }
        },
        reset: (state, action: PayloadAction<{name: string}>) => {
            if (state.images) {
                state.images[action.payload.name] = "";
            }
        } 
    },
});

export const postImagesReducer = postImagesSlice.reducer;
export const postImagesActions = postImagesSlice.actions;
