import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import "../../css/FindDecision.css";

const ROOT_URL = "http://localhost:8000";

class Main extends Component {
  state = {
    decisionCode: "",
    redirect: false,
    didFetchResultFromServer: false,
    isError: false,
    errorMessage: "",
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
        this.setState({ didFetchResultFromServer: true });
      })
      .catch(error => {
        // console.log("error", error);
        this.setState({ didFetchResultFromServer: true, redirect: true });
      });
  }

  setDecisionCode = event => {
    this.setState({ decisionCode: event.target.value });
  };
  //xzx7x
  joinDecision = event => {
    const headers = this.state.headers;
    const decisionCode = this.state.decisionCode;
    this.setState({
      isError: true,
      errorMessage: ""
    });
    if (this.state.decisionCode === "") {
      console.log("this.state.decisionCode", this.state.decisionCode);
      this.setState({
        isError: true,
        errorMessage: "Decision code must be entered."
      });
      return;
    }
    axios
      .get(`${ROOT_URL}/api/decision/${decisionCode}`, { headers })
      .then(res => {
        console.log("res.data", res.data);
        // console.log("res.data", res.data.length);
        if (res.data.length === 0) {
          this.setState({
            isError: true,
            errorMessage: "Decision code not found."
          });
        } else {
          this.props.history.push(
            "/decision/decisionCode/" + this.state.decisionCode
          );
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  render() {
    const errorMessage = this.state.errorMessage;
    // console.log("errorMessage", errorMessage);

    if (this.state.didFetchResultFromServer) {
      if (this.state.redirect === true) {
        return <Redirect to={"/signup"} />;
      } else {
        return (
          <div className="main-wrapper">
            <label className="luckyyou"> "Lucky You" </label>
            <div className="enter-text">Enter Decision Code</div>
            <div className="main-input-wrapper">
              <input
                className="main-input"
                type="text"
                value={this.state.decisionCode}
                onChange={this.setDecisionCode}
              />
            </div>
            <div className="mainpage-error-message">
              {this.state.isError ? errorMessage : ""}
            </div>
            <div>
              <button onClick={this.joinDecision}> Join </button>
            </div>
          </div>
        );
      }
    } else {
      return null;
    }
  }
}
export default Main;
