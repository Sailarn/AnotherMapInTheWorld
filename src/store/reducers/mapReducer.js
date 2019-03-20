import {
    GOOGLE_API,
    FROM_WAYPOINT,
    TO_WAYPOINT,
    ADD_WAYPOINT
} from "../actions/actionTypes";

const initialState = {
    google: '',
    status: false,
    fromWaypoint: '',
    toWaypoint: '',
    addWaypoint: []
};
export default function mapReducer(state = initialState, action) {
    switch (action.type) {
        case GOOGLE_API:
            return {
                ...state,
                google: action.google
            };
        case FROM_WAYPOINT:
            return{
                ...state,
                fromWaypoint: action.waypoint
            };
        case TO_WAYPOINT:
            return{
                ...state,
                toWaypoint: action.waypoint
            };
        case ADD_WAYPOINT:
            return{
                ...state,
                addWaypoint: state.addWaypoint.push(action.waypoint)
            };
        default:
            return state;
    }
}