import React, { Component } from "react";
import axios from "axios";

const ROOT_URL = "http://localhost:8000";

class DecisionPost extends Component {
  constructor(props) {
    // console.log("props", props);
    super(props);
    this.state = {
      answersArray: [],
      newAnswer: "",
      didFetchResultFromServer: false,
      decisionCode: this.props.decisionCode,
      jwtToken: localStorage.getItem("token")
    };
  }

  // auto load answers from database
  componentDidMount() {
    const decisionCode = this.state.decisionCode;
    // console.log("this.state", this.state);
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.state.jwtToken
    };

    axios
      .get(`${ROOT_URL}/api/decision/decisionCode/${decisionCode}`, { headers })
      .then(res => {
        // console.log("res.data", res.data);
        this.setState({
          // decision: res.data[0].decisionText,
          didFetchResultFromServer: true,
          answersArray: res.data.answers.map(x => x.answerText)
        });
        // console.log("this.state.answersArray", this.state.answersArray);
      })
      .catch(error => {
        // console.log("error", error);
        this.setState({ didFetchResultFromServer: true });
      });
    // console.log("answersArray,", this.state.answersArray);
  }

  handleAnswerInput = e => {
    e.preventDefault();
    this.setState({ newAnswer: e.target.value });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const decisionCode = this.state.decisionCode;
    const answersObject = { answer: this.state.newAnswer };
    console.log(answersObject);
    // const newAnswersArray = this.state.answersArray;
    // newAnswersArray.push(answersObject);
    this.setState({
      newAnswer: ""
    });

    // use decisionCode to save answers in the database
    axios
      .put(`${ROOT_URL}/api/decision/${decisionCode}/answer`, answersObject)
      .then(res => {
        console.log("res.data", res.data);

        this.setState({
          answersArray: res.data.answers.map(x => x.answerText)
        });
      })
      .catch(error => {
        console.log("error.response", error.response);
      });
  };

  render() {
    // console.log("this.props", this.props);
    // console.log("this.state", this.state);
    // console.log("this.state.answersArray", this.state.answersArray);

    const answersArray = this.state.answersArray.length;

    if (this.state.didFetchResultFromServer) {
      return (
        <div className="post-container">
          <div className="answers-container">
            {answersArray !== 0 ? (
              <div>
                {this.state.answersArray.map((answers, i) => (
                  <div className="answer-container" key={i}>
                    <div className="answer-text">{answers}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-answer">Suggest an answer</div>
            )}
          </div>
          <div className="hr-decisions " />
          <div className="answer-form-container">
            <form onSubmit={this.handleFormSubmit}>
              <input
                type="text"
                className="answer-input"
                placeholder="Suggest an answer..."
                value={this.state.newAnswer}
                onChange={this.handleAnswerInput}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default DecisionPost;
