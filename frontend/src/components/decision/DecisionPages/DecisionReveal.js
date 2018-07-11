import React, { Component } from "react";
import { connect } from "react-redux";
import { getAnswers } from "../../../actions/decision";

class DecisionReveal extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.decisionData.decisionCode !==
      this.props.decisionData.decisionCode
    ) {
      const decisionCode = nextProps.decisionData.decisionCode;
      console.log("this.props componentWillReceiveProps nextProps", nextProps);
      this.props.getAnswers(decisionCode);
    }
  }

  render() {
    // console.log("this.props", this.props);
    // console.log("this.state", this.state);

    return (
      <div className="reveal-container">
        <div className="answers-container">
          <div className="reveal-title">We have a winner!</div>
          <div>
            {this.state.answersArray.map((answers, i) => (
              <div className="reveal-answer-container" key={i}>
                <div className="answer-text">{answers.answerText}</div>
                <div className="vote-reveal-totals">
                  {answers.upVotes.length - answers.downVotes.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return {
    decisionData: state.decision
  };
};

DecisionReveal = connect(
  mapStateToProps,
  { getAnswers }
)(DecisionReveal);

export default DecisionReveal;
