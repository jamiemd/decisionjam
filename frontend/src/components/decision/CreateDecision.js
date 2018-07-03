import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { authenticate } from "../../actions/auth";
import { createDecision } from "../../actions/decision";
import { checkSubscriptionID } from "../../actions/billing";
import "../../css/CreateDecision.css";

class CreateDecision extends Component {
  componentDidMount() {
    this.props.authenticate();
    this.props.checkSubscriptionID();
  }

  handleFormSubmit = ({ decision }) => {
    this.props.createDecision(decision);
  };

  render() {
    console.log("this.state", this.state);
    const { handleSubmit } = this.props;

    if (this.state.hasSubscriptionID) {
      return (
        <div className="question-wrapper">
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <label className="question-title"> Create A New Question </label>
            <Field name="decision" component="input" type="text" />
            <button type="submit">Submit</button>
          </form>
        </div>
      );
    } else {
      return (
        <div>
          <div className="question-purchase-text">
            Purchase a subscription to creation decisions.
            <div className="question-buy-link-container">
              <Link className="question-buy-link" to="/billing/">
                BUY NOW
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return {
    isLoggedIn: state.auth.isLoggedIn,
    hasSubscriptionID: state.auth.isLoggedIn
  };
};

CreateDecision = connect(
  mapStateToProps,
  { createDecision, checkSubscriptionID, authenticate }
)(CreateDecision);

export default reduxForm({
  form: "create-decision",
  fields: ["decision"]
})(CreateDecision);
