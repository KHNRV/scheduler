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
