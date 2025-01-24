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

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import classNames from "classnames";
// @ts-ignore no available type
import ClickOutHandler from "react-onclickout";
import MasterSlot from "./MasterSlot";
import TimetableNameInput from "./TimetableNameInput";
import CreditTicker from "./CreditTicker";
import { alertsActions } from "../state/slices";
import { getNextAvailableColour } from "../util";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  getActiveTimetable,
  getActiveTimetableCourses,
  getCoursesFromSlots,
  getCurrentSemester,
} from "../state";
import { getCourseShareLink } from "../constants/endpoints";
import {
  addOrRemoveCourse,
  duplicateTimetable,
  fetchCourseInfo,
  loadTimetable,
  updateCourses,
} from "../actions";
import {
  Course,
  DenormalizedCourse,
  Section,
  Timetable,
} from "../constants/commonTypes";
import { startComparingTimetables } from "../state/slices/compareTimetableSlice";
import AvgCourseRating from "./AvgCourseRating";
import { selectSlotColorData, selectTheme } from "../state/slices/themeSlice";
import { peerModalActions } from "../state/slices/peerModalSlice";
import CreateNewTimetableButton from "./CreateNewTimetableButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { findTopSchedules } from "./optimize_schedule";

/**
 * This component displays the timetable name, allows you to switch between timetables,
 * shows credits and average course rating, contains the "Find New Friends" link to open
 * the PeerModal, and mainly displays all of the courses on the student's current
 * timetable using MasterSlots.
 */
