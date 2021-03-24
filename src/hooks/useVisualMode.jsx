import { useState } from "react";
/**
 * Custom hook handling the visual modes of the appointment component
 * @param {string} initial - Default mode at rendering
 * @returns {object}
 */
export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);
  /**
   * This function changes the appointment mode for the requested one
   * @param {string} newState new mode to place in history
   * @param {boolean} replace if true, replace the current mode instead of pre-pending
   */
  const transition = function (newState, replace = false) {
    if (replace) {
      setHistory((history) => [newState, ...history.slice(1)]);
    } else {
      setHistory((history) => [newState, ...history]);
    }
  };
  /**
   * This function revert the appointment mode to the previous one
   */
  const back = function () {
    if (history.length > 1) {
      setHistory((history) => history.slice(1));
    }
  };

  return {
    mode: history[0],
    transition,
    back,
  };
}
