import {
    GOOGLE_API,
    FROM_WAYPOINT,
    TO_WAYPOINT,
    ADD_WAYPOINT
} from "./actionTypes";

export function googleApi(google) {
    return {
        type: GOOGLE_API,
        google
    };
}
export function fromWaypoint(waypoint) {
    return{
        type: FROM_WAYPOINT,
        waypoint
    }
}
export function toWaypoint(waypoint) {
    return{
        type: TO_WAYPOINT,
        waypoint
    }
}
export function addWaypoint(waypoint) {
    return{
        type: ADD_WAYPOINT,
        waypoint
    }
}