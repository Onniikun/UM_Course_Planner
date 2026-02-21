import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewDay,createViewMonthAgenda, createViewMonthGrid, createViewWeek } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from 'react'
import './Calender.css'

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
        </>
    )
}