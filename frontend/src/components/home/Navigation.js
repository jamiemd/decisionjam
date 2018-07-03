import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import "../../css/Navigation.css";

class Navigation extends Component {
  handleLogoutClick = () => {
    this.props.logout();
  };

  render() {
    console.log("this.props", this.props);

    if (this.props.isLoggedIn) {
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
                to="/"
                onClick={this.handleLogoutClick}
              >
                LOGOUT
              </Link>
            </div>
          </div>
          <div className="hr-nav" />
          <div className="menu">
            <Link className="menu-links" to="/create-decision">
              Create Decision
            </Link>
            <Link className="menu-links" to="/find-decision">
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
              <Link className="login button" to="/login">
                LOGIN
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

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn
  };
};

export default connect(
  mapStateToProps,
  { logout }
)(Navigation);
