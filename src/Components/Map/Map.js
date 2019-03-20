import React from 'react';
import './map.css'
import {connect} from "react-redux";
import {googleApi} from '../../store/actions/mapAction'
//<script defer async src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDfXMtNQ9WiZVSmJx8FI0EwzFKhyzwM6vg"></script>
/*global google*/

class GoogleMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mapIsReady: false,
            center: {lat: 46.482886, lng: 30.735430},
            map: '',
            loaded: false,
            city: '',
            query: ''
        };
    }

    componentDidMount() {
        let map = new google.maps.Map(document.getElementById('map'), {
            center: this.state.center,
            zoom: 5,
            mapTypeId: 'roadmap',
        });


        if (this.state.loaded === false) {
            this.loadGoogleData(map);
        }
    }



    loadGoogleData = (map) => {
        this.props.googleApi(map);
        this.setState({
            loaded: true,
            map: map
        })
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        return (
            <div id="map">
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        googleApi: map => dispatch(googleApi(map))
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
)(GoogleMap);
//https://maps.googleapis.com/maps/api/js?key=AIzaSyDfXMtNQ9WiZVSmJx8FI0EwzFKhyzwM6vg
