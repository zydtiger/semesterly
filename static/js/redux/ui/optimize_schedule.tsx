// Helper functions for scheduling courses
// Define interfaces for the course and section structure
import { section } from "../__fixtures__/state";
import { DenormalizedCourse, Section } from "../constants/commonTypes";

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isFeasible(schedule: Section[], newSection: Section): boolean {
  // example:
  // const startdate = newSection.offering_set[0].date_start;
  // const enddate = newSection.offering_set[0].date_end;
  for (const section of schedule) {
    for (const newTime of newSection.offering_set) {
      for (const existingTime of section.offering_set) {
        if (
          newTime.day === existingTime.day &&
          newTime.time_start < existingTime.time_end &&
          newTime.time_end > existingTime.time_start &&
          // check if time overlapps
          newTime.date_start <= existingTime.date_end &&
          newTime.date_end >= existingTime.date_start
        ) {
          return false; // Overlap detected
        }
      }
    }
  }
  return true; // No overlaps
}

export function calculateTotalGaps(schedule: Section[]): number {
  const daySlots: Record<string, { start: number; end: number }[]> = {};

  schedule.forEach((section) => {
    section.offering_set.forEach((time) => {
      const { day, time_start, time_end } = time;
      if (!daySlots[day]) daySlots[day] = [];
      daySlots[day].push({
        start: timeToMinutes(time_start),
        end: timeToMinutes(time_end),
      });
    });
  });

  let totalGaps = 0;

  Object.keys(daySlots).forEach((day) => {
    const slots = daySlots[day].sort((a, b) => a.start - b.start);
    for (let i = 1; i < slots.length; i++) {
      const gap = slots[i].start - slots[i - 1].end;
      if (gap > 0) totalGaps += gap;
    }
  });

  return totalGaps;
}

export function getFeasibleSchedules(
  courses: DenormalizedCourse[],
  lockedSections: Section[]
): Section[][] {
  const schedules: Section[][] = [];
  // backtracking to not explore branches of tree that is alreadt infeasible
  function backtrack(currentSchedule: Section[], courseIndex: number) {
    if (courseIndex === courses.length) {
      schedules.push(currentSchedule);
      return;
    }
    const currentCourse = courses[courseIndex];
    for (const section of currentCourse.sections) {
      if (isFeasible([...currentSchedule, ...lockedSections], section))
        backtrack([...currentSchedule, section], courseIndex + 1);
    }
  }
  backtrack(lockedSections, 0);
  return schedules;
}

function calculateEarlyClassAmounts(
  schedule: Section[],
  earlyThreshold: number
): number {
  var amount = 0;
  schedule.map((section) => {
    section.offering_set.map((offering) => {
      const [hours, minutes] = offering.time_start.split(":").map(Number);
      const start = hours + minutes / 60;
      if (start < earlyThreshold) {
        amount += earlyThreshold - start;
      }
    });
  });
  return amount;
}

export function findTopSchedules(
  courses: DenormalizedCourse[],
  lockedSections: Section[],
  policy = 0, // 0 for minimal gaps, 1 for minimal early class
  topN = 1 // number of schedules we want to return
): Array<{ schedule: Section[] }> {
  const combinations = getFeasibleSchedules(courses, lockedSections);
  if (combinations.length === 0 || topN < 1) return [];
  // Rank schedules by total gaps
  if (policy == 0) {
    const rankedSchedules = combinations
      .map((schedule) => ({ schedule, totalGaps: calculateTotalGaps(schedule) }))
      .sort((a, b) => a.totalGaps - b.totalGaps);
    return rankedSchedules.slice(0, topN);
  }

  // time <= 10 AM is early class
  const avoidEarlySchedule = combinations
    .map((schedule) => ({
      schedule,
      earlyClassAmounts: calculateEarlyClassAmounts(schedule, 10),
    }))
    .sort((a, b) => a.earlyClassAmounts - b.earlyClassAmounts);

  return avoidEarlySchedule.slice(0, topN);
}
