import React, { Component } from "react";
import axios from "axios";

const ROOT_URL = "http://localhost:8000";

class DecisionReveal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answersArray: [],
      newAnswer: "",
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
        console.log("res.data", res.data);
        this.setState({
          answersArray: res.data.answers
        });
      })
      .catch(error => {
        console.log("erorr", error);
        // this.setState({ decision: error.response.data.error });
      });
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
              <div className="answer-container" key={i}>
                <div className="answer-text">{answers.answerText}</div>
                <div className="answer-text">
                  {answers.downVotes.length - answers.upVotes.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default DecisionReveal;
