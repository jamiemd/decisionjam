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
  // console.log("action", action);
  switch (action.type) {
    case FIND_DECISION:
      return { ...state, ...action.payload };
    case RENDER_DECISION_TAB:
      return { ...state, activeTab: action.payload };
    case GET_ANSWERS:
      return { ...state, ...action.payload };
    case CREATE_ANSWER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
