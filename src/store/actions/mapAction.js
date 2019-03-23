import {
    GOOGLE_API
} from "./actionTypes";

export function googleApi(google) {
    return {
        type: GOOGLE_API,
        google
    };
}