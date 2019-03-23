import React from 'react';
import './map.css'
import {connect} from "react-redux";
import {googleApi} from '../../store/actions/mapAction'

/*global google*/

class GoogleMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: {lat: 46.482886, lng: 30.735430},
            map: '',
            loaded: false
        };
    }

    loadGoogleData = (map) => {
        this.props.googleApi(map);
        this.setState({
            loaded: true,
            map: map
        })
    }

    componentDidMount() {
        setTimeout(() => {

            let map = new google.maps.Map(document.getElementById('map'), {
                center: this.state.center,
                zoom: 5,
                mapTypeId: 'roadmap',
                gestureHandling: 'greedy'
            });

            if (this.state.loaded === false) {
                this.loadGoogleData(map);
            }
        }, 500)
    }

    loadGoogleData = (map) => {
        this.props.googleApi(map);
        this.setState({
            loaded: true,
            map: map
        })
    }


    render() {
        return (
            <div id="map"></div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        googleApi: map => dispatch(googleApi(map))
    };
}

export default connect(
    null,
    mapDispatchToProps
)(GoogleMap);
