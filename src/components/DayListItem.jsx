import React from "react";

import "components/DayListItem.scss";
import classNames from "classnames";

export default function DayListItem(props) {
  const { name, spots, selected, setDay } = props;

  const classes = classNames(
    "day-list__item",
    {
      "day-list__item--selected": selected,
    },
    { "day-list__item--full": !spots }
  );

  /**
   * Renders a string announcing the number of spots remaing for the day
   * @param {integer} spots
   * @returns
   */
  const spotsRemainingString = (spots) => {
    if (spots === 1) {
      return `1 spot remaining`;
    }
    return `${spots ? spots : "no"} spots remaining`;
  };

  return (
    <li onClick={() => setDay(name)} className={classes} data-testid="day">
      <h2 className="text--regular">{name}</h2>
      <h3 className="text--light">{spotsRemainingString(spots)}</h3>
    </li>
  );
}
