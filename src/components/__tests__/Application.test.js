import React from "react";
import {
  getAllByTestId,
  getByAltText,
  getByText,
  prettyDOM,
} from "@testing-library/react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByPlaceholderText,
} from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";

const fixtures = {
  days: [
    {
      id: 1,
      name: "Monday",
      appointments: [1, 2],
      interviewers: [1, 2],
      spots: 1,
    },
    {
      id: 2,
      name: "Tuesday",
      appointments: [3, 4],
      interviewers: [3, 4],
      spots: 1,
    },
  ],
  appointments: {
    1: { id: 1, time: "12pm", interview: null },
    2: {
      id: 2,
      time: "1pm",
      interview: { student: "Archie Cohen", interviewer: 2 },
    },
    3: {
      id: 3,
      time: "2pm",
      interview: { student: "Leopold Silvers", interviewer: 4 },
    },
    4: { id: 4, time: "3pm", interview: null },
  },
  interviewers: {
    1: {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png",
    },
    2: {
      id: 2,
      name: "Tori Malcolm",
      avatar: "https://i.imgur.com/Nmx0Qxo.png",
    },
    3: {
      id: 3,
      name: "Mildred Nazir",
      avatar: "https://i.imgur.com/T2WwVfS.png",
    },
    4: {
      id: 4,
      name: "Cohana Roy",
      avatar: "https://i.imgur.com/FK8V841.jpg",
    },
  },
};
beforeEach(() => {
  axios.get.mockReset();
  axios.get.mockImplementation((url) => {
    if (url === "/api/days") {
      return Promise.resolve({
        status: 200,
        statusText: "OK",
        data: fixtures.days,
      });
    }

    if (url === "/api/appointments") {
      /* Resolve appointments data */
      return Promise.resolve({
        status: 200,
        statusText: "OK",
        data: fixtures.appointments,
      });
    }

    if (url === "/api/interviewers") {
      /* Resolve interviewers data */
      return Promise.resolve({
        status: 200,
        statusText: "OK",
        data: fixtures.interviewers,
      });
    }
  });
  axios.put.mockReset();

  axios.put.mockImplementation((url) => {
    if (url === "/api/appointments/1") {
      /* Resolve appointments data */
      return Promise.resolve({ status: 204, statusText: "No Content" });
    }
  });
});
afterEach(cleanup);
describe("Application", () => {
  it("renders without crashing", () => {
    render(<Application />);
  });
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));
  });
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    console.log(prettyDOM(appointment));
  });
});
