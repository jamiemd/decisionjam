import axios from "axios";

const ROOT_URL = "http://localhost:8000/api";

export const CREATE_DECISION = "CREATE_DECISION";
export const FIND_DECISION = "FIND_DECISION";

export const createDecision = decision => {
  return dispatch => {
    axios
      .post(`${ROOT_URL}/api/decision/create`, decision)
      .then(decision => {
        console.log("decision", decision);
        this.setState({ decisionCode: decision.data.decision.decisionCode });
        this.props.history.push(
          "/decision/decisionCode/" + this.state.decisionCode
        );
      })
      .catch(error => console.log("Got error " + error.response.data.error));
  };
};

export const findDecision = code => {
  return dispatch => {
    axios
      .get(`${ROOT_URL}/api/find-decision`, { code })
      .then(res => {
        console.log("res.data", res.data);
        dispatch({ type: FIND_DECISION });
      })
      .catch(error => {
        console.log("error", error);
      });
  };
};
