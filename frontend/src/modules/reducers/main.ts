import { AxiosError } from "axios";

export enum LoadingStatus {
    NotLoaded = "not loaded",
    Loading = "loading",
    Loaded = "loaded",
    Error = "error"
}

export interface InitialMixin {
    created_at: string;
    updated_at: string;
}

export interface RejectedError {
    status_code: number;
    detail: string;
}

type WrongData = {
    detail?: string;
}

export class ReduxRejfullTools {        
    static standartReject(status_code: number = 500): RejectedError {
        return {
            status_code: status_code,
            detail: "Something went wrong..."
        }
    }

    static standartAxiosReject(error: AxiosError | unknown): RejectedError {
        if (error instanceof AxiosError) {
            if (error.response) {
                if (error.response.data) {
                    const data: WrongData = error.response.data;
                    if (typeof data.detail === 'string') {
                        return {
                            status_code: error.response.status,
                            detail: data.detail
                        }
                    }
                }
            }
            return this.standartReject(error.status)
        }

        return this.standartReject()
    }
}
