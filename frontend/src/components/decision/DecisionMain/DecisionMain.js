import React, { Component } from "react";
import { connect } from "react-redux";
import DecisionPost from "./DecisionPost.js";
import DecisionVote from "./DecisionVote.js";
import DecisionReveal from "./DecisionReveal.js";
import { findDecision, renderDecisionTab } from "../../../actions/decision";
// import "../../../css/Decision.css";

class DecisionMain extends Component {
  componentDidMount() {
    const decisionCode = this.props.match.params.id;
    this.props.findDecision(decisionCode);
  }

  onDecisionTabPress = tab => {
    console.log("tab", tab);
    this.props.renderDecisionTab(tab);
  };

  render() {
    console.log("this.props.data", this.props.data);

    if (this.props.data === undefined) {
      return null;
    }
    return (
      <div className="decision-container">
        <div className="decision-title">{this.props.data.decisionText}</div>
        <div className="decision-code">
          <div className="code-title">Share this code</div>
          <div className="code-text"> {this.props.data.decisionCode} </div>
        </div>
        <div className="hr-decisions" />
        <div className="decision-tabs-container">
          <button
            className={
              this.props.activeTab === "post" ? "active-tab" : "inactive-tab"
            }
            onClick={() => this.onDecisionTabPress("post")}
          >
            Post
          </button>
          <button
            className={
              this.props.activeTab === "vote" ? "active-tab" : "inactive-tab"
            }
            onClick={() => this.onDecisionTabPress("vote")}
            // disabled={!(this.state.answersArray || this.state.voteOver)} //answersArray empty, null or lenght 0 is false
          >
            Vote
          </button>

          {/* {this.state.isCreator ? (
            <button
              className={
                this.state.revealIsActive ? "active-tab" : "inactive-tab"
              }
              onClick={this.onRevealButtonClick}
            >
              Reveal
            </button>
          ) : (
            <button
              disabled={!this.state.voteOver}
              className={
                this.state.revealIsActive ? "active-tab" : "inactive-tab"
              }
              onClick={this.onRevealButtonClick}
            >
              Reveal
            </button>
          )} */}
        </div>
        <div className="hr-decisions " />
        {/* {(() => {
          switch (this.state.renderPage) {
            case "post":
              return <DecisionPost />;
            case "vote":
              return <DecisionVote />;
            case "reveal":
              return <DecisionReveal />;
            default:
              return <DecisionPost />;
          }
        })()} */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return {
    auth: state.auth.isLoggedIn,
    data: state.decision.decisionData
  };
};

DecisionMain = connect(
  mapStateToProps,
  { findDecision, renderDecisionTab }
)(DecisionMain);

export default DecisionMain;
