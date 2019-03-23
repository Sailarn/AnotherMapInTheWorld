import {
    GOOGLE_API
} from "../actions/actionTypes";

const initialState = {
    google: ''
};
export default function mapReducer(state = initialState, action) {
    switch (action.type) {
        case GOOGLE_API:
            return {
                ...state,
                google: action.google
            };
        default:
            return state;
    }
}