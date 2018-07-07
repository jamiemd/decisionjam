import {
  FIND_DECISION,
  RENDER_DECISION_TAB,
  GET_ANSWERS,
  CREATE_ANSWER
} from "../actions/decision";

const initialState = {
  activeTab: "post"
};

export default (state = initialState, action) => {
  console.log("action.payload", action.payload);
  switch (action.type) {
    case FIND_DECISION:
      return { ...state, data: action.payload };
    case RENDER_DECISION_TAB:
      return { ...state, activeTab: action.payload };
    case GET_ANSWERS:
      return { ...state, answers: action.payload };
    case CREATE_ANSWER:
      return { ...state, decisionData: action.payload };
    default:
      return state;
  }
};
