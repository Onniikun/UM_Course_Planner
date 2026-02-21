import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewDay,createViewMonthAgenda, createViewMonthGrid, createViewWeek } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from 'react'
import './Calender.css'

export function Calender() {
    const eventsService = useState(() => createEventsServicePlugin())[0]
    const calender = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: [
        {
        id: 1,
        title: 'Class 1',
        start: Temporal.PlainDate.from({
            year: 2026,
            month: 2,
            day: 16,
            hour: 9,
            minute: 0
        }),
        end: Temporal.PlainDate.from({
            year: 2026,
            month: 2,
            day: 16,
            hour: 10,
            minute: 0
        }),
        },
    ],
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