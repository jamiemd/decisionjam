import axios from "axios";

const ROOT_URL = "http://localhost:8000/api";

export const USER_REGISTERED = "USER_REGISTERED";
export const USER_AUTHENTICATED = "USER_AUTHENTICATED";
export const USER_UNAUTHENTICATED = "USER_UNAUTHENTICATED";
export const USER_HAS_SUBSCRIPTION = "USER_HAS_SUBSCRIPTION";

export const signup = (username, email, password) => {
  return dispatch => {
    axios
      .post(`${ROOT_URL}/signup`, { username, email, password })
      .then(res => {
        console.log("res", res);
        dispatch({
          type: USER_REGISTERED
        });
      })
      .catch(error => {
        console.log("error", error);
      });
  };
};

export const login = (username, password) => {
  return dispatch => {
    axios
      .post(`${ROOT_URL}/login`, { username, password })
      .then(res => {
        console.log("res", res);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", res.data.user);
        if (res.data.subscriptionID) {
          dispatch({
            type: USER_AUTHENTICATED
          });
        } else {
          console.log("login error");
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  };
};

export const logout = () => {
  return dispatch => {
    axios
      .get(`${ROOT_URL}/logout`)
      .then(res => {
        console.log("res", res);
        dispatch({
          type: USER_UNAUTHENTICATED
        });
      })
      .catch(error => {
        console.log("error", error);
      });
  };
};

export const authenticate = () => {
  return dispatch => {
    axios
      .get(`${ROOT_URL}/authenticate`)
      .then(res => {
        console.log("res", res);
        dispatch({
          type: USER_AUTHENTICATED
        });
      })
      .catch(error => {
        console.log("error", error);
      });
  };
};
