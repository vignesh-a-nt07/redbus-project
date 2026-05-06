import axios from "axios";
import {
  GET_BUS_DETAILS_FAIL,
  GET_BUS_DETAILS_REQUEST,
  GET_BUS_DETAILS_SUCCESS,
  UPDATE_BOOKING_DETAILS,
} from "./actionTypes";

const busDetailsRequest = () => {
  return {
    type: GET_BUS_DETAILS_REQUEST,
  };
};

const busDetailsSuccess = (payload) => {
  return {
    type: GET_BUS_DETAILS_SUCCESS,
    payload,
  };
};

export const updateBookingDetails = (payload) => {
  return {
    type: UPDATE_BOOKING_DETAILS,
    payload,
  };
};

const busDetailsFail = (message) => {
  return {
    type: GET_BUS_DETAILS_FAIL,
    payload: message,
  };
};

export const getBusDetails = (depart, arrival, date) => (dispatch) => {
  if (!depart || !arrival || !date) {
    return dispatch(
      busDetailsFail("Please provide departure, arrival, and date to search buses.")
    );
  }

  dispatch(busDetailsRequest());
  axios
    .get(
      `${process.env.REACT_APP_BACKEND_URL}/v1/api/routes/${depart}/${arrival}/${date}`
    )
    .then((res) => dispatch(busDetailsSuccess(res.data)))
    .catch((err) => {
      const message =
        err.response?.data?.error ||
        err.response?.statusText ||
        "Something went wrong while searching for buses.";
      dispatch(busDetailsFail(message));
    });
};
