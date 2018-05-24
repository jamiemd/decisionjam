import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";

const ROOT_URL = "http://localhost:8000";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      redirect: false,
      loginError: "",
      selectedOption: "",
      url: "",
      signInCounter: localStorage.setItem("signInCounter", 1)
    };
  }

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  };

  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const newUser = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };
    axios
      .post(`${ROOT_URL}/api/users/adduser`, newUser)
      .then(res => {
        // console.log("res", res);
        this.setState({ redirect: true });
      })
      .catch(error => {
        console.log("error", error);
        this.setState({ loginError: error.response.data.error });
      });
  };

  render() {
    // console.log("this.state:", this.state);
    // console.log("this.props:", this.props);

    if (this.state.redirect) {
      console.log("href", window.location.href);
      let newhref = window.location.href;
      let newRedirect = newhref.split("?redirect=")[1];
      console.log("newRedirect", newRedirect);
      return <Redirect to={`/signin/?redirect=${newRedirect}`} />;
    }

    return (
      <div className="signuppage-container">
        <form className="signup-form" onSubmit={this.handleFormSubmit}>
          <div className="signup-title">Sign Up</div>
          <div className="signup-labels">
            <label>Username</label>
            <div>
              <input
                className="username-input"
                type="text"
                value={this.state.username}
                onChange={this.handleUsernameChange}
              />
            </div>
          </div>
          <div className="signup-labels">
            <label>Email </label>
            <div>
              <input
                type="text"
                name="email"
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
            </div>
          </div>
          <div className="signup-labels">
            <label>Password </label>
            <div>
              <input
                type="text"
                name="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
            </div>
          </div>
          <div className="login-error">{this.state.loginError}</div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
  }
}

export default Signup;
