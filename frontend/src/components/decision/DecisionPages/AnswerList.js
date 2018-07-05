import React from "react";

class Answer extends React.Component {
  state = {
    isloggedIn: false,
    isAdmin: false,
    isVoting: true,
    answerText: ""
  };

  render() {
    const answer = this.props.answer;
    const editing = this.state.editing;

    return (
      <li>
        <button
          onClick={() => {
            this.props.updateAnswer(answer.votes + 1);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            this.props.updateAnswer(answer.votes - 1);
          }}
        >
          -
        </button>
        <button
          onClick={() => {
            this.props.onDelete(answer.id);
          }}
        >
          X
        </button>
        {editing === true ? (
          <div>
            <input
              type="text"
              value={this.state.answerText}
              onChange={this.handleNameChange}
            />
            <button className="save-btn" onClick={this.updateAnswer}>
              Save
            </button>
          </div>
        ) : (
          <div onClick={this.toggleEditing} style={{ flex: "1" }}>
            {answer.name}
          </div>
        )}
      </li>
    );
  }

  componentDidMount() {
    this.setState({ answerText: this.props.answer.answerText });
  }

  handleNameChange = event => {
    const value = event.target.value;

    this.setState({ answerText: value });
  };

  updateAnswer = () => {
    const newAnswer = { ...this.props.answer, name: this.state.answerText };
    this.props
      .onUpdate(newAnswer)
      .then(() => {
        this.setState({ editing: false });
      })
      .catch(() => {
        console.error("update failed");
      });
  };

  toggleEditing = () => {
    this.setState(prevState => {
      return {
        editing: !prevState.editing
      };
    });
  };
}

function AnswerList(props) {
  return (
    <div>
      <div>
        <ul>
          {props.answers.map(answer => {
            return <li key={answer._id}>{answer.answerText}</li>;
          })}
        </ul>
      </div>
    </div>
    // <ul>
    //   {props.answers.map(answer => {
    //     return (
    //       <Answer
    //         key={answer.id}
    //         answer={answer}
    //         onDelete={props.onDelete}
    //         onUpdate={props.onUpdate}
    //       />
    //     );
    //   })}
    // </ul>
  );
}

AnswerList.defaultProps = {
  answers: []
};

export default AnswerList;
