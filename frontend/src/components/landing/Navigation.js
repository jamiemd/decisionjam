import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";
import axios from "axios";

const ROOT_URL = "http://localhost:8000";

class Navigation extends Component {
  // remove token and redirect from backend
  handleLogoutClick = e => {
    localStorage.removeItem("token");
    axios.get(`${ROOT_URL}/api/logout`).then(res => {
      console.log("res", res, "logged out");
    });
  };

  render() {
    let token = localStorage.getItem("token");
    // console.log(token);

    // if user signed in
    if (token) {
      return (
        <div className="navigation-container">
          <div className="header">
            <Link to="/mainpage">
              <div className="logo">
                <div className="design">Decision</div>
                <div className="jam">Jam</div>
              </div>
            </Link>
            <div className="signin-container">
              <Link
                className="logout button"
                to="/logout"
                onClick={this.handleLogoutClick}
              >
                LOGOUT
              </Link>
            </div>
          </div>
          <div className="hr-nav" />
          <div className="menu">
            <Link className="menu-links" to="/question-page">
              Create Decisions
            </Link>
            <Link className="menu-links" to="/mainpage">
              Find Decision
            </Link>
            <Link className="menu-links" to="/billing">
              Billing
            </Link>
          </div>
          <div className="hr-nav" />
        </div>
      );
      // if user not signed in
    } else {
      return (
        <div className="navigation-container">
          <div className="header">
            <Link to="/landing-page">
              <div className="logo">
                <div className="design">Decision</div>
                <div className="jam">Jam</div>
              </div>
            </Link>
            <div className="signin-container">
              <Link className="signin button" to="/signin">
                SIGN IN
              </Link>
              <Link className="signup button" to="/signup">
                SIGN UP
              </Link>
            </div>
          </div>
          <div className="hr-nav" />
        </div>
      );
    }
  }
}

export default Navigation;
