/*
Copyright (C) 2017 Semester.ly Technologies, LLC

Semester.ly is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Semester.ly is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

import PropTypes from "prop-types";
import React from "react";

/**
 * This alert pops up when the user is trying to rename a timetable to a name that
 * already exists.
 */

class OptimizeScheduleAlert extends React.Component {
  componentWillUnmount() {
    this.props.dismissSelf();
  }

  handleClick() {
    this.props.dismissSelf();
  }

  render() {
    const { alertCoursePlanType } = this.props;

    let message;
    switch (alertCoursePlanType) {
      case 0:
        message = "There is no course in your course plan! Try 'Add All'.";
        break;
      case 1:
        message = "Your course plan exceeds the maximum limit. Remove some courses.";
        break;
      case 2:
        message =
          "There is no feasible schedule given the courses. Consider removing some courses and try again!";
        break;
      default:
        message = "An unknown error occurred with your course plan.";
    }

    return <div className="optimize-schedule-alert">{message}</div>;
  }
}

OptimizeScheduleAlert.propTypes = {
  dismissSelf: PropTypes.func.isRequired,
  alertCoursePlanType: PropTypes.number.isRequired, // Add this prop type
};

export default OptimizeScheduleAlert;
