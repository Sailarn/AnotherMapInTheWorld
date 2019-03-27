import React, {Component} from 'react';
import './App.css';
import GoogleMap from './Components/Map/Map'
import {
    MDBNavbar,
    MDBNavbarBrand,
    MDBBtn,
    MDBRow,
    MDBContainer,
    MDBInput,
    MDBCardText,
    MDBListGroup,
    MDBListGroupItem,
    ToastContainer,
    toast,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem
} from "mdbreact";
import {connect} from "react-redux";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Wrapper from "./Components/Map/Wrapper";

/* global google */


let SortableItem, SortableList;

class App extends Component {
    state = {
        isOpen: false,
        fromLatLng: '',
        waypoints: [],
        polyline: [],
        markers: [],
        addresses: [],
        editMode: true,
        valueFrom: '',
        routes: [],
        tempAddress: '',
        latLng: '',
        error: false,
        addressesCopy: [],
        css: 'settings animated fadeOutLeft',
        wrapper: 'settings-wrapper z0',
        travelMode: '',
        loaded: false
    };
    componentDidMount() {
        SortableItem = SortableElement(({value}) =>
            <div
                className="list-item-box">
                <MDBListGroupItem
                    hover
                >{value}
                </MDBListGroupItem>
            </div>);
        SortableList = SortableContainer(({items}) => {
            return (
                <div>
                    {items.map((value, index) => (
                        <SortableItem key={`item-${index}`} index={index} value={value}/>
                    ))}
                </div>
            );
        });
    }
    componentDidUpdate() {
        if(this.state.loaded === false){
            this.setState({
                travelMode: google.maps.DirectionsTravelMode.DRIVING,
                loaded: true
            })
        }
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
        google.maps.event.addListener(marker, 'dragend', () => {
            this.getNewAddress(marker, marker.getPosition());
            setTimeout(() => {
                infowindow.setContent(this.state.tempAddress);
            }, 500);
        });

    }
    getNewAddress = (marker, pos) => {
        this.dismissAll();
        let polyline = this.state.polyline;
        polyline.setMap(null);
        this.setState({
            polyline
        })
        let markers = this.state.markers;
        let waypoints = this.state.waypoints;
        let addresses = this.state.addresses;
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
                    this.setState({
                        markers,
                        addresses,
                        waypoints,
                        tempAddress: results[0].formatted_address
                    })
                } else {
                    this.notify('pointError');
                    markers[localPosition].setPosition(waypoints[localPosition]);
                    this.setState({
                        markers
                    })
                }
            }
        );
        setTimeout(() => {
            this.recreatePoly();
        }, 500);
    }
    deleteMarker = (event) => {
        let markers = this.state.markers;
        let marker = markers[event];
        let addresses = this.state.addresses;
        let waypoints = this.state.waypoints;
        for (const [i, item] of markers.entries()) {
            if (item === marker) {
                item.setMap(null);
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
        for (const item of markers) {
            item.setMap(null);
        }
        markers = [];
        this.setState({
            markers,
            addresses: []
        })
    }
    createRoute = () => {
        this.dismissAll();
        if (this.state.waypoints.length < 2) {
            return;
        }
        let address = this.state.addresses;
        let addressesCopy = this.state.addressesCopy;
        addressesCopy.push({from: address[0], to: address[address.length - 1]});
        let request;
        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer();

        directionsDisplay.setOptions({suppressMarkers: false});

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
                origin: new google.maps.LatLng(this.state.waypoints[0]),
                destination: new google.maps.LatLng(this.state.waypoints[this.state.waypoints.length - 1]),
                waypoints: waypoints,
                optimizeWaypoints: false,
                travelMode: this.state.travelMode
            };
        } else {
            request = {
                origin: new google.maps.LatLng(this.state.waypoints[0]),
                destination: new google.maps.LatLng(this.state.waypoints[this.state.waypoints.length - 1]),
                optimizeWaypoints: false,
                travelMode: this.state.travelMode
            };
        }
        directionsService.route(request, (response, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
                this.deleteAllMarkers();
                directionsDisplay.setDirections(response);
                this.notify('routeCreated');
                directionsDisplay.setMap(this.props.google);
                let routes = this.state.routes;
                routes.push(directionsDisplay);
                this.setState({
                    waypoints: [],
                    routes,
                    addressesCopy
                });
                this.toggleOptions();
            } else {
                this.notify('routeError');
            }
        });

    }
    deleteRoute = (event) => {
        let addressesCopy = this.state.addressesCopy;
        let routes = this.state.routes;
        addressesCopy.splice(event, 1);
        routes[event].setMap(null);
        routes.splice(event, 1);
        this.setState({
            routes,
            addressesCopy
        })
        this.notify('routeDelete');
    }
    setPointAsCenter = (event) => {
        let latLng = this.state.markers[event];
        latLng = {lat: latLng.getPosition().lat(), lng: latLng.getPosition().lng()}
        this.props.google.setCenter(latLng)
    }
    recreatePoly = () => {
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
                    <div className="delete-item-box index-class" key={'indexBox-' + index}>
                        <span key={'index-' + index} className="delete-item-btn">{index + 1}</span>
                    </div>
                    <MDBListGroupItem
                        onClick={this.setPointAsCenter.bind(null, pos)}
                        hover
                        key={index}
                    >{address}
                    </MDBListGroupItem>
                    <div className="delete-item-box" key={'box-' + index}
                         onClick={this.deleteMarker.bind(null, pos)}>
                        <span key={'x-' + index} className="delete-item-btn">X</span>
                    </div>
                </div>
            );
        });
    }
    handleSelect = address => {
        this.dismissAll();
        let addresses = this.state.addresses;
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                addresses.push(address);
                this.setState({
                    valueFrom: '',
                    latLng,
                    addresses
                })
                this.setMarker(latLng, address);
            })
            .catch(() => {
                this.setMarker();
            });
    };
    setMarker = (latLng, address) => {
        if (latLng) {
            this.notify('pointCreated');
            this.setPoint(latLng, address)
        } else {
            this.notify('placeError');
        }
    }

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
    listOfRoutes = () => {
        return Object.keys(this.state.routes).map((pos, index) => {
            let address = this.state.addressesCopy[pos];
            let fromAddress = address.from;
            let toAddress = address.to;
            return (
                <div key={'item-' + index} className="list-item-box">
                    <div className="delete-item-box index-class" key={'indexBox-' + index}>
                        <span key={'index-' + index} className="delete-item-btn">{index + 1}</span>
                    </div>
                    <MDBListGroupItem
                        hover
                        key={index}
                    >From: {fromAddress} To: {toAddress}
                    </MDBListGroupItem>
                    <div className="delete-item-box" key={'box-' + index}
                         onClick={this.deleteRoute.bind(null, pos)}>
                        <span key={'x-' + index} className="delete-item-btn">X</span>
                    </div>
                </div>
            );
        });

    }
    toggleOptions = () => {
        if (this.state.css === 'settings animated fadeInLeft') {
            this.setState({
                css: 'settings animated fadeOutLeft',
            })
            setTimeout(() => {
                this.setState({
                    wrapper: 'settings-wrapper z0'
                })
            }, 500);
        } else {
            this.setState({
                css: 'settings animated fadeInLeft',
                wrapper: 'settings-wrapper'
            })
        }
    }
    notify = type => {
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
    chooseTravelMode = event => {
        switch (event.target.value) {
            case 'DRIVING':
                this.setState({
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                })
                break;
            case 'WALKING':
                this.setState({
                    travelMode: google.maps.DirectionsTravelMode.WALKING
                })
                break;
            case 'TRANSIT':
                this.setState({
                    travelMode: google.maps.DirectionsTravelMode.TRANSIT
                })
                break;
            case 'BICYCLING':
                this.setState({
                    travelMode: google.maps.DirectionsTravelMode.BICYCLING
                })
                break;
            default:
                break;
        }
    }
    dismissAll = () => toast.dismiss();
    onError = (status, clearSuggestions) =>{
        this.dismissAll();
        this.notify('noResults');
        clearSuggestions();
    }
    render() {
        let item, autocomplete, itemRoute;

        if (this.state.editMode) {
            item = this.addListItem();
        } else {
            item =
                (<SortableList items={this.state.addresses} onSortEnd={this.onSortEnd}/>);
        }
        itemRoute = this.listOfRoutes();
        autocomplete = (<PlacesAutocomplete
            value={this.state.valueFrom}
            onChange={valueFrom => this.setState({valueFrom})}
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
        </PlacesAutocomplete>)
        return (
            <div className="App">
                {!this.props.google ? <div className="preloader">
                    <div className="spinner-grow text-info" role="status"></div>
                </div> : false}
                <MDBNavbar color="elegant-color-dark" dark expand="md">
                    <MDBNavbarBrand>
                        <strong className="white-text">RouteFinder</strong>
                    </MDBNavbarBrand>
                    <MDBBtn className="toggleOptions" onClick={this.toggleOptions} color="amber" size="sm">Toggle options</MDBBtn>
                </MDBNavbar>
                <MDBContainer fluid>
                    <ToastContainer
                        className="toaster"
                        hideProgressBar={true}
                        newestOnTop={true}
                        autoClose={5000}
                    />
                    <MDBRow around>
                        <Wrapper title="Settings" size="12" className={this.state.wrapper}
                                 cardClassname={this.state.css}>
                            <MDBCardText>
                                You can choose variant with arrows and press Enter to add a waypoint.
                            </MDBCardText>
                            {this.props.google ? autocomplete : false}
                            <div className="options">
                                <MDBBtn size="sm" onClick={this.createRoute}>Create Route</MDBBtn>
                                <input type="checkbox"
                                       id="id-name--1"
                                       name="edit-mode"
                                       className="switch-input"
                                       onChange={() => this.setState({editMode: !this.state.editMode})}
                                />
                                <label htmlFor="id-name--1" className="switch-label">Edit mode <span
                                    className="toggle--on">On</span><span
                                    className="toggle--off">Off</span></label>
                                <MDBDropdown size="sm" style={{display: "inline-flex"}} onClick={this.chooseTravelMode}>
                                    <MDBDropdownToggle caret color="mdb-color" defaultValue={this.state.travelMode}>Travel Mode</MDBDropdownToggle>
                                    <MDBDropdownMenu>
                                        <MDBDropdownItem value="DRIVING">Driving</MDBDropdownItem>
                                        <MDBDropdownItem value="BICYCLING">Bicycling</MDBDropdownItem>
                                        <MDBDropdownItem value="TRANSIT">Transit</MDBDropdownItem>
                                        <MDBDropdownItem value="WALKING">Walking</MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </div>
                            <h3>Waypoints</h3>
                            <MDBListGroup style={{marginTop: '25px'}}>
                                {this.state.addresses.length >= 1 ? item : 'No waypoints created'}
                            </MDBListGroup>
                            <h3 style={{marginTop: '10px'}}>Routes</h3>
                            <MDBListGroup style={{marginTop: '25px'}}>
                                {this.state.routes.length > 0 ? itemRoute : 'No routes created'}
                            </MDBListGroup>
                        </Wrapper>
                        <GoogleMap/>
                    </MDBRow>
                </MDBContainer>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        google: state.map.google
    };
}

export default connect(mapStateToProps)(App);
