import {MDBCard, MDBCardBody, MDBCardTitle, MDBCol} from "mdbreact";
import React, {Component} from "react";

class Wrapper extends Component {
    render() {
        return (
            <MDBCol size={this.props.size} className={this.props.className}>
                <MDBCard className={this.props.cardClassname}>
                    <MDBCardBody>
                        <MDBCardTitle>{this.props.title}</MDBCardTitle>
                        {this.props.children}
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
        )
    }
}

export default Wrapper;