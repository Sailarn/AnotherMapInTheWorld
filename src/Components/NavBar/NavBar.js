import React, {Component} from 'react';
import {
    MDBNavbar,
    MDBNavbarBrand,
    MDBBtn
} from "mdbreact";
import {connect} from "react-redux";
import {wrapperCss, toggleOptions} from "../../store/actions/mapAction";

class NavBar extends Component {

    toggleOptions = () => {
        if (this.props.toggleOptionsCss === 'settings fast animated fadeInLeft') {
            this.props.toggleOptions('settings fast animated fadeOutLeft');
            setTimeout(() => {
                this.props.wrapperCss('settings-wrapper z0')
            }, 500);
        } else {
            this.props.toggleOptions('settings fast animated fadeInLeft');
            this.props.wrapperCss('settings-wrapper');
        }
    };

    render() {
        return (
            <MDBNavbar color="elegant-color-dark" dark expand="md">
                <MDBNavbarBrand>
                    <strong className="white-text">RouteFinder</strong>
                </MDBNavbarBrand>
                <MDBBtn className="toggleOptions" onClick={this.toggleOptions} color="amber" size="sm">Toggle
                    options</MDBBtn>
            </MDBNavbar>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleOptions: css => dispatch(toggleOptions(css)),
        wrapperCss: css => dispatch(wrapperCss(css))
    };
}

function mapStateToProps(state) {
    return {
        toggleOptionsCss: state.map.toggleOptionsCss
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
