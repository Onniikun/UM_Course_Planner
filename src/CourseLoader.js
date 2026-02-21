import { Course } from "./Course.js";
import { Section } from "./Section.js";
import { TimeSlot } from "./TimeSlot.js";
import { DateTime } from "./DateTime.js";

export function loadCourses(courseList) {
  const courseMap = new Map();
  const lines = courseList.trim().split("\n");
  lines.shift(); // remove header line

  for (const line of lines) {
    console.log(line); // TESINGGGGGGGGGGGGGGGTESINGGGGGGGGGGGGGGGTESINGGGGGGGGGGGGGGGTESINGGGGGGGGGGGGGGGTESINGGGGGGGGGGGGGGG
    const lineData = parseCSVLine(line);

    if (!lineData || lineData.length < 5) continue;
    const courseString = lineData[0].trim();
    const sectionString = lineData[1].trim();
    const titleString = lineData[2].trim();
    const isDistance = lineData[3].trim() === "DE";
    let dateString = lineData[4].trim();
    let timeString;
    let instructorString;

    // Check if course is distance OR if there are only 6 columns (no time)
    if (isDistance || lineData.length === 6) {
      instructorString = lineData[5].trim();
      timeString = null; // no time info
    } else if (lineData.length >= 7) {
      timeString = lineData[5].trim();
      instructorString = lineData[6].trim();
    } else {
      // fallback for unexpected line format
      console.warn("Unexpected line format:", line);
      continue; // skip this row or handle differently
    }

    if (!courseMap.has(courseString)) {
      // Pass the proper title to the Course constructor
      const title = titleString
        .substring(0, titleString.lastIndexOf("("))
        .trim();
      courseMap.set(courseString, new Course(courseString, title));
    }
    const course = courseMap.get(courseString);

    // ---Section---
    const ID = sectionString.trim().split(" ")[0];
    const CRN = parseInt(sectionString.split("(")[1].split(")")[0], 10);

    // ---Title---
    const title = titleString.substring(0, titleString.lastIndexOf("(")).trim();

    // ---Credits---
    const credits = parseInt(
      titleString.substring(
        titleString.lastIndexOf("(") + 1,
        titleString.lastIndexOf(")")
      ),
      10
    );

    // ---Date---
    if (dateString[0] === '"') {
      dateString = dateString.substring(1);
    }
    const [startDateString, endDateString] = dateString.split(" - ");
    const startDate = dateBuilder(startDateString);
    const endDate = dateBuilder(endDateString);

    // ---Time---
    let startTime = null;
    let endTime = null;
    let days = [];

    if (
      !isDistance &&
      timeString &&
      timeString.includes("(") &&
      timeString.includes(")")
    ) {
      const duration = timeString.substring(0, timeString.indexOf("(")).trim();

      const daysString = timeString.substring(
        timeString.indexOf("(") + 1,
        timeString.indexOf(")")
      );

      const [startString, endString] = duration.split("-");

      startTime = convertToMinutes(startString);
      endTime = convertToMinutes(endString);
      days = convertDays(daysString);
    }

    // TimeSlot and Section objects
    const timeSlot = new TimeSlot(startTime, endTime, startDate, endDate);
    const section = new Section(
      CRN,
      credits,
      ID,
      instructorString,
      isDistance,
      timeSlot,
      days
    );

    if (ID.startsWith("B")) {
      course.addLabSection(section);
    } else {
      course.addCourseSection(section);
    }
  }

  return courseMap;
}

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
  
    // push the last field
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

  for (let i = 0; i < daysString.length; i++) {
    const char = daysString[i];
    const dayName = daysMap[char];
    if (dayName) {
      result.push(dayName);
    }
  }

  return result;
}

function dateBuilder(dateString) {
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

  let year = 2025;
  console.log(dateString);
  const [monthString, dayString] = dateString.split(" ");
  const month = monthMap[monthString];
  const day = parseInt(dayString, 10);

  if (month < 9) {
    year = 2026;
  }

  return new DateTime(year, month, day);
}
