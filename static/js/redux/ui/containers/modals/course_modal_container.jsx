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
import CourseModal from "../../modals/course_modal";
import {
  getCurrentSemester,
  getDenormCourseById,
  getHoveredSlots,
} from "../../../state";
import {
  addOrRemoveCourse,
  addOrRemoveOptionalCourse,
} from "../../../actions/timetable_actions";
import {
  fetchCourseInfo,
  react,
} from "../../../actions/modal_actions";
import { saveSettings } from "../../../actions/user_actions";
import {
  getCourseShareLink,
  getCourseShareLinkFromModal,
} from "../../../constants/endpoints";
import {
  userInfoActions,
  courseInfoActions,
  getCourseInfoId,
} from "../../../state/slices";
import { timetablesActions } from "../../../state/slices/timetablesSlice";
import { signupModalActions } from "../../../state/slices/signupModalSlice"

const mapStateToProps = (state) => {
  const courseSections = state.courseSections.objects;
  const courseInfoId = getCourseInfoId(state);
  const denormCourseInfo = !courseInfoId
    ? {}
    : getDenormCourseById(state, courseInfoId);
  return {
    isFetchingClasmates: state.courseInfo.isFetchingClassmates,
    classmates: state.courseInfo.classmates,
    data: denormCourseInfo,
    id: state.courseInfo.id,
    isFetching: state.courseInfo.isFetching,
    hasHoveredResult: getHoveredSlots(state) !== null,
    inRoster: courseSections[state.courseInfo.id] !== undefined,
    getShareLink: (courseCode) =>
      getCourseShareLink(courseCode, getCurrentSemester(state)),
    getShareLinkFromModal: (courseCode) =>
      getCourseShareLinkFromModal(courseCode, getCurrentSemester(state)),
  };
};

const CourseModalContainer = connect(mapStateToProps, {
  hideModal: () => courseInfoActions.setCourseId(null),
  openSignUpModal: signupModalActions.showSignupModal,
  fetchCourseInfo,
  unHoverSection: timetablesActions.unhoverSection,
  addOrRemoveOptionalCourse,
  addOrRemoveCourse,
  react,
  saveSettings,
  changeUserInfo: userInfoActions.changeUserInfo,
})(CourseModal);

export default CourseModalContainer;
