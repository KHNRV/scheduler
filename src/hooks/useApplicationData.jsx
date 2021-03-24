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

/**
 * This function returns a copy of the state's days object with updated
 * interview spots
 * @param {object} state - The state
 * @param {object} appointments - The new appointments object that will be
 * injected into the state
 * @returns
 */
function spotsRemaining(state, appointments) {
  return state.days.map((day) => {
    const maxAppointments = day.appointments.length;
    const copyDay = { ...day };
    copyDay.spots = day.appointments.reduce((acc, curr) => {
      if (appointments[curr].interview) {
        return acc - 1;
      }
      return acc;
    }, maxAppointments);
    return copyDay;
  });
}

/**
 * Custom hook handling state and interaction with the api routes and the
 * database
 * @returns
 */
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

  /**
   * This function changes the selected day
   * @param {string} day
   */
  function setDay(day) {
    dispatch({ type: SET_DAY, day });
  }

  /**
   * This function create/edit an interview in the database and then reflect
   * that change in the state
   * @param {interger} id - appointment slot id
   * @param {object} interview - interview details to be saved in the appointment slot
   *
   */
  function bookInterview(id, interview) {
    return axios
      .put(`/api/appointments/${id}`, {
        interview,
      })
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview }));
  }
  /**
   * This function deletes an interview in the database and then reflect
   * that change in the state
   * @param {interger} id - appointment slot id
   *
   */
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
