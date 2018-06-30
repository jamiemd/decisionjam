import { combineReducers } from "redux";
import authReducer from "./auth";
import decisionReducer from "./decision";
import { reducer as formReducer } from "redux-form";

const rootReducer = combineReducers({
  auth: authReducer,
  decision: decisionReducer,
  form: formReducer
});

export default rootReducer;
