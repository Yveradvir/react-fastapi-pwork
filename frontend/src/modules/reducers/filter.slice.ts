import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RejectedError } from "./main";

export const FILTER_FEATURE_KEY = "filter";

export enum FilterTypes {
    new = "new",
    old = "old",
    title = "title"
}

export enum ActiveTypes {
    all = "all",
    active = "active",
    inactive = "inactive"
}

export interface FilterEntity {
    f?: string | null;
    active?: ActiveTypes | null;
    ft: FilterTypes;
}

export interface FilterState {
    filter: FilterEntity;
    error?: RejectedError | null;
}

const initialState: FilterState = {
    filter: {
        active: ActiveTypes.all,
        ft: FilterTypes.new,
        f: ""
    },
    error: null
};

export const filterSlice = createSlice({
    name: FILTER_FEATURE_KEY,
    initialState,
    reducers: {
        reset: () => initialState,
        change: (
            state: FilterState, 
            action: PayloadAction<FilterEntity>
        ) => {
            return {
                ...state,
                filter: action.payload
            };
        }
    }
});

export const filterReducer = filterSlice.reducer;
export const filterActions = filterSlice.actions;