import { AxiosResponse } from "axios";

export interface Additionals {
    loadUserProfile: boolean
}

export function yvesResponseOrNull(response: AxiosResponse): Additionals | null {
    const data = response.data;

    if (data) {
        const additionals = data.additionals;
        
        if (additionals) {
            return additionals as Additionals
        }
    } 

    return null
}
