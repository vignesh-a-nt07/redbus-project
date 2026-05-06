import * as actionTypes from "./actionTypes";
import axios from "axios";

export const loginSuccess = (user) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    payload: user,
  };
};

export const loginFailure = (error) => {
  return {
    type: actionTypes.LOGIN_FAILURE,
    payload: error,
  };
};

export const logout = () => {
  return {
    type: actionTypes.LOGOUT,
  };
};

const addCustomerMongoRequest = () => ({
  type: actionTypes.ADD_CUSTOMER_MONGO_REQUEST,
});

const addCustomerMongoSuccess = (id) => ({
  type: actionTypes.ADD_CUSTOMER_MONGO_SUCCESS,
  payload: id,
});

const addCustomerMongoFailure = () => ({
  type: actionTypes.ADD_CUSTOMER_MONGO_FAILURE,
});

export const addCustomerMongo = (user) => {
  return async (dispatch) => {
    dispatch(addCustomerMongoRequest());
    try {
const name =
      user.name ||
      `${user.given_name || ""} ${user.family_name || ""}`.trim() ||
      "Google User";

    const customer = {
      name,
        email: user.email,
        googleId: user.sub,
        profilePicture: user.picture,
      };

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/customers`,
        customer
      );

      dispatch(addCustomerMongoSuccess(res.data._id));
    } catch (err) {
      console.error("Failed to save customer to MongoDB:", err);
      dispatch(addCustomerMongoFailure());
    }
  };
};