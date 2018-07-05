import { FIND_DECISION, RENDER_DECISION_TAB } from "../actions/decision";

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
    default:
      return state;
  }
};
