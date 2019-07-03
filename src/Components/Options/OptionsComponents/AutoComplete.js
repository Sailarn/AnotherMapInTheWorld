import React, {Component} from "react";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import {MDBInput} from "mdbreact";
import {
    setAddresses,
    setMarkers,
    setPolyline,
    setValueFrom,
    setWaypoints
} from "../../../store/actions/mapAction";
import {connect} from "react-redux";
import {dismissAll, notify} from "./ToastFunctions";
/* global google */
class AutoComplete extends Component {

    setPoint = (latLng, address) => {
        this.props.google.setCenter(latLng);
        let waypoints = this.props.waypoints;
        let polyline = this.props.polyline;
        let markers = this.props.markers;
        if (waypoints.length > 1) {
            polyline.setMap(null);
        }
        waypoints.push(latLng);
        let marker = new google.maps.Marker({
            position: latLng,
            map: this.props.google,
            draggable: true,
            animation: google.maps.Animation.DROP
        });
        markers.push(marker);
        polyline = new google.maps.Polyline({
            path: waypoints,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        polyline.setMap(this.props.google);
        this.props.setWaypoints(waypoints);
        this.props.setPolyline(polyline);
        this.props.setMarkers(markers);
        let infowindow = new google.maps.InfoWindow({
            content: address
        });
        marker.addListener('click', () => {
            infowindow.open(this.props.google, marker);
        });
        google.maps.event.addListener(marker, 'dragend', () => {
            this.getNewAddress(marker, marker.getPosition());
            setTimeout(() => {
                infowindow.setContent(this.state.tempAddress);
            }, 500);
        });
    };
    getNewAddress = (marker, pos) => {
        dismissAll();
        let polyline = this.props.polyline;
        polyline.setMap(null);
        this.props.setPolyline(polyline);
        let markers = this.props.markers;
        let waypoints = this.props.waypoints;
        let addresses = this.props.addresses;
        let localPosition;
        for (const [index, value] of markers.entries()) {
            if (marker === value) {
                localPosition = index;
            }
        }
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({latLng: pos}, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    addresses[localPosition] = results[0].formatted_address;
                    let localLatLng = {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    };
                    markers[localPosition] = marker;
                    waypoints[localPosition] = localLatLng;
                    this.props.setMarkers(markers);
                    this.props.setAddresses(addresses);
                    this.props.setWaypoints(waypoints);
                    this.setState({
                        tempAddress: results[0].formatted_address
                    })
                } else {
                    notify('pointError');
                    markers[localPosition].setPosition(waypoints[localPosition]);
                    this.props.setMarkers(markers);
                }
            }
        );
        setTimeout(() => {
            this.recreatePoly();
        }, 500);
    };
    setMarker = (latLng, address) => {
        if (latLng) {
            notify('pointCreated');
            this.setPoint(latLng, address)
        } else {
            notify('placeError');
        }
    };
    handleSelect = address => {
        dismissAll();
        let addresses = this.props.addresses;
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                addresses.push(address);
                this.props.setValueFrom('');
                this.props.setAddresses(addresses);
                this.setMarker(latLng, address);
            })
            .catch(() => {
                this.setMarker();
            });
    };
    onError = (status, clearSuggestions) => {
        dismissAll();
        notify('noResults');
        clearSuggestions();
    };
    recreatePoly = () => {
        let waypoints = this.props.waypoints;
        let polyline = new google.maps.Polyline({
            path: waypoints,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        polyline.setMap(this.props.google);
        this.props.setWaypoints(waypoints);
        this.props.setPolyline(polyline);
    };

    render() {
        return (
            <PlacesAutocomplete
                value={this.props.valueFrom}
                onChange={valueFrom => this.props.setValueFrom(valueFrom)}
                onSelect={this.handleSelect}
                onError={this.onError}
            >
                {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                    <div>
                        <MDBInput
                            hint="Add waypoint"
                            id="from_value"
                            name="valueFrom"
                            {...getInputProps({
                                placeholder: 'Search Places ...',
                                className: 'location-search-input',
                            })}
                        />
                        <div className="autocomplete-dropdown-container">
                            {loading && <div className="spinner-grow text-info" role="status"></div>}
                            {suggestions.map(suggestion => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                const style = suggestion.active
                                    ? {backgroundColor: '#fafafa', cursor: 'pointer'}
                                    : {backgroundColor: '#ffffff', cursor: 'pointer'};
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setWaypoints: data => dispatch(setWaypoints(data)),
        setAddresses: data => dispatch(setAddresses(data)),
        setMarkers: data => dispatch(setMarkers(data)),
        setPolyline: data => dispatch(setPolyline(data)),
        setValueFrom: data => dispatch(setValueFrom(data))
    };
}

function mapStateToProps(state) {
    return {
        google: state.map.google,
        waypoints: state.map.waypoints,
        polyline: state.map.polyline,
        markers: state.map.markers,
        addresses: state.map.addresses,
        valueFrom: state.map.valueFrom
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps)(AutoComplete);
