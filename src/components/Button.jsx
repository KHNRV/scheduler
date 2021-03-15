import React from "react";

import "components/Button.scss";
import { action } from "@storybook/addon-actions";
import classNames from "classnames";

export default function Button(props) {
  const { confirm, danger, disabled, onClick } = props;

  const buttonClass = classNames(
    "button",
    { "button--confirm": confirm },
    { "button--danger": danger }
  );

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {props.children}
    </button>
  );
}
