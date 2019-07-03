import {
    toast
} from "mdbreact";
export function notify(type) {
    switch (type) {
        case 'pointCreated':
            toast.success('Waypoint created');
            break;
        case 'pointError':
            toast.error('Incorrect place to draw a line');
            break;
        case 'placeError':
            toast.error('Please select a place from the list');
            break;
        case 'routeCreated':
            toast.success('Route created');
            break;
        case 'routeError':
            toast.error('Its too far to create this route');
            break;
        case 'routeDelete':
            toast.warn('Route deleted');
            break;
        case 'noResults':
            toast.warn('No results for this request');
            break;
        default:
            break;
    }
}

export function dismissAll() {
    toast.dismiss()
}
