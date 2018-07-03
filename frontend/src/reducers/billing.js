import { USER_BILLED, CHECK_SUBSCRIPTION_ID } from "./actions/decision";

export default (state = {}, action) => {
  switch (action.type) {
    case USER_BILLED:
      return { ...decision, code: action.payload };
    case CHECK_SUBSCRIPTION_ID:
      return { ...decision, hasSubscriptionID: action.payload };
    default:
      return state;
  }
};
