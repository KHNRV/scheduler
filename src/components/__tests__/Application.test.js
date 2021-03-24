import React from "react";
import {
  getAllByTestId,
  getByAltText,
  getByText,
  prettyDOM,
  queryByText,
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

afterEach(cleanup);
describe("Application", () => {
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

    expect(getByText(appointment, "Booking interview...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(
        appointment,
        "Are you sure you would like to cancel your interview?"
      )
    ).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(
      getByText(appointment, "Canceling interview...")
    ).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));
    // 4. Check that the form view is shown
    expect(getByText(appointment, "Save")).toBeInTheDocument();
    expect(getByText(appointment, "Cancel")).toBeInTheDocument();
    // 5. Change the name of the student
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Kevin Nicolas" },
    });
    // 6. Change the interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 7. Click on save
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Check that the element with the text "Booking interview..." is displayed.
    expect(getByText(appointment, "Booking interview...")).toBeInTheDocument();

    // 7. Wait until the new name is displayed
    await waitForElement(() => getByText(appointment, "Kevin Nicolas"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "1 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Booking interview...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Error"));

    expect(
      getByText(appointment, "Oops, we were not able to save your appointment")
    ).toBeInTheDocument();
  });
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(
        appointment,
        "Are you sure you would like to cancel your interview?"
      )
    ).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(
      getByText(appointment, "Canceling interview...")
    ).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Error"));

    expect(
      getByText(
        appointment,
        "Oops, we were not able to cancel your appointment"
      )
    ).toBeInTheDocument();
  });
});
