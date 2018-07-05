import React from 'react';
import axios from 'axios';

class AnswerForm extends React.Component {
  state = {
    answerText: '',



    
  };
  apiUrl = "http://localhost:5000/api/question/"

  render() {
    return (
      <form onSubmit={this.submitHandler} className="form">

        <input
          type="text"
          name="answerText"
          value=""
          onChange={this.handleInputChange}
        />
        
        <button type="submit">+</button>
      </form>
    );
  }

  submitHandler = event => {
    event.preventDefault();

    axios
      .put(this.apiUrl +props.questionId + "/answer", this.state)
      .then(response => {
        console.log('response from post', response);
        this.setState({
          answerText: ''
        });
        this.props.onCreate();
      })
      .catch(error => {
        console.error('error saving the data');
      });
  };

  handleInputChange = event => {
    // const { name, value } = event.target; // destructuring

    const name = event.target.name;
    let value = event.target.value;

    if (event.target.type === 'number') {
      value = Number(value);
    }
    this.setState({ [name]: value });
  };
}

export default AnswerForm;
