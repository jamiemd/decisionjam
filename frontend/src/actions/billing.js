import axios from "axios";

const ROOT_URL = "http://localhost:8000/api";

export const USER_BILLED = "USER_BILLED";

export const chargeCard = () => {
  return dispatch => {
    axios.post(`${ROOT_URL}/api/payment`).then(res => {
      console.log("res", res);
      dispatch({
        type: USER_CHARGED
      });
    });
  };
};
