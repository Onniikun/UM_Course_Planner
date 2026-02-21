import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewDay, createViewMonthAgenda, createViewMonthGrid, createViewWeek } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from 'react'
import './Calender.css'

import { Section } from "../../../../Section.js";
import { TimeSlot } from "../../../../TimeSlot.js";
import { DateTime } from "../../../../DateTime.js";
import { DaysOfWeek } from "../../../../DaysOfWeek.js";

import { useLocation } from 'react-router-dom';
import { main } from '../../../../algorithm';
import { filter } from '../../../../filterCourses.js';
import { loadCourses } from '../../../../courseLoader';
import fallCourseList from '../../../../fallCourseList.csv?raw';
import winterCourseList from '../../../../winterSummerCourseList.csv?raw';

const courseMap = loadCourses(fallCourseList); // Load courses once at the top level

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
      const jsDay = current.getDay();
      const matchingDay = course.daysOfWeek.some(
        (d) => dayOfWeekMap[d] === jsDay
      );

      if (matchingDay) {
        events.push({
          id: course.CRN,
          name: course.name,
          title: course.name,
          start: Temporal.ZonedDateTime.from({
            year: current.getFullYear(),
            month: current.getMonth() + 1,
            day: current.getDate(),
            hour: startHour-6, // correctional offset for timezone correlation
            minute: startMinute,
            timeZone: "America/Winnipeg",
          }),
          end: Temporal.ZonedDateTime.from({
            year: current.getFullYear(),
            month: current.getMonth() + 1,
            day: current.getDate(),
            hour: endHour-6, // correctional offset for timezone correlation
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


export function Calender() {
    const eventsService = useState(() => createEventsServicePlugin())[0]

    //mockdata 
    const Courses = [
        {   
            id: '1', 
            title: 'Math 101', 
            startDate: { year: 2026, month: 2, day: 22 }, 
            startTime: 500, 
            endDate: { year: 2026, month: 2, day: 22 }, 
            endTime: 700 
        },
    ]

    // Hour/Minute Converter
    const getTime = (minutes) => ({
        hour: Math.floor(minutes / 60),
        minute: minutes % 60
    })
    const events = Courses.map(course => {
        const { hour: startHour, minute: startMinute } = getTime(course.startTime)
        const { hour: endHour, minute: endMinute } = getTime(course.endTime)

        return {
                id: course.id,
                title: course.title,
                start: Temporal.ZonedDateTime.from({
                year: course.startDate.year,
                month: course.startDate.month,
                day: course.startDate.day,
                hour: startHour,
                minute: startMinute,
                timeZone: 'America/Winnipeg'
            }),
                end: Temporal.ZonedDateTime.from({
                year: course.endDate.year,
                month: course.endDate.month,
                day: course.endDate.day,
                hour: endHour,
                minute: endMinute,
                timeZone: 'America/Winnipeg'
            })
        }
        })

    const calender = useCalendarApp({views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: events,
    plugins: [eventsService]
});
useEffect(() => {
    eventsService.getAll() 
}, [])
    return(
        <>
        <div className="calendar-wrapper">
            <ScheduleXCalendar calendarApp={calender} />
        </div>
        <h2>Submitted Courses</h2>
        <ul>
          {courses.map((course, index) => (
            <li key={index}>
              {course.title}
            </li>
          ))}
        </ul>

        <h2>Generated Schedules:</h2>
        {schedules.length === 0 ? (
          <p>No schedules generated.</p>
        ) : (
          schedules.map((schedule, index) => (
            <div key={index} className="schedule">
              <h3>Schedule {index + 1}</h3>
              <ul>
                {schedule.map((section, idx) => (
                  <li key={idx}>
                    Name: {section.name}, CRN: {section.CRN}, Time: {section.timeSlot.startTime}-{section.timeSlot.endTime}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
    </>
  )
}
