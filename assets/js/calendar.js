"use strict";

// Array of week day names
let weekDaysNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Array of month names
let monthsNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Get the current date
let date = new Date();
let ActualMonth = date.getMonth();

// Asynchronous function to load events
async function loadEvents() {
    try {
        const response = await fetch('./php/api.php');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// Function to create a calendar div
function createDiv(content, col, event = null) {
    let calendarDiv = document.getElementById("calendar");
    let newDiv = document.createElement("div");
    let newP = document.createElement("p");
    let newContent = document.createTextNode(content);

    newP.appendChild(newContent);
    newDiv.appendChild(newP);

    newDiv.classList.add(col);

    if (event) {
        newDiv.classList.add('event');
        newDiv.setAttribute('title', event.description);
    }

    calendarDiv.appendChild(newDiv);
}

// Function to print days before the current month
function printDaysBefore(date) {
    let firstWeekDayActualMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    let day = (new Date(date.getFullYear(), date.getMonth(), 0).getDate() - firstWeekDayActualMonth) + 1;

    for (let i = firstWeekDayActualMonth; i > 0; i--) {
        createDiv(day.toString(), "week");
        day++;
    }
}

// Function to print days after the current month
function printDaysAfter(date) {
    let lastWeekDayActualMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1).getDay();
    let day = 1;

    for (let i = 7 - lastWeekDayActualMonth; i > 0; i--) {
        createDiv(day.toString(), "week");
        day++;
    }
}

// Function to print the calendar
async function printCalendar(date) {
    let JSONevents = await loadEvents();
    document.getElementById("event-titles").innerHTML = "";
    showEventDetails(JSONevents);
    let calendarDiv = document.getElementById("calendar");

    calendarDiv.innerHTML = "";

    createDiv(monthsNames[date.getMonth()], "monthName");
    createDiv(date.getFullYear().toString(), "year");

    let monthDays = [];

    for (let i = 0; i < new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); i++) {
        monthDays[i] = i + 1;
    }

    weekDaysNames.forEach(day => {
        createDiv(day, "weekNames");
    });

    printDaysBefore(date);

    monthDays.forEach(day => {
        let eventForDay = JSONevents.events.filter(event => {
            let eventDate = new Date(event.start);
            return eventDate.getDate() === day && eventDate.getMonth() === date.getMonth() && eventDate.getFullYear() === date.getFullYear();
        });

        if (date.getDate() === day && ActualMonth === date.getMonth()) {
            createDiv(day.toString(), "actualDay", eventForDay.length > 0 ? eventForDay[0] : null);
        } else {
            createDiv(day.toString(), "week", eventForDay.length > 0 ? eventForDay[0] : null);
        }
    });

    printDaysAfter(date);
}

// Function to navigate to the next month
function nextMonth(date) {
    date.setMonth(date.getMonth() + 1);
    printCalendar(date);
}

// Function to navigate to the previous month
function previousMonth(date) {
    date.setMonth(date.getMonth() - 1);
    printCalendar(date);
}

// Function to show event details
function showEventDetails(JSONevents) {
    let eventTitlesDiv = document.getElementById("event-titles");

    JSONevents.events.forEach(event => {
        let eventDiv = document.createElement("div");
        eventDiv.classList.add("event-title");
        console.log(eventTitlesDiv);

        let titleP = document.createElement("p");
        let newContent = document.createTextNode(event.title);
        console.log(newContent);
        titleP.appendChild(newContent);

        eventDiv.appendChild(titleP);
        eventTitlesDiv.appendChild(eventDiv);
    });
}

// Initial call to print the calendar
printCalendar(date);
