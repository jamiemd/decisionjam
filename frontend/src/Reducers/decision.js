import { FIND_DECISION, RENDER_DECISION_TAB } from "../actions/decision";

export default (state = {}, action) => {
  console.log("action.payload", action.payload);
  switch (action.type) {
    case FIND_DECISION:
      return { ...state, decisionData: action.payload };
    case RENDER_DECISION_TAB:
      return { ...state, activeTab: action.payload };
    default:
      return state;
  }
};
