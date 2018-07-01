import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../css/CreateDecision.css";

const ROOT_URL = "http://localhost:8000";

class Question extends Component {
  state = {
    decisionText: "",
    decisionCode: "",
    redirect: false,
    didFetchResultFromServer: false,
    username: "",
    hasSubscriptionID: false,
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    }
  };

  // check auth to view page
  componentDidMount() {
    const headers = this.state.headers;

    axios
      .get(`${ROOT_URL}/api/routeThatNeedsJWTToken`, { headers })
      .then(res => {
        // console.log("res", res);
        this.setState({
          didFetchResultFromServer: true,
          username: res.data.user.username
        });
      })
      .catch(error => {
        this.setState({ didFetchResultFromServer: true, redirect: true });
      });

    axios
      .get(`${ROOT_URL}/api/subscriptionID`, { headers })
      .then(res => {
        console.log("res", res);
        if (res.data.subscription && res.data.subscription.subscriptionID) {
          this.setState({ hasSubscriptionID: true });
        } else {
          this.setState({ hasSubscriptionID: false });
        }
      })
      .catch(error => {
        console.log("error", error.response);
      });
  }

  setDecisionText = event => {
    this.setState({ decisionText: event.target.value });
  };

  createQuestion = event => {
    // console.log("Sending " + this.state.decisionText);
    const postData = {
      decisionText: this.state.decisionText
    };
    const headers = this.state.headers;
    axios
      .post(`${ROOT_URL}/api/decision/create`, postData, { headers })
      .then(decision => {
        console.log("decision", decision);
        this.setState({ decisionCode: decision.data.decision.decisionCode });
        this.props.history.push(
          "/decision/decisionCode/" + this.state.decisionCode
        );
      })
      .catch(error => console.log("Got error " + error.response.data.error));
  };

  render() {
    console.log("this.state", this.state);

    if (this.state.didFetchResultFromServer) {
      if (this.state.redirect === true) {
        return <Redirect to={"/signup"} />;
      } else if (this.state.hasSubscriptionID) {
        return (
          <div className="question-wrapper">
            <label className="question-title"> Create A New Question </label>
            <div className="question-input-wrapper">
              <textarea
                className="question-input"
                type="text"
                value={this.state.decisionText}
                onChange={this.setDecisionText}
              />
            </div>
            <div>
              <button onClick={this.createQuestion}> Create Question </button>
            </div>
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
    } else {
      return null;
    }
  }
}

export default Question;
