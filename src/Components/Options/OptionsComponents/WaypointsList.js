import React, {Component} from "react";
import {MDBListGroup, MDBListGroupItem} from "mdbreact";
import {SortableContainer, SortableElement} from "react-sortable-hoc";
import arrayMove from "array-move";
import {
    setAddresses,
    setMarkers,
    setPolyline,
    setWaypoints
} from "../../../store/actions/mapAction";
import {connect} from "react-redux";
/* global google */
let SortableItem, SortableList;

class WaypointsList extends Component {
    state = {
        toggle: false
    };

    componentDidMount() {
        SortableItem = SortableElement(({value}) =>
            <div
                className='list-item-box'>
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
    onSortEnd = ({oldIndex, newIndex}) => {
        let polyline = this.props.polyline;
        polyline.setMap(null);
        this.props.setAddresses(arrayMove(this.props.addresses, oldIndex, newIndex));
        this.props.setWaypoints(arrayMove(this.props.waypoints, oldIndex, newIndex));
        this.props.setMarkers(arrayMove(this.props.markers, oldIndex, newIndex));
        this.props.setPolyline(polyline);
        this.recreatePoly();
    };
    deleteMarker = (event) => {
        let markers = this.props.markers;
        let marker = markers[event];
        let addresses = this.props.addresses;
        let waypoints = this.props.waypoints;
        for (const [i, item] of markers.entries()) {
            if (item === marker) {
                item.setMap(null);
                markers.splice(i, 1);
                waypoints.splice(i, 1);
                addresses.splice(i, 1);
                this.props.polyline.getPath().removeAt(i);
                this.props.setMarkers(markers);
                this.props.setAddresses(addresses);
                this.props.setWaypoints(waypoints);
            }
        }
        this.setState({
            toggle: !this.state.toggle
        })
    };
    setPointAsCenter = (event) => {
        let latLng = this.props.markers[event];
        latLng = {lat: latLng.getPosition().lat(), lng: latLng.getPosition().lng()};
        this.props.google.setCenter(latLng)
    };
    addListItem = () => {
        return Object.keys(this.props.addresses).map((pos, index) => {
            let address = this.props.addresses[pos];
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
                         onClick={this.deleteMarker.bind(null, pos)}
                    >
                        <span key={'x-' + index} className="delete-item-btn">X</span>
                    </div>
                </div>
            );
        });
    };
    render() {
        let item;
        if (this.props.editMode) {
            item = this.addListItem();
        } else {
            item =
                (<SortableList items={this.props.addresses} onSortEnd={this.onSortEnd}/>);
        }
        return (
            <React.Fragment>
                <h3>Waypoints</h3>
                <MDBListGroup style={{marginTop: '25px'}}>
                    {this.props.addresses.length >= 1 ? item : 'No waypoints created'}
                </MDBListGroup>
            </React.Fragment>
        )
    }
}
function mapDispatchToProps(dispatch) {
    return {
        setWaypoints: data => dispatch(setWaypoints(data)),
        setAddresses: data => dispatch(setAddresses(data)),
        setMarkers: data => dispatch(setMarkers(data)),
        setPolyline: data => dispatch(setPolyline(data))
    };
}

function mapStateToProps(state) {
    return {
        google: state.map.google,
        waypoints: state.map.waypoints,
        polyline: state.map.polyline,
        markers: state.map.markers,
        addresses: state.map.addresses,
        editMode: state.map.editMode
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps)(WaypointsList);
