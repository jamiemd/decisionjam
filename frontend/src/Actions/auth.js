import axios from "axios";

const ROOT_URL = "http://localhost:8000/api";

export const USER_REGISTERED = "USER_REGISTERED";
export const USER_AUTHENTICATED = "USER_AUTHENTICATED";
export const USER_UNAUTHENTICATED = "USER_UNAUTHENTICATED";
export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";
export const HAS_SUBSCRIPTION = "USER_HAS_SUBSCRIPTION";

export const authError = error => {
  console.log("autherror", error);
  return {
    type: AUTHENTICATION_ERROR,
    payload: error
  };
};

export const signup = (username, email, password, history) => {
  return dispatch => {
    axios
      .post(`${ROOT_URL}/signup`, { username, email, password, history })
      .then(res => {
        console.log("res", res);
        if (res.data.success === true) {
          dispatch({
            type: USER_REGISTERED
          });
          history.push("/login");
        } else {
          dispatch(authError(res.data.message));
        }
      })
      .catch(error => {
        console.log("error", error.response);
        dispatch(authError(error.response.data.error));
      });
  };
};

export const login = (username, password, history) => {
  return dispatch => {
    axios
      .post(`${ROOT_URL}/login`, { username, password, history })
      .then(res => {
        console.log("res", res);
        if (res.data.success === true) {
          dispatch({
            type: USER_AUTHENTICATED
          });
          history.push("/");
          localStorage.setItem("jwt", res.data.token);
        } else {
          dispatch(authError(res.data.message));
        }
      })
      .catch(error => {
        console.log("error", error);
        dispatch(authError(error.response.data.error));
      });
  };
};

export const logout = () => {
  return dispatch => {
    localStorage.removeItem("jwt");
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
  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("jwt")
  };
  return dispatch => {
    axios
      .get(`${ROOT_URL}/authenticate`, { headers })
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
