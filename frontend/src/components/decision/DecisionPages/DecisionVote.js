import React, { Component } from "react";
import { connect } from "react-redux";
import {
  findDecision,
  getAnswers,
  handleVote,
  setMaxVotes
} from "../../../actions/decision";

class DecisionVote extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.decisionData.decisionCode !==
      this.props.decisionData.decisionCode
    ) {
      const decisionCode = nextProps.decisionData.decisionCode;
      console.log("this.props componentWillReceiveProps nextProps", nextProps);
      this.props.getAnswers(decisionCode);
      this.props.findDecision(decisionCode);
    }
  }

  handleVote = (vote, answerId) => {
    this.props.handleVote(vote, answerId);
  };

  setMaxVotes = plusOrMinus => {
    const decisionCode = this.props.decisionData.decisionCode;
    this.props.setMaxVotes(plusOrMinus, decisionCode);
  };

  render() {
    console.log("this.props", this.props);
    console.log("this.props.decisionData", this.props.decisionData);
    // const answersArray = this.props.decisionData.answers.length;

    if (this.props.decisionData.answers) {
      const answersArray = this.props.decisionData.answers.map(
        x => x.answerText
      );
      return (
        <div className="post-container">
          <div className="maxvotes-container">
            <div className="maxVotes">
              <div className="maxvotes-description">Max votes per person</div>
              {this.props.isCreator ? (
                <button
                  // disabled={this.props.voteOver}
                  className="maxvotes-button"
                  onClick={() => this.setMaxVotes("minus")}
                >
                  -
                </button>
              ) : (
                ""
              )}
              <div className="maxvotes-text">
                {this.props.decisionData.maxVotes}
              </div>
              {this.props.isCreator ? (
                <button
                  // disabled={this.props.voteOver}
                  className="maxvotes-button"
                  onClick={() => this.setMaxVotes("plus")}
                >
                  +
                </button>
              ) : (
                ""
              )}
            </div>
            <div className="hr-decisions " />

            <div className="vote-counts">
              <div className="total-votes-container">
                <div>Total votes</div>
                {/* <div className="totals">{totalVotes}</div> */}
              </div>
              <div className="your-votes-container">
                <div className="your-votes-text">Your votes </div>
                <div className="totals">
                  {/* {this.props.votesByUser}/{this.props.maxVotesPerUser} */}
                </div>
              </div>
            </div>
          </div>
          <div className="answers-container">
            {answersArray === 0 ? (
              <div className="no-answer">There are no answers. </div>
            ) : (
              <div>
                {this.props.decisionData.answers.map((answer, i) => (
                  <div className="answer-container" key={answer._id}>
                    <div className="answer-text">{answer.answerText}</div>
                    <div className="vote-buttons-container">
                      <button
                        className="vote-button"
                        onClick={() => this.handleVote("minus", answer._id)}
                      >
                        -
                      </button>
                      <div className="answer-vote-number">
                        {this.props.decisionData.maxVotes}
                      </div>
                      <button
                        className="vote-button"
                        onClick={() => this.handleVote("plus", answer._id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return {
    decisionData: state.decision.decision,
    isCreator: state.decision.isCreator,
    votes: state.decision.decision.answers
  };
};

DecisionVote = connect(
  mapStateToProps,
  { findDecision, getAnswers, handleVote, setMaxVotes }
)(DecisionVote);

export default DecisionVote;
