import axios from "axios";

const ROOT_URL = "http://localhost:8000/api";

export const CREATE_DECISION = "CREATE_DECISION";
export const FIND_DECISION = "FIND_DECISION";
export const RENDER_DECISION_TAB = "RENDER_DECISION_TAB";
export const GET_ANSWERS = "GET_ANSWERS";
export const POST_ANSWER = "POST_ANSWER";
export const HANDLE_VOTE = "HANDLE_VOTE";
export const SET_MAX_VOTES = "SET_MAX_VOTES";

const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("jwt")
  };
  return headers;
};

export const createDecision = (decisionText, history) => {
  const headers = getHeaders();
  console.log("headers", headers);
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
  const headers = getHeaders();

  return dispatch => {
    axios
      .get(`${ROOT_URL}/find-decision/${decisionCode}`, { headers })
      .then(res => {
        console.log("res.data find-decision", res.data);
        dispatch({
          type: FIND_DECISION,
          payload: res.data
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
  const headers = getHeaders();
  console.log("get answers called");
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

export const postAnswer = (decisionCode, answer) => {
  console.log("decisionCode", decisionCode);
  console.log("answer", answer);
  return dispatch => {
    axios
      .put(`${ROOT_URL}/post-answer/${decisionCode}`, answer)
      .then(res => {
        console.log("res.data", res.data);
        dispatch({
          type: POST_ANSWER,
          payload: res.data
        });
      })
      .catch(error => {
        console.log("error.response", error.response);
      });
  };
};

export const handleVote = (vote, answerId) => {
  // console.log("vote", vote);
  // console.log("answerId", answerId);
  const headers = getHeaders();

  const voteData = {
    vote,
    answerId
  };
  return dispatch => {
    axios
      .put(`${ROOT_URL}/handleVote`, { voteData }, { headers })
      .then(res => {
        // console.log("res", res);
        dispatch({
          type: HANDLE_VOTE,
          payload: res.data
        });
      })
      .catch(error => {
        console.log("error", error);
      });
  };
};

export const setMaxVotes = (plusOrMinus, decisionCode) => {
  const headers = getHeaders();
  console.log("setMaxVotes called and headers", headers);
  return dispatch => {
    axios
      .put(
        `${ROOT_URL}/set-maxVote/${decisionCode}`,
        { plusOrMinus },
        { headers }
      )
      .then(res => {
        console.log("res", res);
        dispatch({
          type: SET_MAX_VOTES,
          payload: res.data
        });
      })
      .catch(error => {
        console.log("error", error.response);
      });
  };
};
