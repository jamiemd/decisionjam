import React, { Component } from "react";
import axios from "axios";

const ROOT_URL = "http://localhost:8000";

class DecisionVote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      answersArray: [],
      maxVotesPerUser: 1,
      decisionCreatorId: "",
      currentLoggedInUserId: "",
      isCreator: false,
      username: "",
      voteOver: false,
      decisionCode: this.props.decisionCode,
      jwtToken: localStorage.getItem("token")
    };
  }

  componentDidMount() {
    const decisionCode = this.state.decisionCode;
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.state.jwtToken
    };
    axios
      .get(`${ROOT_URL}/api/decision/${decisionCode}`, { headers })
      .then(res => {
        console.log("res", res);
        // console.log("res.data.votesByUser", res.data.votesByUser);
        if (res.data.decisionCreatorId === res.data.currentLoggedInUserId) {
          this.setState({ isCreator: true });
        }
        this.setState({
          decision: res.data.decisionText,
          answersArray: res.data.answers,
          maxVotesPerUser: res.data.maxVotesPerUser,
          votesByUser: res.data.votesByUser,
          username: res.data.username,
          voteOver: res.data.voteOver
        });
      })

      .catch(error => {
        this.setState({ error: error.response.data.error });
      });
  }

  handleAnswerInput = e => {
    e.preventDefault();
    this.setState({ newAnswer: e.target.value });
  };

  handleUpvote(answerId, e) {
    this.handleVote("YES", answerId);
  }

  handleDownvote(answerId, e) {
    this.handleVote("NO", answerId);
  }

  handleVote(upOrDown, answerId) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.state.jwtToken
    };
    axios
      .put(
        `${ROOT_URL}/api/decision/answer/${answerId}/vote?vote=${upOrDown}`,
        "",
        { headers }
      )
      .then(res => {
        // console.log("res", res);
        this.setState({
          ...this.state,
          answersArray: res.data.answers,
          votesByUser: res.data.votesByUser
        });
      })
      .catch(error => console.log("error", error.response));
  }

  areVotesDisabled() {
    return this.state.votesByUser >= this.state.maxVotesPerUser;
  }

  sendMaxVotes(newValue) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.state.jwtToken
    };
    // console.log(newValue);
    axios
      .put(
        `${ROOT_URL}/api/decision/${
          this.state.decisionCode
        }/maxVotesPerUser?newValue=${newValue}`,
        {},
        { headers }
      )
      .then(res => {
        console.log("res", res);
        this.setState({});
      })
      .catch(error => console.log("error", error.response));
  }

  onMaxVotesClickDown = () => {
    // const decisionCode = this.state.decisionCode;
    if (this.state.maxVotesPerUser <= 0) {
      return;
    }
    this.setState({ maxVotesPerUser: this.state.maxVotesPerUser - 1 });
    this.sendMaxVotes(this.state.maxVotesPerUser - 1);
  };

  onMaxVotesClickUp = () => {
    // const decisionCode = this.state.decisionCode;
    this.setState({ maxVotesPerUser: this.state.maxVotesPerUser + 1 });
    this.sendMaxVotes(this.state.maxVotesPerUser + 1);
  };

  render() {
    //console.log("this.props", this.props);
    console.log("this.state.voteOver", this.state.voteOver);
    const answersArray = this.state.answersArray.length;

    let allFilteredUsernames = [];
    for (let i = 0; i < this.state.answersArray.length; i++) {
      let filteredUsernames = this.state.answersArray[i].upVotes.filter(
        username => username === this.state.username
      );
      // console.log("filteredUsernames.length", filteredUsernames.length);
      allFilteredUsernames.push(filteredUsernames.length);
    }
    // console.log("allFilteredUsernames", allFilteredUsernames);

    return (
      <div className="post-container">
        <div className="maxvotes-container">
          <div className="maxVotes">
            <div className="maxvotes-description">Max votes per person</div>
            {this.state.isCreator ? (
              <button
                disabled={this.state.voteOver}
                className="maxvotes-button"
                onClick={this.onMaxVotesClickDown}
              >
                -
              </button>
            ) : (
              ""
            )}

            <div className="maxvotes-text">{this.state.maxVotesPerUser}</div>
            {this.state.isCreator ? (
              <button
                disabled={this.state.voteOver}
                className="maxvotes-button"
                onClick={this.onMaxVotesClickUp}
              >
                +
              </button>
            ) : (
              ""
            )}
          </div>
          <div className="hr-decisions " />

          <div className="vote-counts">
            <div className="total-votes-container">Total votes</div>
            <div className="your-votes-container">
              <div className="your-votes-text">Your votes </div>
              <div className="totals">
                {this.state.votesByUser}/{this.state.maxVotesPerUser}
              </div>
            </div>
          </div>
        </div>
        <div className="answers-container">
          {answersArray === 0 ? (
            <div className="no-answer">There are no answers. </div>
          ) : (
            <div>
              {this.state.answersArray.map((answer, i) => (
                <div className="answer-container" key={answer._id}>
                  <div className="answer-text">{answer.answerText}</div>
                  <div className="vote-buttons-container">
                    <button
                      className="vote-button"
                      onClick={this.handleDownvote.bind(this, answer._id)}
                      disabled={
                        this.state.voteOver || this.areVotesDisabled()
                          ? "disabled"
                          : false
                      }
                    >
                      -
                    </button>
                    <div className="answer-vote-number">
                      {allFilteredUsernames[i]}
                    </div>
                    <button
                      className="vote-button"
                      onClick={this.handleUpvote.bind(this, answer._id)}
                      disabled={
                        this.state.voteOver || this.areVotesDisabled()
                          ? "disabled"
                          : false
                      }
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
  }
}

export default DecisionVote;
