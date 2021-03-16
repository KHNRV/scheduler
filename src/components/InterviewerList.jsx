import React from "react";

import "components/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";

export default function InterviewerList(props) {
  const { interviewers, interviewer, setInterviewer } = props;

  const interviewersList = Array.isArray(interviewers)
    ? interviewers.map((oneInterviewer) => {
        return (
          <InterviewerListItem
            key={oneInterviewer.id}
            {...oneInterviewer}
            selected={interviewer === oneInterviewer.id}
            setInterviewer={(event) => {
              setInterviewer(oneInterviewer.id);
            }}
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
