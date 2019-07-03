import React, {Component} from 'react';
import {
    MDBCardText
} from "mdbreact";
import {connect} from "react-redux";
import Wrapper from "../Wrapper/Wrapper";
import WaypointsList from "./OptionsComponents/WaypointsList";
import RoutesList from "./OptionsComponents/RoutesList";
import TravelMode from "./OptionsComponents/TravelMode";
import CreateRouteButton from "./OptionsComponents/CreateRouteButton";
import EditToggle from "./OptionsComponents/EditToggle";
import AutoComplete from "./OptionsComponents/AutoComplete";

class Options extends Component {
    state = {
        loaded: false
    };
    componentDidUpdate() {
        if (this.state.loaded === false) {
            this.setState({
                loaded: true
            })
        }
    }
    render() {
        return (
            <Wrapper title="Settings" size="12" className={this.props.wrapperCss}
                     cardClassname={this.props.toggleOptionsCss}>
                <MDBCardText>
                    You can choose variant with arrows and press Enter to add a waypoint.
                </MDBCardText>
                {this.props.google ? <AutoComplete/> : false}
                <div className="options">
                    <CreateRouteButton/>
                    <EditToggle/>
                    <TravelMode/>
                </div>
                <WaypointsList/>
                <RoutesList/>
            </Wrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        google: state.map.google,
        toggleOptionsCss: state.map.toggleOptionsCss,
        wrapperCss: state.map.wrapperCss
    };
}

export default connect(
    mapStateToProps,
    null)(Options);
