import {
  USER_REGISTERED,
  USER_AUTHENTICATED,
  USER_UNAUTHENTICATED
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
      return { ...auth, isAuthenticated: true };
    case USER_UNAUTHENTICATED:
      return { ...auth, isAuthenticated: false };
    default:
      return auth;
  }
};
