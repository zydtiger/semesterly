// Helper functions for scheduling courses
import { DenormalizedCourse, Section } from "../constants/commonTypes";

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isFeasible(schedule: Section[], newSection: Section): boolean {
  for (const section of schedule) {
    for (const newTime of newSection.offering_set) {
      for (const existingTime of section.offering_set) {
        if (
          newTime.day === existingTime.day &&
          newTime.time_start < existingTime.time_end &&
          newTime.time_end > existingTime.time_start &&
          // check if time overlapps for half semester courses
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

function calculateTotalGaps(schedule: Section[]): number {
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

function getFeasibleSchedules(
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

/**
 * Finds the top schedules based on a specified policy.
 *
 * @param {DenormalizedCourse[]} courses - Array of courses, where each course contains sections and their offerings.
 * @param {Section[]} lockedSections - Array of sections that must be included in every feasible schedule.
 * @param {number} policy - Ranking policy (0 for minimal gaps, 1 for minimal early classes).
 * @param {number} topN - Number of top schedules to return.
 * @returns {Array<{ schedule: Section[] }>} An array of objects containing the top schedules based on the given policy.
 */
export function findTopSchedules(
  courses: DenormalizedCourse[],
  lockedSections: Section[],
  policy = 0, // 0 for minimal gaps, 1 for minimal early class
  topN = 1 // number of schedules we want to return
): Array<{ schedule: Section[] }> {
  const combinations = getFeasibleSchedules(courses, lockedSections);
  if (combinations.length === 0 || topN < 1) return []; // return if there's no feasible schedule
  var rankedSchedules;

  // handle policy cases
  switch (policy) {
    case 0:
    default:
      rankedSchedules = combinations
        .map((schedule) => ({ schedule, totalGaps: calculateTotalGaps(schedule) }))
        .sort((a, b) => a.totalGaps - b.totalGaps);
      break;
    case 1:
      rankedSchedules = combinations
        .map((schedule) => ({
          schedule,
          earlyClassAmounts: calculateEarlyClassAmounts(schedule, 10), // time <= 10 AM is early class
        }))
        .sort((a, b) => a.earlyClassAmounts - b.earlyClassAmounts);
      break;
  }

  return rankedSchedules.slice(0, topN);
}
