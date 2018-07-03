import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { findDecision } from "../../actions/decision";

import "../../css/FindDecision.css";

class FindDecision extends Component {
  componentDidMount() {
    //check auth
  }

  handleFormSubmit = ({ decisionCode }) => {
    this.props.findDecision(decisionCode);
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="main-wrapper">
        <div className="enter-text">Enter Decision Code</div>
        <form
          name="find-decision"
          onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        >
          <Field name="decisionCode" component="input" type="text" />
          <button type="submit">Join</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return {
    isLoggedIn: state.auth.isLoggedIn
  };
};

FindDecision = connect(
  mapStateToProps,
  { findDecision }
)(FindDecision);

export default reduxForm({
  form: "find-decision",
  fields: ["decision-code"]
})(FindDecision);
