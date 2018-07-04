import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { authenticate } from "../../actions/auth";
import { createDecision } from "../../actions/decision";
import { checkSubscriptionID } from "../../actions/billing";
import Home from "../home/Home";
import "../../css/CreateDecision.css";

class CreateDecision extends Component {
  componentDidMount() {
    this.props.authenticate();
    // this.props.checkSubscriptionID();
  }

  handleFormSubmit = ({ decisionText }) => {
    const { history } = this.props;
    this.props.createDecision(decisionText, history);
  };

  render() {
    const { handleSubmit } = this.props;

    if (!this.props.isLoggedIn) {
      return <Home />;
    } else
      return (
        <div className="question-wrapper">
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <label className="question-title"> Create A New Question </label>
            <Field name="decisionText" component="input" type="text" />
            <button type="submit">Submit</button>
          </form>
        </div>
      );
    //   );
    //   return (
    //     <div>
    //       <div className="question-purchase-text">
    //         Purchase a subscription to creation decisions.
    //         <div className="question-buy-link-container">
    //           <Link className="question-buy-link" to="/billing/">
    //             BUY NOW
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }
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
