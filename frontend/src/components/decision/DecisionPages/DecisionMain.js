import React, { Component } from "react";
import { connect } from "react-redux";
import DecisionPost from "./DecisionPost.js";
import DecisionVote from "./DecisionVote.js";
import DecisionReveal from "./DecisionReveal.js";
import { findDecision, renderDecisionTab } from "../../../actions/decision";
// import "../../../css/Decision.css";

class DecisionMain extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const decisionCode = this.props.match.params.id;
    this.props.findDecision(decisionCode);
  }

  onDecisionTabPress = tab => {
    console.log("tab", tab);
    this.props.renderDecisionTab(tab);
  };

  renderSwitch = () => {
    switch (this.props.activeTab) {
      case "post":
        return <DecisionPost />;
      case "vote":
        return <DecisionVote />;
      case "reveal":
        return <DecisionReveal />;
      default:
        return <DecisionPost />;
    }
  };

  render() {
    console.log("this.props", this.props);

    // if (this.props.isLoggedIn === false) {
    //   return <Home />;
    // }
    if (this.props.decisionData === undefined) {
      return null;
    } else
      return (
        <div className="decision-container">
          <div className="decision-title">
            {this.props.decisionData.decisionData.decisionText}
          </div>
          <div className="decision-code">
            <div className="code-title">Share this code</div>
            <div className="code-text">
              {this.props.decisionData.decisionData.decisionCode}{" "}
            </div>
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
            {this.props.decisionData.isCreator ? (
              <button
                className={
                  this.props.decisionData.activeTab
                    ? "active-tab"
                    : "inactive-tab"
                }
                onClick={this.onRevealButtonClick}
              >
                Reveal
              </button>
            ) : (
              <button
                disabled={!this.props.decisionData.voteOver}
                className={
                  this.props.decisionData.activeTab
                    ? "active-tab"
                    : "inactive-tab"
                }
                onClick={this.onRevealButtonClick}
              >
                Reveal
              </button>
            )}
          </div>
          <div className="hr-decisions " />
          {this.renderSwitch()}
        </div>
      );
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return {
    auth: state.auth.isLoggedIn,
    activeTab: state.decision.activeTab,
    decisionData: state.decision.data
  };
};

DecisionMain = connect(
  mapStateToProps,
  { findDecision, renderDecisionTab }
)(DecisionMain);

export default DecisionMain;
