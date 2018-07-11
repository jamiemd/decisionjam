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

  setMaxVotes = maxVotes => {
    const decisionCode = this.props.decisionData.decision.decisionCode;
    this.props.setMaxVotes(maxVotes, decisionCode);
  };

  render() {
    console.log("this.props", this.props);
    // const answersArray = this.props.decisionData.answers.length;

    if (this.props.decisionData.decision.answers) {
      const answersArray = this.props.decisionData.decision.answers.map(
        x => x.answerText
      );
      return (
        <div className="post-container">
          <div className="maxvotes-container">
            <div className="maxVotes">
              <div className="maxvotes-description">Max votes per person</div>
              {this.props.decisionData.isCreator ? (
                <button
                  // disabled={this.props.voteOver}
                  className="maxvotes-button"
                  onClick={() => this.setMaxVotes(-1)}
                >
                  -
                </button>
              ) : (
                ""
              )}
              <div className="maxvotes-text">
                {this.props.decisionData.decision.maxVotesPerUser}
              </div>
              {this.props.decisionData.isCreator ? (
                <button
                  // disabled={this.props.voteOver}
                  className="maxvotes-button"
                  onClick={() => this.setMaxVotes(1)}
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
                {this.props.decisionData.decision.answers.map((answer, i) => (
                  <div className="answer-container" key={answer._id}>
                    <div className="answer-text">{answer.answerText}</div>
                    <div className="vote-buttons-container">
                      <button
                        className="vote-button"
                        onClick={this.handleVote("down", answer._id)}
                        // disabled={
                        //   this.props.voteOver || this.areVotesDisabled()
                        //     ? "disabled"
                        //     : false
                        // }
                      >
                        -
                      </button>
                      <div className="answer-vote-number">
                        {/* {allFilteredUsernamesUpVotes[i] -
                        allFilteredUsernamesDownVotes[i]} */}
                      </div>
                      <button
                        className="vote-button"
                        onClick={this.handleVote("up", answer._id)}
                        // disabled={
                        //   this.props.voteOver || this.areVotesDisabled()
                        //     ? "disabled"
                        //     : false
                        // }
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
    decisionData: state.decision
  };
};

DecisionVote = connect(
  mapStateToProps,
  { findDecision, getAnswers, handleVote, setMaxVotes }
)(DecisionVote);

export default DecisionVote;
