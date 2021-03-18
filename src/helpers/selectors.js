/**
 * For a given day, return all of its appointments
 * @param {object} state
 * @param {string} day
 * @returns {array}
 */
export const getAppointmentsForDay = (state, day) => {
  if (state.days.length === 0 || !state.days.find((val) => val.name === day)) {
    return [];
  }

  const { appointments } = state.days.find((value) => value.name === day);

  const appointmentsObjects = appointments.map(
    (id) => state.appointments[id] || null
  );

  return appointmentsObjects;
};

export const getInterview = (state, appointment) => {
  if (!appointment || !appointment.interviewer) {
    return null;
  }

  const interviewerId = appointment.interviewer;
  const interview = {
    student: appointment.student,
    interviewer: state.interviewers[interviewerId],
  };

  return interview;
};

export const getInterviewersForDay = (state, day) => {
  if (state.days.length === 0 || !state.days.find((val) => val.name === day)) {
    return [];
  }

  const { interviewers } = state.days.find((value) => value.name === day);

  const interviewersObjects = interviewers.map(
    (id) => state.interviewers[id] || null
  );

  return interviewersObjects;
};
