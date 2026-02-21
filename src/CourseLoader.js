function loadCourses(courseList) {
    const courseMap = new Map();
    const lines = courseList.trim().split("\n");
    lines.shift(); // remove header line

    for (const line of lines) {
        const lineData = line.split(",");

        const courseString = lineData[0].trim();
        const sectionString = lineData[1].trim();
        const titleString = lineData[2].trim();
        const isDistance = lineData[3].trim() === "DE";
        let dateString = lineData[4].trim();
        const timeString = lineData[5].trim();
        const instructorString = lineData[6].trim();

        if (!courseMap.has(courseString)) {
            courseMap.set(courseString, new Course(courseString));
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

        if (!isDistance && timeString.includes("(") && timeString.includes(")")) {
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
        const section = new Section(CRN, credits, ID, instructorString, isDistance, timeSlot, days);

        if (ID.startsWith("B")) {
            course.addLabSection(section);
        } else {
            course.addCourseSection(section);
        }
    }

    return courseMap;
}

function convertToMinutes(timeString) {
    const [hours, minutes] = timeString.split(":");
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}

function convertDays(daysString) {
    const daysMap = {
        M: "MONDAY", T: "TUESDAY", W: "WEDNESDAY",
        R: "THURSDAY", F: "FRIDAY", S: "SATURDAY", U: "SUNDAY"
    }

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
        Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
        Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
    };

    let year = 2025;
    const [monthString, dayString] = dateString.split(" ");
    const month = monthMap[monthString];
    const day = parseInt(dayString, 10);

    if (month < 9) {
        year = 2026;
    } 

    return new DateTime(year, month, day);
}