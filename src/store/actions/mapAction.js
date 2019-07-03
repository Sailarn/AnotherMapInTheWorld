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
    ROUTES,
    VALUE_FROM,
    EDIT_MODE
} from "./actionTypes";

export function setEditeMode(mode) {
    return{
        type: EDIT_MODE,
        mode
    }
}

export function setValueFrom(value) {
    return{
        type: VALUE_FROM,
        value
    }
}

export function setRoutes(routes) {
    return {
        type: ROUTES,
        routes
    }
}

export function setTravelMode(mode) {
    return{
        type: TRAVEL_MODE,
        mode
    }
}
export function setAddressesCopy(addresses) {
    return{
        type: ADDRESSES_COPY,
        addresses
    }
}
export function setAddresses(addresses) {
    return{
        type: ADDRESSES,
        addresses
    }
}

export function setMarkers(markers) {
    return {
        type: MARKERS,
        markers
    }
}

export function setPolyline(poly) {
    return{
        type: POLYLINE,
        poly
    }
}

export function setWaypoints(waypoints) {
    return {
        type: WAYPOINTS,
        waypoints
    }
}

export function wrapperCss(css) {
    return {
        type: WRAPPER_CSS,
        css
    }
}

export function toggleOptions(css) {
    return {
        type: TOGGLE_OPTIONS_CSS,
        css
    }
}

export function googleApi(google) {
    return {
        type: GOOGLE_API,
        google
    };
}
