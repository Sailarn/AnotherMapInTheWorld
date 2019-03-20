import React, {Component} from 'react';
import './App.css';
import GoogleMap from './Components/Map/Map'
import {
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavItem,
    MDBNavbarToggler,
    MDBCollapse,
    MDBBtn,
    MDBRow,
    MDBContainer,
    MDBInput,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCol,
    MDBListGroup, MDBListGroupItem
} from "mdbreact";
import {fromWaypoint} from "./store/actions/mapAction";
import {connect} from "react-redux";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

/* global google */
class App extends Component {
    state = {
        isOpen: false,
        valueFrom: '',
        fromLatLng: '',
        waypoints: [],
        polyline: [],
        markers: [],
        addresses: []
    };

    componentDidUpdate() {

    }

    setPoint = (latLng, address) => {

        // var infowindow = new google.maps.InfoWindow({
        //     content: address
        // });
        // marker.addListener('click', () => {
        //     //infowindow.open(this.props.google, marker);
        // });
        let waypoints = this.state.waypoints;
        let polyline = this.state.polyline;
        let markers = this.state.markers;
        if (waypoints.length > 1) {
            polyline.setMap(null);
        }
        waypoints.push(latLng);

        let marker = new google.maps.Marker({
            position: latLng,
            map: this.props.google
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
        this.setState({
            waypoints,
            polyline,
            markers
        })
        google.maps.event.addListener(marker, 'click', (event) => {
            this.removePoint(marker);
        });

    }

    removePoint(marker) {
        let markers = this.state.markers;
        let waypoints = this.state.waypoints;
        for (var i = 0; i < markers.length; i++) {
            console.log(marker, markers)
            if (markers[i] === marker) {
                markers[i].setMap(null);
                markers.splice(i, 1);
                waypoints.splice(i, 1);
                this.state.polyline.getPath().removeAt(i);
                this.setState({
                    markers,
                    waypoints
                })
            }
        }
    }
    deleteMarker = (event) =>{
        let markers = this.state.markers;
        let marker = markers[event];
        let addresses = this.state.addresses;
        let waypoints = this.state.waypoints;
        for (var i = 0; i < markers.length; i++) {
            if (markers[i] === marker) {
                markers[i].setMap(null);
                markers.splice(i, 1);
                waypoints.splice(i, 1);
                addresses.splice(i, 1);
                this.state.polyline.getPath().removeAt(i);

                this.setState({
                    markers,
                    waypoints,
                    addresses
                })
            }
        }
    }

    toggleCollapse = () => {
        this.setState({isOpen: !this.state.isOpen});
    }
    inputOnChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        console.log(google)
    }
    enterPress = (event) => {
        // //if(this.state.waypoints.length >= 2) {
        // console.log('yez')
        // let request;
        // var directionsService = new google.maps.DirectionsService;
        // var directionsDisplay = new google.maps.DirectionsRenderer;
        // if (this.state.waypoints.length > 0) {
        //     directionsDisplay.set('directions', null);
        // }
        //
        // directionsDisplay.setOptions({suppressMarkers: false, draggable: true});
        //
        // directionsDisplay.setMap(this.props.google);
        //
        // //var waypts = [{location: {lat: 49.9935, lng: 36.230383000000074}, stopover: true}];
        // //{location: {lat: 49.9935, lng: 36.230383000000074}, stopover: true}
        // if (this.state.waypoints.length >= 1) {
        //     console.log('waypoints')
        //     let waypts = this.state.waypoints;
        //     let waypoints = [];
        //     for (let item of waypts) {
        //         waypoints.push({location: item, stopover: true});
        //     }
        //     console.log(waypoints)
        //     // let value = event.target.value;
        //     // console.log(event.target.value)
        //
        //     // console.log(this.props.fromValue)
        //     //50.746957, 25.325646 {lat: 50.746957, lng: 25.325646}
        //     request = {
        //         origin: new google.maps.LatLng(this.state.fromLatLng), //точка старта
        //         destination: new google.maps.LatLng(this.state.toLatLng), //точка финиша
        //         waypoints: waypoints,
        //         optimizeWaypoints: true,
        //         travelMode: google.maps.DirectionsTravelMode.WALKING //режим прокладки маршрута
        //     };
        // } else {
        //     request = {
        //         origin: new google.maps.LatLng(this.state.fromLatLng), //точка старта
        //         destination: new google.maps.LatLng(this.state.toLatLng), //точка финиша
        //         optimizeWaypoints: true,
        //         travelMode: google.maps.DirectionsTravelMode.WALKING //режим прокладки маршрута
        //     };
        // }
        // console.log(this.state.fromLatLng, this.state.toLatLng)
        // directionsService.route(request, function (response, status) {
        //     if (status === window.google.maps.DirectionsStatus.OK) {
        //         directionsDisplay.setDirections(response);
        //     }
        // });
        // directionsDisplay.setMap(this.props.google);
        // //}
        // //50.746957,25.325646
    }

    addListItem =() => {
        return Object.keys(this.state.addresses).map((pos, index) => {
            let marker = this.state.markers[pos];
            let address = this.state.addresses[pos];
            return (
                <MDBListGroupItem
                    onClick={this.deleteMarker.bind(null, pos)}
                    hover
                    key={index}
                >{address}</MDBListGroupItem>
            );
        });
    }

    handleSelect = address => {
        let addresses = this.state.addresses;
        addresses.push(address);
        this.setState({
            addresses
        })
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                this.setPoint(latLng, address)
                this.setState({
                    valueFrom: ''
                })
            })
            .catch(error => console.error('Error', error));
    };

    render() {
        return (
            <div className="App">
                <MDBNavbar color="indigo" dark expand="md">
                    <MDBNavbarBrand>
                        <strong className="white-text">RouteFinder</strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.toggleCollapse}/>
                    <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                        <MDBNavbarNav left>
                            <MDBNavItem active>
                                <MDBBtn size="sm">Create Route</MDBBtn>
                            </MDBNavItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
                <MDBContainer fluid style={{marginTop: '20px'}}>
                    <MDBRow around style={{display: 'flex', flexWrap: 'wrap'}}>
                        <MDBCol size="4">
                            <MDBCard>
                                <MDBCardBody>
                                    <MDBCardTitle>Card title</MDBCardTitle>
                                    <MDBCardText>
                                        Some quick example text to build on the card title and make
                                        up the bulk of the card&apos;s content.
                                    </MDBCardText>
                                    <PlacesAutocomplete
                                        value={this.state.valueFrom}
                                        onChange={valueFrom => this.setState({valueFrom})}
                                        onSelect={this.handleSelect}
                                    >
                                        {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                                            <div>
                                                <MDBInput
                                                    hint="From"
                                                    id="from_value"
                                                    name="valueFrom"
                                                    //value={this.state.fromValue}
                                                    {...getInputProps({
                                                        placeholder: 'Search Places ...',
                                                        className: 'location-search-input',
                                                    })}
                                                />
                                                <div className="autocomplete-dropdown-container">
                                                    {loading && <div>Loading...</div>}
                                                    {suggestions.map(suggestion => {
                                                        const className = suggestion.active
                                                            ? 'suggestion-item--active'
                                                            : 'suggestion-item';
                                                        // inline style for demonstration purpose
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
                                    <MDBBtn size="md" onClick={this.enterPress}>Create Route</MDBBtn>
                                    <MDBBtn size="md" onClick={() => {
                                        let polyline = this.state.polyline.setMap(null);
                                        this.setState({
                                            polyline
                                        })
                                    }}>Test</MDBBtn>
                                    <MDBListGroup style={{marginTop: '25px'}}>
                                        {this.state.addresses.length >= 1 ? this.addListItem() : false}
                                    </MDBListGroup>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol size="8">
                            <MDBCard>
                                <MDBCardBody>
                                    <MDBCardTitle>Card title</MDBCardTitle>
                                    <GoogleMap/>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fromWaypoint: waypoint => dispatch(fromWaypoint(waypoint))
    };
}

function mapStateToProps(state) {
    return {
        google: state.map.google,
        fromValue: state.map.fromWaypoint
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
