import React, { Component } from "react";
import "./Billing.css";
import { Elements } from "react-stripe-elements";
import InjectedCheckoutForm from "./CheckoutForm";
import { Link } from "react-router-dom";
import axios from "axios";

const ROOT_URL = "http://localhost:8000";

class Billing extends Component {
  state = {
    didFetchResultFromServer: false,
    hasSubscription: false,
    subscription: "",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    }
  };

  componentDidMount() {
    const headers = this.state.headers;
    axios
      .get(`${ROOT_URL}/api/routeThatNeedsJWTToken`, { headers })
      .then(res => {
        // console.log("res", res);
      })
      .catch(error => {
        console.log("error", error);
      });
    axios
      .get(`${ROOT_URL}/api/subscriptionID`, { headers })
      .then(res => {
        console.log("res", res);
        if (res.data.subscription && res.data.subscription.subscriptionID) {
          this.setState({
            hasSubscription: true,
            subscription: res.data.subscription,
            didFetchResultFromServer: true
          });
        } else {
          this.setState({
            hasSubscription: false,
            didFetchResultFromServer: true
          });
        }
      })
      .catch(error => {
        console.log("error", error);
        this.setState({
          didFetchResultFromServer: true
        });
      });
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
            <div className="continue-text">Continue as a free user </div>
            <Link to="/landing-page">Home</Link>
          </div>
        </div>
      );
    }
  }
}

export default Billing;
