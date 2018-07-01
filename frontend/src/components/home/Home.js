import React, { Component } from "react";
import { Link } from "react-router-dom";
import appImage from "./decisionjam-screenshot.png";
import FindDecision from "../decision/FindDecision";
import { connect } from "react-redux";
import "../../css/Home.css";

class Home extends Component {
  render() {
    if (this.props.isLoggedIn) {
      return <FindDecision />;
    } else {
      return (
        <div className="landing">
          <div className="image-container">
            <div className="description-container">
              <div className="slogan">Make decisions faster</div>
              <div className="description">
                Decision Jam allows teams to make decisions quickly. Team
                members can create questions, provide answers, and vote on
                proposed answers.
              </div>
              <div className="buy-container">
                <Link className="buy" to="/billing">
                  BUY NOW
                </Link>
              </div>
              <div className="or">OR</div>
              <div className="freeuser-container">
                <Link
                  className="freeuser"
                  to="/signup"
                  onClick={this.onFreeUserButtonClick}
                >
                  Sign Up As A Free User
                </Link>
              </div>
            </div>

            <div>
              <img className="image" alt="logo" src={appImage} />
            </div>
          </div>
          <div className="hr-landing" />

          <div className="pricing-container">
            <div name="Pricing" className="pricing-title">
              Pricing Plans
            </div>
            <div className="pricing-options">
              <div className="options">
                <h1>Unlimited</h1>
                <div>Decisions and Voters</div>
                <h3>$5</h3>
                <p>Monthly</p>
                <div className="buy-container pricing-buy">
                  <Link className="buy" to="/billing/Monthly">
                    BUY NOW
                  </Link>
                </div>
              </div>
              <div className="options">
                <h1>Unlimited</h1>
                <div>Decisions and Voters</div>

                <h3>$20</h3>
                <p>6 Months</p>
                <div className="buy-container pricing-buy">
                  <Link className="buy" to="/billing/HalfYearly">
                    BUY NOW
                  </Link>
                </div>
              </div>
              <div className="options">
                <h1>Unlimited</h1>
                <div>Decisions and Voters</div>

                <h3>$50</h3>
                <p>1 Year</p>
                <div className="buy-container pricing-buy">
                  <Link className="buy" to="/billing/Yearly">
                    BUY NOW
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="footer">DecisionJam 2018</div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return {
    isLoggedIn: state
  };
};

export default connect(mapStateToProps)(Home);
