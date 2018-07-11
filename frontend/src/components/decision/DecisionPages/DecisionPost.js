import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { getAnswers, postAnswer } from "../../../actions/decision";

class DecisionPost extends Component {
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

  handleFormSubmit = answer => {
    const decisionCode = this.props.decisionData.decisionCode;
    this.props.postAnswer(decisionCode, answer);
  };

  render() {
    console.log("this.props", this.props);
    const { handleSubmit } = this.props;

    console.log("this.props.decisionData", this.props.decisionData);

    let answersArray;

    if (this.props.decisionData.answers) {
      const answersArray = this.props.decisionData.answers.map(
        x => x.answerText
      );
      console.log("answersArray", answersArray);

      return (
        <div className="post-container">
          <div className="answers-container">
            {answersArray.length !== 0 ? (
              <div>
                {answersArray.map((answer, i) => (
                  <div className="answer-container" key={i}>
                    <div className="answer-text">{answer}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-answer">Suggest an answer</div>
            )}
          </div>
          <div className="hr-decisions " />
          <div className="answer-form-container">
            <form
              name="post-answer"
              onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
            >
              <Field name="answer" component="input" type="text" />
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

const mapStateToProps = state => {
  console.log("state", state);
  return {
    decisionData: state.decision.decision
  };
};

DecisionPost = connect(
  mapStateToProps,
  { getAnswers, postAnswer }
)(DecisionPost);

export default reduxForm({
  form: "post-answer",
  fields: ["answer"]
})(DecisionPost);
