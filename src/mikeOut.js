class Date {
  constructor(year, month, day) {
    this.year = year;
    this.month = month;
    this.day = day;
  }
}

const DaysOfWeek = Object.freeze({
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY",
  SUNDAY: "SUNDAY"
});


class TimeSlot {
  constructor(startTime, endTime, startDate, endDate) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

class Section {
  constructor(CRN, credits, ID, instructor, distanceCourse = false, timeSlot, daysOfWeek = []) {
    this.CRN = CRN;
    this.credits = credits;
    this.ID = ID;
    this.instructor = instructor;
    this.distanceCourse = distanceCourse;
    this.timeSlot = timeSlot;
    this.daysOfWeek = daysOfWeek;
  }
}


class Course {
  constructor(name, title, spanning = false, requiresLab = false, passFailCourse = false) {
    this.name = name;
    this.title = title;
    this.spanning = spanning;
    this.requiresLab = requiresLab;
    this.passFailCourse = passFailCourse;
    this.courseSections = [];
    this.labSections = [];
  }

  addCourseSection(section) {
    if (!section) return;
    this.courseSections.push(section);
  }

  addLabSection(section) {
    if (!section) return;
    this.labSections.push(section);
  }
}

export function output() {
  // return a Map of course objects with the course name as the key and the course object as the value. Fill some place holder values
  const courses = new Map();

  for (let i = 0; i < 10; i++) {
    const courseName = `Course ${i}`;
    const courseTitle = `Course Title ${i}`;
    const courseObj = new Course(courseName, courseTitle);

    courses.set(courseName, courseObj);
  }

  // add COMP 1010
  const comp1010 = new Course("COMP 1010", "Intro to Computer Science");
  comp1010.addCourseSection(new Section("CRN101", 3, "001", "Dr. Smith", false, new TimeSlot(540, 630, new Date(2024, 8, 1), new Date(2024, 12, 15)), [DaysOfWeek.MONDAY, DaysOfWeek.WEDNESDAY, DaysOfWeek.FRIDAY]));
  courses.set("COMP 1010", comp1010);

  // add one that fits the constraints and one that doesnt
  //{
  // "isMWF": true,
  // "earliest": "540",
  // "latest": "900"
// }

  const comp2020 = new Course("COMP 2020", "Data Structures");
  comp2020.addCourseSection(new Section("CRN202", 3, "001", "Dr. Johnson", false, new TimeSlot(600, 690, new Date(2024, 8, 1), new Date(2024, 12, 15)), [DaysOfWeek.MONDAY, DaysOfWeek.WEDNESDAY, DaysOfWeek.FRIDAY]));
  courses.set("COMP 2020", comp2020);

  const comp3030 = new Course("COMP 3030", "Algorithms");
  comp3030.addCourseSection(new Section("CRN303", 3, "001", "Dr. Lee", false, new TimeSlot(900, 990, new Date(2024, 8, 1), new Date(2024, 12, 15)), [DaysOfWeek.TUESDAY, DaysOfWeek.THURSDAY]));
  courses.set("COMP 3030", comp3030);



  return courses;
}
