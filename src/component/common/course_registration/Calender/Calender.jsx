import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewDay, createViewMonthAgenda, createViewMonthGrid, createViewWeek } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from 'react'
import './Calender.css'
import { useLocation } from 'react-router-dom';
import { main } from '../../../../algorithm';
import { filter } from '../../../../filterCourses.js';
import { loadCourses } from '../../../../courseLoader';
import fallCourseList from '../../../../fallCourseList.csv?raw';
import winterCourseList from '../../../../winterSummerCourseList.csv?raw';

const courseMap = loadCourses(fallCourseList); // Load courses once at the top level

export function Calender() {

  const location = useLocation();
  const courses = location.state?.courses || []; // get courses from Department
  const constraints = location.state?.constraints || {
    isMWF: false,
    isTT: false,
    earliestTime: null,
    latestTime: null,
  };

  for (const course of courses) {
    console.log(`Course: ${course.name}`);
  }

  const schedules = main(courses, constraints); // generate schedules using algorithm

  for (const schedule of schedules) {
    console.log("Schedule:");
    for (const section of schedule) {
      console.log(` Section: ${section.CRN}, Time: ${section.timeSlot.startTime}-${section.timeSlot.endTime}`);
    }
  }

  const classes = useState(() => createEventsServicePlugin())[0]
  const calender = useCalendarApp({
    views: [createViewMonthGrid()],
    classes: [
      {
        id: 1,
        title: 'Class 1',
        start: Temporal.PlainDate.from('2026-12-16'),
        end: Temporal.PlainDate.from('2026-12-16'),
      },
    ],
    plugins: [classes]
  });
  useEffect(() => {
    classes.getAll()
  }, [])
  return (
    <>
      <div>
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
                    CRN: {section.CRN}, Time: {section.timeSlot.startTime}-{section.timeSlot.endTime}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </>
  )
}
