import axios from "axios";

const ROOT_URL = "http://localhost:8000/api";

export const CREATE_DECISION = "CREATE_DECISION";
export const FIND_DECISION = "FIND_DECISION";
export const RENDER_DECISION_TAB = "RENDER_DECISION_TAB";
export const GET_ANSWERS = "GET_ANSWERS";
export const CREATE_ANSWER = "CREATE ANSWER";

const headers = {
  "Content-Type": "application/json",
  Authorization: localStorage.getItem("jwt")
};

export const createDecision = (decisionText, history) => {
  console.log("decision", decisionText);
  return dispatch => {
    axios
      .post(`${ROOT_URL}/create-decision`, { decisionText }, { headers })
      .then(res => {
        // console.log("res", res);
        dispatch({
          type: CREATE_DECISION
        });
        history.push("/decision/" + res.data.decision.decisionCode);
      })
      .catch(error => {
        console.log("error.response " + error.response);
      });
  };
};

export const findDecision = (decisionCode, history) => {
  return dispatch => {
    axios
      .get(`${ROOT_URL}/find-decision/${decisionCode}`, { headers })
      .then(res => {
        // console.log("res.data find-decision", res.data);
        dispatch({
          type: FIND_DECISION,
          payload: res.data.decision
        });
        history.push("/decision/" + decisionCode);
      })
      .catch(error => {
        // console.log("error", error);
      });
  };
};

export const renderDecisionTab = tab => {
  // console.log("tab", tab);
  return {
    type: RENDER_DECISION_TAB,
    payload: tab
  };
};

export const getAnswers = decisionCode => {
  return dispatch => {
    axios
      .get(`${ROOT_URL}/get-answers/${decisionCode}`, { headers })
      .then(res => {
        // console.log("res.data get-answers", res.data);
        dispatch({
          type: GET_ANSWERS,
          payload: res.data
        });
      })
      .catch(error => {
        console.log("error", error.response);
      });
  };
};

export const createAnswer = (decisionCode, answer) => {
  console.log("decisionCode", decisionCode);
  console.log("answer", answer);
  return dispatch => {
    axios
      .put(`${ROOT_URL}/create-answer/${decisionCode}`, answer)
      .then(res => {
        // console.log("res.data", res.data);
        dispatch({
          type: CREATE_ANSWER,
          payload: res.data
        });
      })
      .catch(error => {
        console.log("error.response", error.response);
      });
  };
};
