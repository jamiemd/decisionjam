import axios from "axios";

const ROOT_URL = "http://localhost:8000/api";

export const CREATE_DECISION = "CREATE_DECISION";
export const FIND_DECISION = "FIND_DECISION";
export const RENDER_DECISION_TAB = "RENDER_DECISION_TAB";

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
        console.log("res", res);
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
  console.log("decisionCode", decisionCode);
  return dispatch => {
    axios
      .get(`${ROOT_URL}/find-decision/${decisionCode}`, { headers })
      .then(res => {
        console.log("res.data", res.data);
        dispatch({
          type: FIND_DECISION,
          payload: res.data
        });
        history.push("/decision" + decisionCode);
      })
      .catch(error => {
        console.log("error", error);
      });
  };
};

export const renderDecisionTab = tab => {
  console.log("tab", tab);
  return {
    type: RENDER_DECISION_TAB,
    payload: tab
  };
};