const SideBar = () => {
  const dispatch = useAppDispatch();
  const colorData = useAppSelector(selectSlotColorData);
  const timetable = useAppSelector(getActiveTimetable);
  const mandatoryCourses: DenormalizedCourse[] = useAppSelector(
    (state) =>
      useMemo(() => {
        return getCoursesFromSlots(state, timetable.slots);
      }, [state, timetable.slots]) // Only change when slots or state changes
  );
  const semester = useAppSelector(getCurrentSemester);
  const savedTimetablesState = useAppSelector(
    (state) => state.userInfo.data.timetables
  );
  const courseToColourIndex = useAppSelector((state) => state.ui.courseToColourIndex);
  const courseToClassmates = useAppSelector(
    (state) => state.classmates.courseToClassmates
  );
  const avgRating = useAppSelector(() => timetable.avg_rating);
  const activeTimetable = useAppSelector(
    (state) => state.savingTimetable.activeTimetable
  );

  const MAXIMUM_COURSE_PLAN = 15;

  const getShareLink = (courseCode: string) => getCourseShareLink(courseCode, semester);
  const timetableCourses = useAppSelector((state) => getActiveTimetableCourses(state));
  const events = useAppSelector((state) => state.customEvents.events);
  const curTheme = useAppSelector(selectTheme);
  const [showDropdown, setShowDropdown] = useState(false);

  const [hoveredCourse, setHoveredCourse] = useState(-1);
  const [masterSlotListLength, setMasterSlotListLength] = useState(0);

  // coursePlan stores all the courses that the user drags into the course optimization section
  const [coursePlan, setCoursePlan] = useState([]);
  const [isCoursePlanDragging, setIsCoursePlanDragging] = useState(false);
  const [isMasterCourseDragging, setIsMasterCourseDragging] = useState(false);
  const [draggedCourse, setDraggedCourse] = useState(null);
  // masterSlots stores the MasterSlot components to be rendered for the original course list
  const [masterSlots, setMasterSlots] = useState([]);

  // Contains all keys for masterSlots (Iterated over for hoveredCourse, i.e. state for index of up/down keyboard shortcuts)
  const [masterSlotList, setMasterSlotList] = useState([]);

  // coursePlanMasterSlots likewise stores the MasterSlot components for the optimization section
  const [coursePlanMasterSlots, setCoursePlanMasterSlots] = useState([]);
  // masterSlotCourses stores all the courses in the course list, excluding the ones the user puts in the optimization section
  const [masterSlotCourses, setMasterSlotCourses] = useState([]);

  const theme = useAppSelector(selectTheme);
  const isDarkMode = theme && theme.name && theme.name === "dark";

  // TODO:
  // update https://semesterly-v2.readthedocs.io/en/latest/frontend.html
  // fix half semesters planning

  useEffect(() => {
    const updatedMasterSlotList: number[] = [];
    const updatedMasterSlotCourses: (Course | DenormalizedCourse)[] = [];
    mandatoryCourses.map((course) => {
      if (!coursePlan.some((plannedCourse) => plannedCourse.id === course.id)) {
        updatedMasterSlotCourses.push(course);
        updatedMasterSlotList.push(course.id);
      }
    });
    setMasterSlotList(updatedMasterSlotList);
    if (coursePlan.length + masterSlotCourses.length != mandatoryCourses.length)
      setMasterSlotCourses(updatedMasterSlotCourses);
  }, [mandatoryCourses]);

  useEffect(() => {
    createMasterSlots(
      masterSlotCourses,
      setMasterSlots,
      true,
      true,
      true,
      "masterSlotCourses"
    );
  }, [mandatoryCourses, masterSlotCourses]);

  useEffect(() => {
    createMasterSlots(
      coursePlan,
      setCoursePlanMasterSlots,
      true,
      false,
      false, // set delete button for course plan
      "coursePlan"
    );
  }, [mandatoryCourses, coursePlan]);

  const currentSections = useMemo(() => {
    return timetable.slots
      .map((slot) => {
        const course = mandatoryCourses.find((course) => course.id === slot.course);
        if (course) {
          const section = course.sections.find(
            (section) => section.id === slot.section
          );
          return section
            ? {
                ...section,
                is_locked: slot.is_locked,
                offerings: slot.offerings,
                course_id: course.id,
              }
            : null;
        }
        return null;
      })
      .filter((section) => section !== null);
  }, [timetable.slots, mandatoryCourses]);

  const createMasterSlots = (
    courses: DenormalizedCourse[],
    setSlots: React.Dispatch<React.SetStateAction<any>>,
    showDrag: boolean,
    showLink: boolean,
    showRemove: boolean,
    target: string
  ) => {
    const updatedMasterSlotList: number[] = [];
    const newMasterSlots = courses.map((course) => {
      if (
        mandatoryCourses.some((mandatoryCourse) => mandatoryCourse.id === course.id)
      ) {
        const colourIndex =
          course.id in courseToColourIndex
            ? courseToColourIndex[course.id]
            : getNextAvailableColour(courseToColourIndex);

        const professors = course.sections.map((section) => section.instructors);
        const sectionId = timetable.slots.find(
          (slot) => slot.course === course.id
        )?.section;

        // Create a new list for masterSlotList
        updatedMasterSlotList.push(course.id);

        // Only render the course if it's still in mandatoryCourses
        return (
          <MasterSlot
            key={course.id}
            sectionId={sectionId}
            professors={professors}
            colourIndex={colourIndex}
            classmates={courseToClassmates[course.id]}
            course={course}
            fetchCourseInfo={() => dispatch(fetchCourseInfo(course.id))}
            removeCourse={() => dispatch(addOrRemoveCourse(course.id))}
            getShareLink={getShareLink}
            colorData={colorData}
            isHovered={
              updatedMasterSlotList[hoveredCourse] === course.id &&
              !isMasterCourseDragging &&
              !isCoursePlanDragging
            }
            draggable={showDrag}
            onDragStart={(course) => handleDragStart(course, target)}
            onDragEnd={() => handleDragEnd(target)}
            showLink={showLink}
            hideCloseButton={!showRemove}
          />
        );
      }
    });
    setSlots(newMasterSlots);
  };

  const hideDropdown = () => {
    setShowDropdown(false);
    // * Set hoveredCourse to -1 if user clicks out
    setHoveredCourse(-1);
  };

  const toggleDropdown = () => {
    setShowDropdown((old) => !old);
  };

  const stopPropagation = (callback: Function, event: React.MouseEvent) => {
    event.stopPropagation();
    hideDropdown();
    callback();
  };

  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const isMobile = mobile && window.innerWidth < 767 && isPortrait;

  const savedTimetables = savedTimetablesState
    ? savedTimetablesState.map((t: Timetable) => (
        <div className="tt-name" key={t.id} onClick={() => dispatch(loadTimetable(t))}>
          {t.name}
          <Tooltip
            title={<Typography fontSize={12}>Delete</Typography>}
            disableInteractive
          >
            <button
              onClick={(event) =>
                stopPropagation(
                  () => dispatch(alertsActions.alertDeleteTimetable(t)),
                  event
                )
              }
              className="row-button"
            >
              <i className="fa fa-trash-o" />
            </button>
          </Tooltip>

          <Tooltip
            title={<Typography fontSize={12}>Duplicate</Typography>}
            disableInteractive
          >
            <button
              onClick={(event) =>
                stopPropagation(() => dispatch(duplicateTimetable(t)), event)
              }
              className="row-button"
            >
              <i className="fa fa-clone" />
            </button>
          </Tooltip>

          {!isMobile && activeTimetable.name !== t.name && (
            <Tooltip
              title={<Typography fontSize={12}>Compare</Typography>}
              disableInteractive
            >
              <button
                onClick={(event) => {
                  dispatch(
                    startComparingTimetables({
                      activeTimetable,
                      comparedTimetable: t,
                      theme: curTheme,
                    })
                  );
                  event.stopPropagation();
                }}
                className="row-button"
              >
                <i className="fa-solid fa-arrows-left-right" />
              </button>
            </Tooltip>
          )}
        </div>
      ))
    : null;

  // This detects changes to the size of masterSlotList (i.e. how many courses are on the current timetable) and updates the masterSlotList length accordingly
  // Also handles edge case in which hoveredCourse points to the last index in masterSlotList, but a course is deleted by the user. When this happens, hoveredCourse is decremented.
  useEffect(() => {
    if (
      masterSlotList.length < masterSlotListLength &&
      hoveredCourse === masterSlotListLength - 1
    ) {
      // i.e. a course was removed and last course was hovered
      setHoveredCourse((prevIndex) => prevIndex - 1);
    }
    setMasterSlotListLength(masterSlotList.length);
  }, [masterSlotList]);

  // Handles keypresses: "Up" decrements hoveredCourse, "Down" increments hoveredCourse (both with bounds).
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "ArrowUp") {
        if (hoveredCourse > -1) {
          setHoveredCourse((prevHoveredCourse) => prevHoveredCourse - 1);
        }
      } else if (e.key === "ArrowDown") {
        if (hoveredCourse < masterSlotListLength - 1) {
          setHoveredCourse((prevHoveredCourse) => prevHoveredCourse + 1);
        }
      } else if (e.key === "Enter" && hoveredCourse > -1) {
        dispatch(fetchCourseInfo(masterSlotList[hoveredCourse]));
      } else if (e.key === "Backspace" && hoveredCourse > -1) {
        dispatch(addOrRemoveCourse(masterSlotList[hoveredCourse]));
      }
    },
    [hoveredCourse, masterSlotListLength]
  );

  // Attaches/unattaches event listener to document
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const dropItDown =
    savedTimetables && savedTimetables.length !== 0 ? (
      <div className="timetable-drop-it-down" onClick={toggleDropdown}>
        <span className={classNames("tip-down", { down: showDropdown })} />
      </div>
    ) : null;

  // Function to handle course drag
  const handleDragStart = (course: Course | DenormalizedCourse, target: string) => {
    setDraggedCourse(course);
    if (target === "coursePlan") setIsCoursePlanDragging(true);
    else if (target === "masterSlotCourses") setIsMasterCourseDragging(true);
  };

  const handleDragEnd = (target: string) => {
    if (target === "coursePlan") setIsCoursePlanDragging(false);
    else if (target === "masterSlotCourses") setIsMasterCourseDragging(false);
  };

  // Function to handle dropping the course into the schedule
  const handleDrop = (event: React.DragEvent<HTMLDivElement>, target: string) => {
    event.preventDefault();

    // no course being dragged
    if (!draggedCourse) return;

    // Check the target drop area
    if (target === "coursePlan" && isMasterCourseDragging) {
      // Add the dragged course to the course plan
      setCoursePlan((prevPlan) => [...prevPlan, draggedCourse]);
      // Remove the dragged course from the other list
      const updatedCourses = masterSlotCourses.filter(
        (course) => course.id !== draggedCourse.id
      );
      setMasterSlotCourses(updatedCourses);
      setIsMasterCourseDragging(false);
    } else if (target === "masterSlotCourses" && isCoursePlanDragging) {
      // Add the dragged course to masterSlotCourses
      setMasterSlotCourses((prevCourses) => [...prevCourses, draggedCourse]);
      // Remove the dragged course from the other list
      const updatedCourses = coursePlan.filter(
        (course) => course.id !== draggedCourse.id
      );
      setCoursePlan(updatedCourses);
      setIsCoursePlanDragging(false);
    }

    // Reset dragged course
    setDraggedCourse(null);
  };

  // Prevent default behavior when dragging over the drop zone
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const emptyMasterSlot = () => {
    return (
      <div className="empty-state">
        <img
          src={
            curTheme.name === "light"
              ? "/static/img/emptystates/masterslots.png"
              : "/static/img/emptystates/masterslots-dark.png"
          }
          alt="No courses added."
        />
        <h4>Looks like you don&#39;t have any courses yet!</h4>
        <h3>
          Your selections will appear here along with credits, professors and friends in
          the class
        </h3>
      </div>
    );
  };

  const addCourseIDToCourseList = (
    courses: DenormalizedCourse[]
  ): DenormalizedCourse[] => {
    return courses.map((course: DenormalizedCourse) => ({
      ...course,
      sections: course.sections.map((section: Section) => ({
        ...section,
        course_id: course.id,
      })),
    }));
  };

  const handleCreateClick = () => {
    if (coursePlan.length === 0 || coursePlan.length > MAXIMUM_COURSE_PLAN) {
      const alertType = coursePlan.length === 0 ? 0 : 1;
      dispatch(alertsActions.alertCoursePlan({ alertType: alertType }));
      return;
    }
    const updatedCoursePlan = addCourseIDToCourseList(coursePlan);

    const lockedSections = currentSections.filter((section) =>
      masterSlotCourses.some((course) => course.id === section.course_id)
    );
    const schedules = findTopSchedules(updatedCoursePlan, lockedSections);

    if (schedules.length === 0) {
      dispatch(alertsActions.alertCoursePlan({ alertType: 2 }));
      return;
    }

    dispatch(updateCourses(schedules[0].schedule));
    setCoursePlan([]);
  };

  const handleAddAllClick = () => {
    setCoursePlan(mandatoryCourses);
    setMasterSlotCourses([]);
  };

  const nextSchedule = () => {};

  const prevSchedule = () => {};

  return (
    <div
      className="side-bar no-print"
      style={{
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div className="sb-name">
        <TimetableNameInput />
        <ClickOutHandler onClickOut={hideDropdown}>
          {dropItDown}
          <div
            className={classNames("timetable-names-dropdown", {
              down: showDropdown,
            })}
          >
            <div className="tip-border" />
            <div className="tip" />

            <h4>{`${semester.name} ${semester.year}`}</h4>

            {savedTimetables}
            <CreateNewTimetableButton setSidebarDropdown={setShowDropdown} />
          </div>
        </ClickOutHandler>
      </div>
      <div className="col-1-3" style={{ textAlign: "center" }}>
        <CreditTicker timetableCourses={timetableCourses} events={events} />
      </div>
      <div className="col-2-3">
        <AvgCourseRating avgRating={avgRating} />
      </div>
      <a onClick={() => dispatch(peerModalActions.togglePeerModal())}>
        <h4 className="sb-header">
          Current Courses
          <div className="sb-header-link">
            <i className="fa fa-users" />
            &nbsp;Find new friends
          </div>
        </h4>
      </a>
      <h4 className="sb-tip">
        <b>ProTip:</b> use <i className="fa fa-lock" /> to lock a section in place.
      </h4>
      <div
        className="sb-master-slots"
        onDrop={(event) => handleDrop(event, "masterSlotCourses")}
        onDragEnd={() => handleDragEnd("masterSlotCourses")}
        onDragOver={handleDragOver}
        style={{
          backgroundColor: isDarkMode
            ? isCoursePlanDragging
              ? "#3F4246"
              : "transparent"
            : isCoursePlanDragging
            ? "lightblue"
            : "transparent",
          // backgroundColor: isCoursePlanDragging
          //   ? "lightblue"
          //   : isDarkMode
          //   ? "#1d1e22"
          //   : "white",
          transition: "background-color 0.3s ease",
          borderBottom: "2px solid black",
          minHeight: "200px",
          padding: "6px",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
      >
        {masterSlots.length === 0 ? (
          coursePlan.length === 0 ? (
            emptyMasterSlot()
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <p
                style={{
                  lineHeight: "1.5",
                  textAlign: "center",
                  userSelect: "none",
                }}
              >
                Drag courses back here to lock in your section choice!
              </p>
            </div>
          )
        ) : (
          masterSlots
        )}
      </div>
      <div
        className="sb-course-scheduling"
        style={{
          marginTop: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h5 style={{ width: "60%" }}>Scheduled Courses</h5>
          <div
            style={{
              height: "40px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              justifyContent: "center",
            }}
          >
            <button onClick={handleCreateClick}>Create</button>
            <button onClick={handleAddAllClick}>Add All</button>
          </div>
        </div>

        <div
          onDrop={(event) => handleDrop(event, "coursePlan")}
          onDragEnd={() => handleDragEnd("coursePlan")}
          onDragOver={handleDragOver}
          style={{
            minHeight: "200px",
            padding: "6px",
            backgroundColor: isDarkMode
              ? isMasterCourseDragging
                ? "#3F4246"
                : "#1d1e22"
              : isMasterCourseDragging
              ? "lightblue"
              : "white",
            transition: "background-color 0.3s ease",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {coursePlan.length > 0 ? (
            <>{coursePlanMasterSlots}</>
          ) : (
            <p
              style={{
                lineHeight: "1.5",
                textAlign: "center",
                userSelect: "none",
              }}
            >
              Drag and drop courses to automatically make your schedule!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// TODO: should be these values by default in the state
SideBar.defaultProps = {
  savedTimetables: null,
  avgRating: 0,
};

export default SideBar;
