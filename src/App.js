import React, {Component} from 'react';
import './App.css';
import GoogleMap from './Components/Map/Map'
import {
    MDBRow,
    MDBContainer,
    ToastContainer,
} from "mdbreact";
import {connect} from "react-redux";
import NavBar from "./Components/NavBar/NavBar";
import Options from "./Components/Options/Options";


class App extends Component {
    render() {
        return (
            <div className="App">
                {!this.props.google ? <div className="preloader">
                    <div className="spinner-grow text-info" role="status"></div>
                </div> : false}
                <NavBar/>
                <MDBContainer fluid>
                    <ToastContainer
                        className="toaster"
                        hideProgressBar={true}
                        newestOnTop={true}
                        autoClose={5000}
                    />
                    <MDBRow around>
                        <Options/>
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
