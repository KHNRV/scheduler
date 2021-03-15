import React from "react";

import DayListItem from "./DayListItem";

export default function DayList(props) {
  const { days, setDay } = props;

  const dayListItems = Array.isArray(days)
    ? days.map((day, index) => {
        return (
          <DayListItem
            key={index}
            name={day.name}
            spots={day.spots}
            selected={day.name === props.day}
            setDay={setDay}
          />
        );
      })
    : null;

  return <ul>{dayListItems}</ul>;
}
