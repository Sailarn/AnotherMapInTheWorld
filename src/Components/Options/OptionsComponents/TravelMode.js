import React, {Component} from "react";
import {MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle} from "mdbreact";
import {connect} from "react-redux";
import {setTravelMode} from "../../../store/actions/mapAction";

/* global google */

class TravelMode extends Component {

    componentDidMount() {
        setTimeout(() => {
            this.props.setTravelMode(google.maps.DirectionsTravelMode.DRIVING);
        }, 1000)
    }

    chooseTravelMode = event => {
        switch (event.target.value) {
            case 'DRIVING':
                this.props.setTravelMode(google.maps.DirectionsTravelMode.DRIVING);
                break;
            case 'WALKING':
                this.props.setTravelMode(google.maps.DirectionsTravelMode.WALKING);
                break;
            case 'TRANSIT':
                this.props.setTravelMode(google.maps.DirectionsTravelMode.TRANSIT);
                break;
            case 'BICYCLING':
                this.props.setTravelMode(google.maps.DirectionsTravelMode.BICYCLING);
                break;
            default:
                break;
        }
    };

    render() {
        return (
            <React.Fragment>
                <MDBDropdown size="sm" style={{display: "inline-flex"}} onClick={this.chooseTravelMode}>
                    <MDBDropdownToggle caret color="mdb-color" defaultValue={this.props.travelMode}>Travel
                        Mode</MDBDropdownToggle>
                    <MDBDropdownMenu>
                        <MDBDropdownItem value="DRIVING">Driving</MDBDropdownItem>
                        <MDBDropdownItem value="BICYCLING">Bicycling</MDBDropdownItem>
                        <MDBDropdownItem value="TRANSIT">Transit</MDBDropdownItem>
                        <MDBDropdownItem value="WALKING">Walking</MDBDropdownItem>
                    </MDBDropdownMenu>
                </MDBDropdown>
                <p>Travel mode: {this.props.travelMode.toLowerCase()}</p>
            </React.Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setTravelMode: data => dispatch(setTravelMode(data))
    };
}

function mapStateToProps(state) {
    return {
        travelMode: state.map.travelMode
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps)(TravelMode);
