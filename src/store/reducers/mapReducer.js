import {
    GOOGLE_API,
    TOGGLE_OPTIONS_CSS,
    WRAPPER_CSS,
    WAYPOINTS,
    POLYLINE,
    MARKERS,
    ADDRESSES,
    ADDRESSES_COPY,
    TRAVEL_MODE,
    ROUTES, VALUE_FROM, EDIT_MODE
} from "../actions/actionTypes";

const initialState = {
    google: '',
    waypoints: [],
    polyline: [],
    markers: [],
    addresses: [],
    editMode: true,
    valueFrom: '',
    routes: [],
    tempAddress: '',
    addressesCopy: [],
    toggleOptionsCss: 'd-none',
    wrapperCss: 'settings-wrapper z0',
    travelMode: '',
    travelModeDefault: false
};
export default function mapReducer(state = initialState, action) {
    switch (action.type) {
        case EDIT_MODE:
            return{
                ...state,
                editMode: action.mode
            };
        case VALUE_FROM:
            return {
                ...state,
                valueFrom: action.value
            };
        case ROUTES:
            return {
                ...state,
                routes: action.routes
            };
        case TRAVEL_MODE:
            return {
                ...state,
                travelMode: action.mode
            };
        case POLYLINE:
            return {
                ...state,
                polyline: action.poly
            };
        case MARKERS:
            return {
                ...state,
                markers: action.markers
            };
        case ADDRESSES:
            return {
                ...state,
                addresses: action.addresses
            };
        case ADDRESSES_COPY:
            return {
                ...state,
                addressesCopy: action.addresses
            };
        case WAYPOINTS:
            return {
                ...state,
                waypoints: action.waypoints
            };
        case TOGGLE_OPTIONS_CSS:
            return {
                ...state,
                toggleOptionsCss: action.css
            };
        case WRAPPER_CSS:
            return {
                ...state,
                wrapperCss: action.css
            };
        case GOOGLE_API:
            return {
                ...state,
                google: action.google
            };
        default:
            return state;
    }
}
