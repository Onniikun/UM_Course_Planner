
function filterSectionsByDay(sections, constraints) {
  const allowedMWF = constraints.isMWF;
  const allowedTT = constraints.isTT;

  for (let j = 0; j < sections.length; j++) {
    const section = sections[j];

    if (!Array.isArray(section.daysOfWeek)) {
      continue;
    }

    const isMWF =
      section.daysOfWeek.includes("MONDAY") ||
      section.daysOfWeek.includes("WEDNESDAY") ||
      section.daysOfWeek.includes("FRIDAY");

    const isTT =
      section.daysOfWeek.includes("TUESDAY") ||
      section.daysOfWeek.includes("THURSDAY");

    // If both allowed, don't filter by day
    if (allowedMWF && allowedTT) {
      continue;
    }

    // Only MWF allowed
    if (allowedMWF && !isMWF) {
      sections.splice(j, 1);
      j--;
    }
    // Only TT allowed
    else if (allowedTT && !isTT) {
      sections.splice(j, 1);
      j--;
    }
    // If neither checkbox selected, do not filter by day
  }
}

function dayCheck(courses, constraints) {
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];

    // Filter lecture sections
    if (Array.isArray(course.courseSections)) {
      filterSectionsByDay(course.courseSections, constraints);
    }

    // Filter lab sections (NEW)
    if (Array.isArray(course.labSections)) {
      filterSectionsByDay(course.labSections, constraints);
    }
  }
}

function filterSectionsByTime(sections, constraints) {
  const earliestTime = Number(constraints.earliestTime);
  const latestTime = Number(constraints.latestTime);

  for (let j = 0; j < sections.length; j++) {
    const section = sections[j];

    if (!section.timeSlot) {
      continue;
    }

    const start = section.timeSlot.startTime;
    const end = section.timeSlot.endTime;

    // If user left inputs empty/null, skip that constraint
    if (!isNaN(earliestTime) && start < earliestTime) {
      sections.splice(j, 1);
      j--;
      continue;
    }

    if (!isNaN(latestTime) && end > latestTime) {
      sections.splice(j, 1);
      j--;
    }
  }
}

function timeCheck(courses, constraints) {
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];

    // Filter lecture sections
    if (Array.isArray(course.courseSections)) {
      filterSectionsByTime(course.courseSections, constraints);
    }

    // Filter lab sections (NEW)
    if (Array.isArray(course.labSections)) {
      filterSectionsByTime(course.labSections, constraints);
    }
  }
}


function scheduler(courses) {
  const schedules = [];
  buildSchedules(courses, 0, [], schedules);
  return schedules;
}

function sectionsOverlap(section1, section2) {
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
    allSchedules.push([...currentSchedule]);
    return;
  }

  const course = courses[index];

  if (!course.courseSections || course.courseSections.length === 0) {
    return;
  }

  for (const lecture of course.courseSections) {
    // Skip if lecture conflicts
    if (hasConflict(lecture, currentSchedule)) {
      continue;
    }

    // if lab required
    if (Array.isArray(course.labSections) && course.labSections.length > 0) {
      for (const lab of course.labSections) {

        if (
          hasConflict(lab, currentSchedule) ||
          sectionsOverlap(lecture, lab)
        ) {
          continue;
        }

        // Add both
        currentSchedule.push(lecture);
        currentSchedule.push(lab);

        buildSchedules(courses, index + 1, currentSchedule, allSchedules);

        // Backtrack (remove lab and lecture)
        currentSchedule.pop();
        currentSchedule.pop();
      }
    }
    else {
      currentSchedule.push(lecture);
      buildSchedules(courses, index + 1, currentSchedule, allSchedules);
      currentSchedule.pop();
    }
  }
}

export function main(courses, constraints) {
  console.log("Constraints:", constraints);

  // Ensure constraints object exists and has expected keys
  const safeConstraints = {
    isMWF: constraints?.isMWF ?? false,
    isTT: constraints?.isTT ?? false,
    earliestTime: constraints?.earliestTime ?? null,
    latestTime: constraints?.latestTime ?? null,
  };

  if (!Array.isArray(courses)) {
    console.error("Courses must be an array.");
    return [];
  }

  // Apply day filtering (uses isMWF / isTT)
  dayCheck(courses, safeConstraints);

  console.log(
    "After dayCheck:",
    courses.map(c => ({
      name: c.name,
      lectureSections: c.courseSections?.map(s => s.daysOfWeek) || [],
      labSections: c.labSections?.map(s => s.daysOfWeek) || []
    }))
  );

  // Apply time filtering (uses earliestTime / latestTime)
  timeCheck(courses, safeConstraints);

  // Validate remaining sections
  for (const course of courses) {
    // Must have at least one lecture
    if (!course.courseSections || course.courseSections.length === 0) {
      console.log("No possible schedules: no valid lecture sections for", course.name);
      return [];
    }


    // Only fail if lecture sections are gone
    if (!course.courseSections || course.courseSections.length === 0) {
      console.log("No possible schedules: no valid lecture sections for", course.name);
      return [];
    }
  }

  const schedules = scheduler(courses);

  const reducedSchedules = [];

  for (let i = 0; i < 3; i++) {
    reducedSchedules[i] = schedules[i]; 
  }

  console.log("Generated Schedules:", schedules);

  return reducedSchedules;
}
