import axios from "axios";
import cookies from '../utils/cookies';
import { yvesResponseOrNull } from "./additionals.api";
import { store } from "@modules/reducers";
import { getProfile } from "@modules/reducers/profile.slice";

export const UnlaunchedAxios = axios.create({
    baseURL: import.meta.env.VITE_API, withCredentials: true
})

export const LaunchedAxios = axios.create({
    baseURL: import.meta.env.VITE_API, withCredentials: true
})

LaunchedAxios.interceptors.request.use(
    request => {
        if (import.meta.env.DEV) console.log("[ LaunchedAxios:request::use#fulfilled > ", request);
        
        const csrf = cookies.get("access_csrf")
        if (csrf) request.headers["X-CSRF-Token"] = csrf

        return request
    },
    async error => {
        if (import.meta.env.DEV) console.error("[ LaunchedAxi:request::use#rejected > ", error);
        return Promise.reject(error)
    }
);

LaunchedAxios.interceptors.response.use(
    async response => {
        if (import.meta.env.DEV) console.log("[ LaunchedAxios:response::use#fulfilled > ", response);

        const yvesponse = yvesResponseOrNull(response);
        if (yvesponse) {
            if (yvesponse.loadUserProfile) { 
                await store.dispatch(getProfile())
            }
        }
        
        return response
    },
    async error => {
        if (import.meta.env.DEV) console.error("[ LaunchedAxios:response::use#rejected > ", error);
        return Promise.reject(error)        
    }
);

export default {LaunchedAxios, UnlaunchedAxios}; 