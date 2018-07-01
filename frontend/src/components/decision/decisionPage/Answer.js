import React, { Component } from 'react';
import axios from 'axios';
import AnswerList from './AnswerList';
import AnswerForm from './AnswerForm';

class Answers extends Component {
  state = {
    answers: [],
  };

  render() {
    return (
      <div className="Answers">
        <AnswerForm onCreate={this.loadAnswers} />
        <AnswerList
          answers={this.state.answers}
          onDelete={this.removeAnswer}
          onUpdate={this.updateAnswer}
        />
      </div>
    );
  }

  componentDidMount() {
    this.loadAnswers();
  }

  loadAnswers = () => {
    axios
      .get(`http://localhost:5000/api/question/:${questionId}/answers`)
      .then(response => {
        this.setState({
          answers: response.data,
        });
      })
      .catch(() => {
        console.error('error getting data');
      });
  };

  removeAnswer = id => {
    const endpoint = `http://localhost:5000/api/question/:${questionId}/answers/${id}`;
    axios
      .delete(endpoint)
      .then(response => {
        console.log('response from delete', response);
        this.setState({ answers: response.data });
      })
      .catch(() => {
        console.error('error deleting');
      });
  };

  updateAnswer = answer => {
    const endpoint = `http://localhost:5000/api/question/:${questionId}/answers/${answer.id}`;
    return axios
      .put(endpoint, answer)
      .then(response => {
        console.log('response from update', response);
        this.setState({ answers: response.data });
      });
      
  };
}

export default Answers;
