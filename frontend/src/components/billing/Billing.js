import React, { Component } from "react";
import { Elements } from "react-stripe-elements";
import InjectedCheckoutForm from "./CheckoutForm";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "../../css/Billing.css";
import { authenticate } from "../../actions/auth";

class Billing extends Component {
  componentDidMount() {
    this.props.authenticate();
  }

  convertDate = unixtimestamp => {
    let months_arr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    let date = new Date(unixtimestamp * 1000);
    let year = date.getFullYear();
    let month = months_arr[date.getMonth()];
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();

    let convdataTime = month + "-" + day + "-" + year + " ";

    return convdataTime;
  };

  convertAmount = charge => {
    return charge * 0.01;
  };

  render() {
    console.log("this.state", this.state);
    const subscription = this.state.subscription;

    if (!this.state.didFetchResultFromServer) {
      return null;
    }
    if (this.state.hasSubscription) {
      return (
        <div className="subscription-info-container">
          <div className="subscription-info-title">
            Subscription Information
          </div>
          <div className="hr-billing " />

          <div className="subscription-sub-info-container">
            <div>Type </div>
            <div>{subscription.subscriptionType}</div>
          </div>
          <div className="subscription-sub-info-container">
            <div>Amount Billed </div>
            <div>${this.convertAmount(subscription.amountBilled)}</div>
          </div>
          <div className="subscription-sub-info-container">
            <div> Start Date </div>
            <div>{this.convertDate(subscription.subscriptionStartDate)}</div>
          </div>
          <div className="subscription-sub-info-container">
            <div> End Date </div>
            <div>{this.convertDate(subscription.subscriptionEndDate)}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="billing-container">
          <div className="elements-container">
            <div className="paymentform-title">Create a subscription now!</div>
            <div className="hr-billing " />
            <div className="paymentform-title">Payment</div>
            <div className="hr-billing " />
            <Elements>
              <InjectedCheckoutForm plan={this.props.match} />
            </Elements>
          </div>
          <div className="or-divider">Or</div>
          <div className="continue-container">
            <div className="continue-text">
              Continue as a free user if<div /> you don't have a subscription.{" "}
            </div>
            <Link to="/landing-page">Home</Link>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return {
    isLoggedIn: state.auth.isLoggedIn
  };
};

export default connect(
  mapStateToProps,
  { authenticate }
)(Billing);
