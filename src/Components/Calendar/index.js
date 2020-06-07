import React, { useState } from 'react';
import format from 'date-fns/format';
import add from 'date-fns/addMonths';
import sub from 'date-fns/subMonths';
import start from 'date-fns/startOfWeek';
import end from 'date-fns/endOfWeek';
import startMonth from 'date-fns/startOfMonth';
import endMonth from 'date-fns/endOfMonth';
import addDay from 'date-fns/addDays';
import sameMonth from 'date-fns/isSameMonth';
import sameDay from 'date-fns/isSameDay';
import './styles.css';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const header = () => {
        const dateFormat = "MMMM yyyy";

        function nextMonth() {
            setCurrentDate(add(currentDate, 1));
        }
        function prevMonth() {
            setCurrentDate(sub(currentDate, 1));
        }
        return (
            <div className="header row flex-middle">
                <div className="column col-start">
                    <div className="icon" onClick={prevMonth}>
                        chevron_left
                    </div>
                </div>
                <div className="column col-center">
                    <span>{format(currentDate, dateFormat)}</span>
                </div>
                <div className="column col-end">
                    <div className="icon" onClick={nextMonth}>
                        chevron_right
                    </div>
                </div>
            </div>
        );
    };
    const weekdays = () => {
        const dateFormat = 'EEEE';
        const days = [];
        let startDate = start(currentDate);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="column col-center" key={i}>
                    {format(addDay(startDate, i), dateFormat)}
                </div>
            );
        }
        return <div className="days row">{days}</div>
    };
    const cells = () => {
        const monthStart = startMonth(currentDate);
        const monthEnd = endMonth(monthStart);
        const startDate = start(monthStart);
        const endDate = end(monthEnd);
        const dateFormat = 'd';
        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";

        function onDateClick(day) {
            setSelectedDate(day);
        }

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const auxDay = day;
                days.push(
                    <div className={
                        `column cell ${!sameMonth(day, monthStart)
                            ? "disabled"
                            : sameDay(day, selectedDate)
                                ? "selected"
                                : ""}`}
                        key={day}
                        onClick={() => onDateClick(auxDay)}>
                        <span className="number">{formattedDate}</span>
                        <span className="bg">{formattedDate}</span>
                    </div>
                );
                day = addDay(day, 1);
            }
            rows.push(
                <div className="row" key={day}>{days}</div>
            );
            days = [];
        }
        return <div className="body">{rows}</div>
    };
    return (
        <div className="calendar">
            <div>{header()}</div>
            <div>{weekdays()}</div>
            <div>{cells()}</div>
        </div>
    );
}
export default Calendar;