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
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

/* global google */

let SortableItem, SortableList;
class App extends Component {
    state = {
        isOpen: false,
        valueFrom: '',
        fromLatLng: '',
        waypoints: [],
        polyline: [],
        markers: [],
        addresses: [],
        test: true
    };

    componentDidUpdate() {
        SortableItem = SortableElement(({value}) =>
            <div
                className="list-item-box">
                <MDBListGroupItem
                    hover
                >{value}
                </MDBListGroupItem>
            </div>);

        SortableList  = SortableContainer(({items}) => {
            return (
                <ul>
                    {items.map((value, index) => (
                        <SortableItem key={`item-${index}`} index={index} value={value}/>
                    ))}
                </ul>
            );
        });
    }

    setPoint = (latLng, address) => {
        this.props.google.setCenter(latLng)
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
        let infowindow = new google.maps.InfoWindow({
            content: address
        });
        marker.addListener('click', () => {
            infowindow.open(this.props.google, marker);
        });
        // google.maps.event.addListener(marker, 'click', (event) => {
        //     this.removePoint(marker);
        // });

    }

    // removePoint(marker) {
    //     let markers = this.state.markers;
    //     let waypoints = this.state.waypoints;
    //     for (var i = 0; i < markers.length; i++) {
    //         console.log(marker, markers)
    //         if (markers[i] === marker) {
    //             markers[i].setMap(null);
    //             markers.splice(i, 1);
    //             waypoints.splice(i, 1);
    //             this.state.polyline.getPath().removeAt(i);
    //             this.setState({
    //                 markers,
    //                 waypoints
    //             })
    //         }
    //     }
    // }

    deleteMarker = (event) => {
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
    deleteAllMarkers = () => {
        this.state.polyline.setMap(null);
        let markers = this.state.markers;
        let addresses = this.state.addresses;
        let waypoints = this.state.waypoints;
        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null);

        }
        markers.splice(0, markers.length - 1);
        waypoints.splice(0, markers.length - 1);
        addresses.splice(0, markers.length - 1);
        this.setState({
            markers,
            waypoints,
            addresses
        })
        console.log(this.state);
    }
    createRoute = () => {
        this.deleteAllMarkers();
        let request;
        let directionsService = new google.maps.DirectionsService;
        let directionsDisplay = new google.maps.DirectionsRenderer;

        directionsDisplay.setOptions({suppressMarkers: false, draggable: true});

        directionsDisplay.setMap(this.props.google);

        if (this.state.waypoints.length > 2) {
            let waypts = this.state.waypoints;
            let waypoints = [];
            for (let item of waypts) {
                waypoints.push({location: item, stopover: true});
            }
            waypoints.splice(0, 1);
            waypoints.splice(waypoints.length - 1, 1);
            request = {
                origin: new google.maps.LatLng(this.state.waypoints[0]), //точка старта
                destination: new google.maps.LatLng(this.state.waypoints[this.state.waypoints.length - 1]), //точка финиша
                waypoints: waypoints,
                optimizeWaypoints: false,
                travelMode: google.maps.DirectionsTravelMode.WALKING //режим прокладки маршрута
            };
        } else {
            request = {
                origin: new google.maps.LatLng(this.state.waypoints[0]), //точка старта
                destination: new google.maps.LatLng(this.state.waypoints[this.state.waypoints.length - 1]), //точка финиша
                optimizeWaypoints: false,
                travelMode: google.maps.DirectionsTravelMode.WALKING //режим прокладки маршрута
            };
        }
        directionsService.route(request, function (response, status) {
            if (status === window.google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
        directionsDisplay.setMap(this.props.google);
    }
    setPointAsCenter = (event) => {
        console.log(event)
        let latLng = this.state.markers[event];
        latLng = {lat: latLng.getPosition().lat(), lng: latLng.getPosition().lng()}
        this.props.google.setCenter(latLng)
    }
    recreatePoly = () =>{
        let waypoints = this.state.waypoints;
        let polyline = this.state.polyline;
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
            polyline
        })
    }
    addListItem = () => {
        return Object.keys(this.state.addresses).map((pos, index) => {
            let address = this.state.addresses[pos];
            return (
                <div key={'item-' + index} className="list-item-box">
                    <MDBListGroupItem
                        onClick={this.setPointAsCenter.bind(null, pos)}
                        hover
                        key={index}
                    >{address}
                    </MDBListGroupItem>
                    <div className="delete-item-box" key={'box-' + index} onClick={this.deleteMarker.bind(null, pos)}>
                        <span key={'x-' + index} className="delete-item-btn">X</span>
                    </div>
                </div>
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
    onSortEnd = ({oldIndex, newIndex}) => {
        let polyline = this.state.polyline;
        polyline.setMap(null);
        this.setState(({addresses, waypoints, markers}) => ({
            addresses: arrayMove(addresses, oldIndex, newIndex),
            waypoints: arrayMove(waypoints, oldIndex, newIndex),
            markers: arrayMove(markers, oldIndex, newIndex),
            polyline
        }));
        this.recreatePoly();

    };
    render() {
        let item;
        if(this.state.test){
            item = this.addListItem();
        }
        else{
            item =
                (<SortableList items={this.state.addresses} onSortEnd={this.onSortEnd}/>);
        }
        return (
            <div className="App">
                <MDBNavbar color="indigo" dark expand="md">
                    <MDBNavbarBrand>
                        <strong className="white-text">RouteFinder</strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={() => this.setState({isOpen: !this.state.isOpen})}/>
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
                                    <MDBBtn size="md" onClick={this.createRoute}>Create Route</MDBBtn>
                                    <MDBBtn size="md" onClick={() => {
                                        this.setState({
                                            test: !this.state.test
                                        })
                                        console.log(this.state.test)
                                    }}>Test</MDBBtn>

                                    <MDBListGroup style={{marginTop: '25px'}}>
                                        {this.state.addresses.length >= 1 ? item : false}
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
