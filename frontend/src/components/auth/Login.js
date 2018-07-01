import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import "../../css/Login.css";

class Login extends Component {
  renderAlert = () => {
    if (!this.props.error) return null;
    return <div className="error">{this.props.error}</div>;
  };

  handleFormSubmit = ({ username, password }) => {
    const { history } = this.props;
    this.props.login(username, password, history);
  };

  render() {
    // console.log("this.state:", this.state);
    // console.log("this.props:", this.props);
    const { handleSubmit } = this.props;

    return (
      <div className="signinpage-container">
        <div className="signin-title">Login</div>
        <form
          className="signin-form"
          onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        >
          <label>Username</label>
          <Field name="username" component="input" type="text" />
          <label>Password</label>
          <Field name="password" component="input" type="text" />
          <button type="submit">Login</button>
          {this.renderAlert()}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log("state", state);
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
