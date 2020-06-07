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
import weekend from 'date-fns/isWeekend';

import './styles.css';
import axios from 'axios';
const Calendar = () => {
    const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
    const API_KEY = '0b177100caf71a656b93bfd11c06f133';
    const LOCATION_CODE = '5128581';
    const FULL_API_URL = `${API_URL}?id=${LOCATION_CODE}&appid=${API_KEY}`;
    const [temperature,setTemperature] = useState();
    const [weather,setWeather] = useState();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    axios.get(FULL_API_URL)
    .then(response => {
        const temp = response.data.main.temp;
        const city = response.data.name;
        /* const date = response.data.dt_txt; */
        const celsiusTemp = temp-273.15;
        const desc = response.data.clouds.all;
        var clouds = 'Sunny';
        if(desc>50){
            clouds = 'Cloudy'
        }
        const weatherDisplay = `Temperature = ${celsiusTemp.toFixed(1)}ºC , City=${city}, Weather:${clouds}`;
        console.log(weatherDisplay)
        setTemperature(celsiusTemp.toFixed(1));
        setWeather(clouds);
        console.log(weather);
        
    })
    .catch(error=>console.log(`Error: ${error}`));

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
                        id={`${weekend(day) ? "weekendbg" : ""}`}
                        key={day}
                        onClick={() => onDateClick(auxDay)}>
                        <span className={`number ${weekend(day) ? "weekend" : ""}`}>{formattedDate}</span>
                        <span className={`${sameDay(day,selectedDate)?"temp":"notSelected"}`}>{weather} {temperature}ºC</span>
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