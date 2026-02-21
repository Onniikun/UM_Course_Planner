import constraintsJson from './assets/constraints.json' with { type: "json" };
import { output } from './mikeOut.js';
import { filter } from './filterCourses.js';

// global courses list from user input
let courses = filter();


function dayCheck(courses) {
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];

    if (!course.courseSections || !Array.isArray(course.courseSections)) {
      continue;
    }

    const sections = course.courseSections;

    for (let j = 0; j < sections.length; j++) {
      const section = sections[j];

      if (!Array.isArray(section.daysOfWeek)) {
        continue;
      }

      const allowedMWF = constraintsJson.isMWF;

      const isMWF =
        section.daysOfWeek.includes("MONDAY") ||
        section.daysOfWeek.includes("WEDNESDAY") ||
        section.daysOfWeek.includes("FRIDAY");

      if (allowedMWF && !isMWF) {
        sections.splice(j, 1);
        j--;
      }
    }
  }
}

function timeCheck(courses) {
  const earliestTime = Number(constraintsJson.earliest);
  const latestTime = Number(constraintsJson.latest);

  for (let i = 0; i < courses.length; i++) {
    const currCourse = courses[i];

    if (!currCourse.courseSections || !Array.isArray(currCourse.courseSections)) {
      continue;
    }

    for (let j = 0; j < currCourse.courseSections.length; j++) {
      const currSection = currCourse.courseSections[j];

      if (!currSection.timeSlot) {
        continue;
      }

      const start = currSection.timeSlot.startTime;

      // Remove section if outside time window
      if (start < earliestTime || start > latestTime) {
        currCourse.courseSections.splice(j, 1);
        j--;
      }
    }
  }
}

function scheduler(courses) {
  const schedules = [];
  buildSchedules(courses, 0, [], schedules);
  return schedules;
}

function sectionsOverlap(section1, section2) {

  console.log(
    "Comparing:",
    `${section1.CRN} (${section1.timeSlot.startTime}-${section1.timeSlot.endTime})`,
    "vs",
    `${section2.CRN} (${section2.timeSlot.startTime}-${section2.timeSlot.endTime})`
  );

  if (!section1.daysOfWeek || !section2.daysOfWeek) {
    return false;
  }

  let sharedDay = false;

  for (let i = 0; i < section1.daysOfWeek.length; i++) {
    const day = section1.daysOfWeek[i];
    if (section2.daysOfWeek.includes(day)) {
      sharedDay = true;
      break;
    }
  }

  // If no shared days, cannot overlap
  if (!sharedDay) return false;

  if (!section1.timeSlot || !section2.timeSlot) {
    return false;
  }

  const s1Start = section1.timeSlot.startTime;
  const s1End = section1.timeSlot.endTime;
  const s2Start = section2.timeSlot.startTime;
  const s2End = section2.timeSlot.endTime;

  return s1Start < s2End && s1End > s2Start;
}

function hasConflict(newSection, currentSchedule) {
  for (const scheduled of currentSchedule) {
    if (sectionsOverlap(newSection, scheduled)) {
      return true;
    }
  }

  return false;
}

function buildSchedules(courses, index, currentSchedule, allSchedules) {
  if (index === courses.length) {
    if (currentSchedule.length > 0) {
      allSchedules.push([...currentSchedule]);
    }
    return;
  }

  const course = courses[index];

  // Try taking the course
  if (course.courseSections && course.courseSections.length > 0) {
    for (const section of course.courseSections) {
      if (!hasConflict(section, currentSchedule)) {
        currentSchedule.push(section);
        buildSchedules(courses, index + 1, currentSchedule, allSchedules);
        currentSchedule.pop();
      }
    }
  }

  // ALSO allow skipping the course
  buildSchedules(courses, index + 1, currentSchedule, allSchedules);
}

export function main() {
  if (!constraintsJson) {
    console.error("Constraints failed to load.");
    return;
  }

  if (!Array.isArray(courses)) {
    console.error("Courses must be an array.");
    return;
  }

  const schedules = scheduler(courses);

  console.log("Generated Schedules:", schedules);
}
