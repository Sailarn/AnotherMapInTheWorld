import React from "react";
import {setEditeMode} from "../../../store/actions/mapAction";
import {connect} from "react-redux";

const EditToggle = (props) => {
    return (
        <React.Fragment>
            <input type="checkbox"
                   id="id-name--1"
                   name="edit-mode"
                   className="switch-input"
                   onChange={() => props.setEditMode(!props.editMode)}
            />
            <label htmlFor="id-name--1" className="switch-label">Edit mode
                <span className="toggle--on">On</span>
                <span className="toggle--off">Off</span>
            </label>
        </React.Fragment>
    )
};

function mapDispatchToProps(dispatch) {
    return {
        setEditMode: data => dispatch(setEditeMode(data))
    };
}

function mapStateToProps(state) {
    return {
        editMode: state.map.editMode
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps)(EditToggle);
