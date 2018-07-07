import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { getAnswers, createAnswer } from "../../../actions/decision";

class DecisionPost extends Component {
  componentDidMount() {
    const decisionCode = this.props.decisionCode;
    this.props.getAnswers(decisionCode);
  }

  handleFormSubmit = answer => {
    const decisionCode = this.props.decisionCode;
    this.props.createAnswer(decisionCode, answer);
  };

  render() {
    console.log("this.props", this.props);
    const { handleSubmit } = this.props;

    const answersArray = this.props.answersArray.map(x => x.answerText);
    console.log("answersArray", answersArray);

    return (
      <div className="post-containerg">
        <div className="answers-container">
          {answersArray !== 0 ? (
            <div>
              {answersArray.map((answers, i) => (
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
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <Field name="answer" component="input" type="text" />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return {
    decisionCode: state.decision.data.decisionData.decisionCode,
    answersArray: state.decision.data.decisionData.answers
  };
};

DecisionPost = connect(
  mapStateToProps,
  { getAnswers, createAnswer }
)(DecisionPost);

export default reduxForm({
  form: "answers",
  fields: ["answer"]
})(DecisionPost);
