import {
  USER_REGISTERED,
  USER_AUTHENTICATED,
  USER_UNAUTHENTICATED,
  AUTHENTICATION_ERROR
} from "../actions/auth";

export default (
  auth = {
    isLoggedIn: localStorage.getItem("jwt") ? true : false
  },
  action
) => {
  switch (action.type) {
    case USER_REGISTERED:
      return { ...auth, isRegistered: true };
    case USER_AUTHENTICATED:
      return { ...auth, isLoggedIn: true };
    case USER_UNAUTHENTICATED:
      return { ...auth, isLoggedIn: false };
    case AUTHENTICATION_ERROR:
      return { ...auth, error: action.payload };
    default:
      return auth;
  }
};
