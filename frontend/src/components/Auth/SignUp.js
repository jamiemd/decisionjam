import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { signup } from "../../actions/auth";
import "../../css/SignUp.css";

class SignUp extends Component {
  renderAlert = () => {
    if (!this.props.error) return null;
    return <div className="error">{this.props.error}</div>;
  };

  handleFormSubmit = ({ username, email, password }) => {
    this.props.signup(username, email, password);
  };

  render() {
    // console.log("this.state:", this.state);
    // console.log("this.props:", this.props);
    const { handleSubmit } = this.props;

    return (
      <div className="signup-container">
        <form
          className="signup-form"
          onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        >
          <div className="signup-title">Sign Up</div>
          <label> Username</label>
          <Field name="username" component="input" type="text" />
          <label> Email</label>
          <Field name="email" component="input" type="text" />
          <label> Password</label>
          <Field name="password" component="input" type="text" />
          <button type="submit">Sign Up</button>
          {this.renderAlert()}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return {
    error: state.auth.error,
    registered: state.auth.registered
  };
};

SignUp = connect(
  mapStateToProps,
  { signup }
)(SignUp);

export default reduxForm({
  form: "signup",
  fields: ["username", "email", "password"]
})(SignUp);
