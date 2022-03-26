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

import { connect } from "react-redux";
import {
  getActiveDenormTimetable,
  getHoveredSlots,
  getDenormCourseById,
} from "../../state";
import { fetchCourseInfo } from "../../actions/modal_actions";
import {
  addCustomSlot,
  addOrRemoveCourse,
  addOrRemoveOptionalCourse,
  removeCustomSlot,
  updateCustomSlot,
  finalizeCustomSlot,
} from "../../actions/timetable_actions";
import { getSchoolSpecificInfo } from "../../constants/schools";
import SlotManager from "../slot_manager";

const mapStateToProps = (state, ownProps) => ({
  hoveredSlot: getHoveredSlots(state),
  isLoggedIn: state.userInfo.data.isLoggedIn,
  socialSections: state.userInfo.data.social_offerings,
  primaryDisplayAttribute: getSchoolSpecificInfo(state.school.school).primaryDisplay,
  courseToColourIndex: state.ui.courseToColourIndex,
  custom: state.customEvents.events,
  isCourseOptional: (cid) => state.optionalCourses.courses.some((c) => c === cid),
  getOptionalCourseById: (cid) => getDenormCourseById(state, cid),
  getClassmatesInSection: (courseId, sectionCode) => {
    if (!(courseId in state.classmates.courseToClassmates)) {
      return [];
    }
    const classmatesInCourse = state.classmates.courseToClassmates[courseId];
    return classmatesInCourse.current.filter((cm) =>
      cm.sections.find((s) => s === sectionCode)
    );
  },
  days: ownProps.days,
  uses12HrTime: state.ui.uses12HrTime,
});

const SlotManagerContainer = connect(mapStateToProps, {
  fetchCourseInfo,
  addOrRemoveOptionalCourse,
  addOrRemoveCourse,
  removeCustomSlot,
  updateCustomSlot,
  addCustomSlot,
  finalizeCustomSlot,
})(SlotManager);

export default SlotManagerContainer;
