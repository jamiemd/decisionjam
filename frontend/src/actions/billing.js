import axios from "axios";

const ROOT_URL = "http://localhost:8000/api";

export const USER_BILLED = "USER_BILLED";
export const CHECK_SUBSCRIPTION_ID = "CHECK_SUBSCRIPTION_ID";

export const chargeCard = () => {
  return dispatch => {
    axios.post(`${ROOT_URL}/api/payment`).then(res => {
      console.log("res", res);
      dispatch({
        type: USER_BILLED
      });
    });
  };
};

export const checkSubscriptionID = () => {
  return dispatch => {
    axios
      .get(`${ROOT_URL}/api/subscriptionID`)
      .then(res => {
        dispatch({
          type: CHECK_SUBSCRIPTION_ID
        });
        console.log("res", res);
        if (res.data.subscription && res.data.subscription.subscriptionID) {
          this.setState({ hasSubscriptionID: true });
        } else {
          this.setState({ hasSubscriptionID: false });
        }
      })
      .catch(error => {
        console.log("error", error.response);
      });
  };
};
