import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./SignIn.css";
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
      subscriptionID: false,
      signInCounter: localStorage.getItem("signInCounter")
    };
  }

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const User = {
      username: this.state.username,
      password: this.state.password
    };
    axios
      .post(`${ROOT_URL}/api/login`, User)
      .then(res => {
        console.log("res.data", res);
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", res.data.user);
          if (res.data.subscriptionID) {
            this.setState({ redirect: true, subscriptionID: true });
          } else {
            this.setState({ redirect: true, subscriptionID: false });
          }
        } else {
          console.log("login error", this.state.loginError);
          this.setState({ loginError: res.data.msg });
        }
      })
      .catch(error => {
        console.log("error", error.response);
        this.setState({ loginError: error.response.data.error });
      });
  };

  render() {
    console.log("this.state:", this.state);
    // console.log("this.props:", this.props);

    if (this.state.redirect) {
      // if there is a subscription ID, go to landing page

      if (this.state.signInCounter === null) {
        return <Redirect to="/mainpage" />;
      } else {
        // console.log("redirect");
        const getQueryString = (field, url) => {
          let href = url ? url : window.location.href;
          let reg = new RegExp("[?&]" + field + "=([^&#]*)", "i");
          let string = reg.exec(href);
          console.log("string", string);
          return string ? string[1] : null;
        };
        let redirect = getQueryString("redirect");
        // console.log("redirect", redirect);

        localStorage.removeItem("signInCounter");
        console.log(localStorage.getItem("signInCounter"));
        // go to billing page
        if (redirect === "undefined" || redirect === null) {
          return <Redirect to="/billing" />;
        } else {
          return <Redirect to={redirect} />;
        }
      }
    }

    return (
      <div className="signinpage-container">
        <form className="signin-form" onSubmit={this.handleFormSubmit}>
          <div className="signin-labels">
            <label>Username</label>
            <div>
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleUsernameChange}
              />
            </div>
          </div>
          <div className="signin-labels">
            <label>Password</label>
            <div>
              <input
                type="text"
                name="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
            </div>
          </div>

          <div>
            <div className="login-error">{this.state.loginError}</div>
          </div>
          <button type="submit">Sign In</button>
        </form>
      </div>
    );
  }
}

export default Signup;
