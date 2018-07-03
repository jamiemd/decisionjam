import { FIND_DECISION } from "./actions/decision";

export default (state = {}, action) => {
  switch (action.type) {
    case FIND_DECISION:
      return { ...decision, code: action.payload };
    default:
      return state;
  }
};
