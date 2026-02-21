import { Course } from "./Course.js";
import { Section } from "./Section.js";
import { TimeSlot } from "./TimeSlot.js";
import { DateTime } from "./DateTime.js";

export function loadCourses(courseList) {
  const courseMap = new Map();
  const lines = courseList.trim().split("\n");
  lines.shift(); // remove header line

  for (const line of lines) {
    const lineData = parseCSVLine(line);
    if (!lineData || lineData.length < 5) continue;

    const courseString = lineData[0].trim();
    const sectionString = lineData[1].trim();
    const titleString = lineData[2].trim();
    const isDistance = lineData[3].trim() === "DE";
    let dateTimeString = lineData[4].trim();
    let instructorString;

    if (isDistance || lineData.length === 6) {
      instructorString = lineData[5].trim();
    } else if (lineData.length >= 7) {
      instructorString = lineData[6].trim();
    } else {
      console.warn("Unexpected line format:", line);
      continue;
    }

    // Create Course if it doesn't exist
    if (!courseMap.has(courseString)) {
      const title = titleString
        .substring(0, titleString.lastIndexOf("("))
        .trim();
      courseMap.set(courseString, new Course(courseString, title));
    }
    const course = courseMap.get(courseString);

    // --- Section info ---
    const ID = sectionString.trim().split(" ")[0];
    const CRN = parseInt(sectionString.split("(")[1].split(")")[0], 10);

    // --- Credits ---
    const credits = parseInt(
      titleString.substring(
        titleString.lastIndexOf("(") + 1,
        titleString.lastIndexOf(")")
      ),
      10
    );

    // --- Dates ---
    const commaIndex = dateTimeString.indexOf(",");
    const datePart =
      commaIndex !== -1
        ? dateTimeString.substring(0, commaIndex).trim()
        : dateTimeString;
    const [startDateString, endDateString] = datePart.split(" - ");
    const startDate = dateBuilder(startDateString);
    const endDate = dateBuilder(endDateString);

    // --- Time and Days ---
    let startTime = null;
    let endTime = null;
    let days = [];

    if (
      !isDistance &&
      dateTimeString.includes("(") &&
      dateTimeString.includes(")")
    ) {
      // Extract days inside parentheses
      const openParen = dateTimeString.indexOf("(");
      const closeParen = dateTimeString.indexOf(")");
      const daysString = dateTimeString
        .substring(openParen + 1, closeParen)
        .trim();
      days = convertDays(daysString);

      // Extract time before parentheses
      const beforeParen = dateTimeString.substring(0, openParen).trim();
      const lastSpace = beforeParen.lastIndexOf(" ");
      const timePart = beforeParen.substring(lastSpace + 1).trim();

      const dashIndex = timePart.indexOf("-");
      if (dashIndex !== -1) {
        startTime = convertToMinutes(timePart.substring(0, dashIndex).trim());
        endTime = convertToMinutes(timePart.substring(dashIndex + 1).trim());
      }
    }

    // --- Create TimeSlot and Section ---
    const timeSlot = new TimeSlot(startTime, endTime, startDate, endDate);
    const section = new Section(
      course.name,
      CRN,
      credits,
      ID,
      instructorString,
      isDistance,
      timeSlot,
      days
    );

    // Add section to course
    if (ID.startsWith("B")) {
      course.addLabSection(section);
    } else {
      course.addCourseSection(section);
    }
  }

  return courseMap;
}

// --- Helper Functions ---

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes; // toggle quote state
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function convertToMinutes(timeString) {
  const [hours, minutes] = timeString.split(":");
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}

function convertDays(daysString) {
  const daysMap = {
    M: "MONDAY",
    T: "TUESDAY",
    W: "WEDNESDAY",
    R: "THURSDAY",
    F: "FRIDAY",
    S: "SATURDAY",
    U: "SUNDAY",
  };
  const result = [];
  for (const char of daysString) {
    if (daysMap[char]) result.push(daysMap[char]);
  }
  return result;
}

function dateBuilder(rawDateString) {
  const dateString = rawDateString.trim();
  const monthMap = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };

  const parts = dateString.split(" ");
  const month = monthMap[parts[0]];
  const day = parseInt(parts[1], 10);

  let year = 2025;
  if (month < 9) year = 2026;

  return new DateTime(year, month, day);
}
