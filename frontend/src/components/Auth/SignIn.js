import React, { Component } from "react";
import "./SignIn.css";

class Login extends Component {
  handleFormSubmit = (username, password) => {
    this.props.login(username, password);
  };

  render() {
    // console.log("this.state:", this.state);
    // console.log("this.props:", this.props);

    return (
      <div className="signinpage-container">
        <div className="signin-title">Sign In</div>
        <form className="signin-form" onSubmit={this.handleFormSubmit}>
          <label>Username</label>
          <Field name="username" component="input" type="text" />
          <label>Email</label>
          <Field name="email" component="input" type="text" />
          <label>Password</label>
          <Field name="password" component="input" type="text" />
          <button type="submit">Sign In</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    error: state.auth.error
  };
};

Login = connect(
  mapStateToProps,
  { login }
)(Login);

export default reduxForm({
  form: "login",
  fields: ["username,", "email", "password"]
})(Login);
