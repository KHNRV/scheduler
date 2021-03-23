import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import useWebSockets from "./useWebSocket";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day };
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      };
    case SET_INTERVIEW: {
      const appointment = {
        ...state.appointments[action.id],
        interview: action.interview,
      };
      const appointments = {
        ...state.appointments,
        [action.id]: appointment,
      };
      const days = spotsRemaining(state, appointments);
      return { ...state, appointments, days };
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

function spotsRemaining(state, appointments) {
  return state.days.map((day) => {
    const copyDay = { ...day };
    copyDay.spots = day.appointments.reduce((acc, curr) => {
      if (appointments[curr].interview) {
        return acc - 1;
      }
      return acc;
    }, 5);
    return copyDay;
  });
}

export const useApplicationData = () => {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ])
      .then((all) => {
        dispatch({
          type: SET_APPLICATION_DATA,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        });
      })
      .catch((err) => err);
  }, []);

  useWebSockets(dispatch);

  function setDay(day) {
    dispatch({ type: SET_DAY, day });
  }

  function bookInterview(id, interview) {
    return axios
      .put(`/api/appointments/${id}`, {
        interview,
      })
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview }));
  }

  function cancelInterview(id) {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null }));
  }
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
};
