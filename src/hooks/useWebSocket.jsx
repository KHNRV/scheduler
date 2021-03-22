import { useEffect } from "react";
import { SET_INTERVIEW } from "./useApplicationData";

export default function useWebSockets(dispatch) {
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8001");
    ws.onopen = (event) => console.log("Connected");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === SET_INTERVIEW) {
        dispatch(message);
      }
    };
  }, [dispatch]);
}
