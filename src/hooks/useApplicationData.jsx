import axios from "axios";
import { useEffect, useState } from "react";

export const useApplicationData = () => {
  const [state, setState] = useState({
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
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  const setDay = (day) => setState({ ...state, day });

  const spotsRemaining = (doIncrement) => {
    return state.days.map((day) => {
      const copyDay = { ...day };
      if (day.name === state.day) {
        doIncrement ? copyDay.spots++ : copyDay.spots--;
      }
      return copyDay;
    });
  };

  const bookInterview = (id, interview) => {
    const days = spotsRemaining(false);

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios({
      method: "PUT",
      url: `/api/appointments/${id}`,
      data: {
        interview,
      },
    }).then(() => setState({ ...state, appointments, days }));
  };

  const cancelInterview = (id) => {
    const days = spotsRemaining(true);

    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios({
      method: "DELETE",
      url: `/api/appointments/${id}`,
    }).then(() => setState({ ...state, appointments, days }));
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
};
