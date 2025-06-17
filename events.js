const fs = require('fs');
const path = require('path');

const eventsFilePath = path.join(__dirname, 'events.json');

function loadEvents() {
    if (!fs.existsSync(eventsFilePath)) {
        fs.writeFileSync(eventsFilePath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(eventsFilePath));
}

function saveEvents(events) {
    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
}

function addEvent(eventData) {
    const events = loadEvents();
    const newEvent = {
        id: Date.now().toString(),
        title: eventData.title,
        date: eventData.date,
        time: eventData.time,
        description: eventData.description,
        createdAt: new Date().toISOString()
    };
    events.push(newEvent);
    saveEvents(events);
    return newEvent;
}

function updateEvent(eventId, eventData) {
    const events = loadEvents();
    const eventIndex = events.findIndex(event => event.id === eventId);
    if (eventIndex !== -1) {
        events[eventIndex] = {
            ...events[eventIndex],
            title: eventData.title,
            date: eventData.date,
            time: eventData.time,
            description: eventData.description,
            updatedAt: new Date().toISOString()
        };
        saveEvents(events);
        return events[eventIndex];
    }
    return null;
}

function deleteEvent(eventId) {
    const events = loadEvents();
    const filteredEvents = events.filter(event => event.id !== eventId);
    if (filteredEvents.length !== events.length) {
        saveEvents(filteredEvents);
        return true;
    }
    return false;
}

function getEventById(eventId) {
    const events = loadEvents();
    return events.find(event => event.id === eventId);
}

function getUpcomingEvents() {
    const events = loadEvents();
    const now = new Date();
    return events
        .filter(event => {
            const eventDateTime = new Date(`${event.date}T${event.time}`);
            return eventDateTime >= now;
        })
        .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });
}

module.exports = {
    loadEvents,
    saveEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getUpcomingEvents
};
