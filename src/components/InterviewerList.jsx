import React from "react";

import "components/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";

export default function InterviewerList(props) {
  const interviewersList = Array.isArray(props.interviewers)
    ? props.interviewers.map((interviewer) => {
        return (
          <InterviewerListItem
            key={interviewer.id}
            {...interviewer}
            selected={interviewer.id === props.interviewer}
            setInterviewer={(event) => props.onChange(interviewer.id)}
          />
        );
      })
    : "";

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewersList}</ul>
    </section>
  );
}
