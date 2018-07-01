import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { StripeProvider } from "react-stripe-elements";
import Home from "./components/home/Home";
import Navigation from "./components/home/Navigation";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import Billing from "./components/billing/Billing";
import CreateDecision from "./components/decision/CreateDecision";
import FindDecision from "./components/decision/FindDecision";
// import Decision from "./components/decision/decisionPage/Decision";
import "./App.css";

class App extends Component {
  render() {
    return (
      <StripeProvider apiKey="pk_test_zwL3UU7M5FXPJkHognp6dYFr">
        <BrowserRouter>
          <div className="App">
            <Navigation />
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Home} />
            <Route exact path="/billing/:id" component={Billing} />
            <Route exact path="/billing" component={Billing} />
            <Route exact path="/create-decision" component={CreateDecision} />
            <Route exact path="/find-decision" component={FindDecision} />
            {/* <Route path="/decision/decisionCode/:id" component={Decision} /> */}
          </div>
        </BrowserRouter>
      </StripeProvider>
    );
  }
}

export default App;
