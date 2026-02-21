import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "temporal-polyfill/global";
import "@schedule-x/theme-default/dist/index.css";
import { useEffect, useState } from "react";
import "./Calender.css";
import { Section } from "../../../../Section.js";
import { TimeSlot } from "../../../../TimeSlot.js";
import { DateTime } from "../../../../DateTime.js";
import { DaysOfWeek } from "../../../../DaysOfWeek.js";

function convertMinutes(minutes) {
  return {
    hour: Math.floor(minutes / 60),
    minute: minutes % 60,
  };
}

function convertCoursesToEvents(courses) {
  const dayOfWeekMap = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0,
  };

  const events = [];

  courses.forEach((course) => {
    if (!course.daysOfWeek || course.daysOfWeek.length === 0) return;

    const { hour: startHour, minute: startMinute } = convertMinutes(course.timeSlot.startTime);
    const { hour: endHour, minute: endMinute } = convertMinutes(course.timeSlot.endTime);

    let current = new Date(
      course.timeSlot.startDate.year,
      course.timeSlot.startDate.month - 1,
      course.timeSlot.startDate.day
    );
    const end = new Date(
      course.timeSlot.endDate.year,
      course.timeSlot.endDate.month - 1,
      course.timeSlot.endDate.day
    );

    while (current <= end) {
      const jsDay = current.getDay(); // Sunday = 0

      const matchingDay = course.daysOfWeek.some(
        (d) => dayOfWeekMap[d] === jsDay
      );

      if (matchingDay || course.daysOfWeek.length === 0) {
        events.push({
          name: course.name,
          CRN: course.CRN,
          credits: course.credits,
          id: `${course.ID}_${course.CRN}_${current.getFullYear()}_${current.getMonth()+1}_${current.getDate()}`,
          start: Temporal.ZonedDateTime.from({
            year: current.getFullYear(),
            month: current.getMonth() + 1,
            day: current.getDate(),
            hour: startHour,
            minute: startMinute,
            timeZone: "America/Winnipeg",
          }),
          end: Temporal.ZonedDateTime.from({
            year: current.getFullYear(),
            month: current.getMonth() + 1,
            day: current.getDate(),
            hour: endHour,
            minute: endMinute,
            timeZone: "America/Winnipeg",
          }),
        });
      }

      current.setDate(current.getDate() + 1);
    }
  });

  return events;
}

const timeSlot1 = new TimeSlot(
  9 * 60,   // startTime in minutes (9:00 AM)
  10 * 60 + 15, // endTime in minutes (10:15 AM)
  new DateTime(2026, 1, 1), // startDate
  new DateTime(2026, 1, 30)  // endDate
);

const timeSlot2 = new TimeSlot(
  13 * 60,  // 1:00 PM
  14 * 60 + 15,
  new DateTime(2026, 1, 2),
  new DateTime(2026, 1, 30)
);

const timeSlot3 = new TimeSlot(
  null,
  null,
  new DateTime(2026, 1, 3),
  new DateTime(2026, 1, 30)
);

// --- Create mock Sections ---
export const courses = [
  new Section(
    "COMP 1010",
    12345,
    3,
    "A01",
    "Dr. Smith",
    false,                  // not distance
    timeSlot1,
    [DaysOfWeek.MONDAY, DaysOfWeek.WEDNESDAY]
  ),

  new Section(
    "MATH 1500",
    23456,
    3,
    "B02",
    "Dr. Johnson",
    false,
    timeSlot2,
    [DaysOfWeek.TUESDAY, DaysOfWeek.THURSDAY]
  ),

  new Section(
    "COMP 2080",
    34567,
    3,
    "D01",
    "Dr. Lee",
    true,                   // distance course
    timeSlot3,
    []                      // no in-person days
  )
];

export function Calender() {
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const events = convertCoursesToEvents(courses);
  const calender = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: events,
    plugins: [eventsService],
  });
  useEffect(() => {
    eventsService.getAll();
  }, []);
  return (
    <>
      <div className="calendar-wrapper">
        <ScheduleXCalendar calendarApp={calender} />
      </div>
    </>
  );
}
