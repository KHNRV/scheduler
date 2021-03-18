import { useState } from "react";

export default function useVisualMode(initial) {
  //   const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newState, replace = false) {
    if (replace) {
      setHistory((history) => [newState, ...history.slice(1)]);
    } else {
      setHistory((history) => [newState, ...history]);
    }
  };
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
