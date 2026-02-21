import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewDay,createViewMonthAgenda, createViewMonthGrid, createViewWeek } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from 'react'
import './Calender.css'

export function Calender() {
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
    return(
        <>
        <div>
            <ScheduleXCalendar calendarApp={calender} />
        </div>
        </>
    )
}