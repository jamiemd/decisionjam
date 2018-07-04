import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import reducers from "./reducers";
import App from "./App";
import "./index.css";

const createStoreWtihMiddleware = applyMiddleware(ReduxThunk)(createStore);

ReactDOM.render(
  <Provider store={createStoreWtihMiddleware(reducers)}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
