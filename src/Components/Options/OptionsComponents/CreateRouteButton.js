import React, {Component} from "react";
import {MDBBtn} from "mdbreact";
import {connect} from "react-redux";
import {
    setAddresses,
    setAddressesCopy,
    setMarkers,
    setRoutes,
    setWaypoints
} from "../../../store/actions/mapAction";
import {dismissAll, notify} from "./ToastFunctions";
/* global google */

class CreateRouteButton extends Component {

    deleteAllMarkers = () => {
        this.props.polyline.setMap(null);
        let markers = this.props.markers;
        for (const item of markers) {
            item.setMap(null);
        }
        markers = [];
        this.props.setMarkers(markers);
        this.props.setAddresses([]);
    };
    createRoute = () => {
        dismissAll();
        if (this.props.waypoints.length < 2) {
            return;
        }
        let address = this.props.addresses;
        let addressesCopy = this.props.addressesCopy;
        addressesCopy.push({from: address[0], to: address[address.length - 1]});
        let request;
        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setOptions({suppressMarkers: false});
        directionsDisplay.setMap(this.props.google);
        if (this.props.waypoints.length > 2) {
            let waypts = this.props.waypoints;
            let waypoints = [];
            for (let item of waypts) {
                waypoints.push({location: item, stopover: true});
            }
            waypoints.splice(0, 1);
            waypoints.splice(waypoints.length - 1, 1);
            request = {
                origin: new google.maps.LatLng(this.props.waypoints[0]),
                destination: new google.maps.LatLng(this.props.waypoints[this.props.waypoints.length - 1]),
                waypoints: waypoints,
                optimizeWaypoints: false,
                travelMode: this.props.travelMode
            };
        } else {
            request = {
                origin: new google.maps.LatLng(this.props.waypoints[0]),
                destination: new google.maps.LatLng(this.props.waypoints[this.props.waypoints.length - 1]),
                optimizeWaypoints: false,
                travelMode: this.props.travelMode
            };
        }
        directionsService.route(request, (response, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
                this.deleteAllMarkers();
                directionsDisplay.setDirections(response);
                notify('routeCreated');
                directionsDisplay.setMap(this.props.google);
                let routes = this.props.routes;
                routes.push(directionsDisplay);
                this.props.setWaypoints([]);
                this.props.setRoutes(routes);
                this.props.setAddressesCopy(addressesCopy);
            } else {
                notify('routeError');
            }
        });

    };

    render() {
        return (
            <MDBBtn size="sm" onClick={this.createRoute}>Create Route</MDBBtn>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setWaypoints: data => dispatch(setWaypoints(data)),
        setAddresses: data => dispatch(setAddresses(data)),
        setMarkers: data => dispatch(setMarkers(data)),
        setAddressesCopy: data => dispatch(setAddressesCopy(data)),
        setRoutes: data => dispatch(setRoutes(data))
    };
}

function mapStateToProps(state) {
    return {
        google: state.map.google,
        waypoints: state.map.waypoints,
        polyline: state.map.polyline,
        markers: state.map.markers,
        addresses: state.map.addresses,
        addressesCopy: state.map.addressesCopy,
        travelMode: state.map.travelMode,
        routes: state.map.routes
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps)(CreateRouteButton);
