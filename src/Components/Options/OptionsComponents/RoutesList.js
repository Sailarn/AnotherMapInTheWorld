import React, {Component} from "react";
import {MDBListGroup, MDBListGroupItem} from "mdbreact";
import {
    setAddressesCopy,
    setRoutes
} from "../../../store/actions/mapAction";
import {notify} from "./ToastFunctions";
import {connect} from "react-redux";

class RoutesList extends Component {
    state = {
        deleteDumbToggle: false
    };

    deleteRoute = (event) => {
        let addressesCopy = this.props.addressesCopy;
        let routes = this.props.routes;
        addressesCopy.splice(event, 1);
        routes[event].setMap(null);
        routes.splice(event, 1);
        this.props.setRoutes(routes);
        this.props.setAddressesCopy(addressesCopy);
        notify('routeDelete');
        this.setState({
            deleteDumbToggle: !this.state.deleteDumbToggle
        });
    };

    render() {
        return (
            <React.Fragment>
                <h3 style={{marginTop: '10px'}}>Routes</h3>
                <MDBListGroup style={{marginTop: '25px'}}>
                    {this.props.routes.length > 0 ? Object.keys(this.props.routes).map((pos, index) => {
                        let address = this.props.addressesCopy[pos];
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
                    }) : 'No routes created'}
                </MDBListGroup>
            </React.Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setAddressesCopy: data => dispatch(setAddressesCopy(data)),
        setRoutes: data => dispatch(setRoutes(data))
    };
}

function mapStateToProps(state) {
    return {
        addressesCopy: state.map.addressesCopy,
        routes: state.map.routes,
        waypoints: state.map.waypoints
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps)(RoutesList);
