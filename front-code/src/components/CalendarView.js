import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { fetchSchedules } from "../services/scheduleService";

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [notifiedSchedules, setNotifiedSchedules] = useState(new Set());

  useEffect(() => {
    Notification.requestPermission();

    const fetchAndUpdate = async () => {
      try {
        const data = await fetchSchedules();

        // Format events
        const calendarEvents = data.map((item) => ({
          title: `${item.cropType} at ${new Date(item.scheduledDate).toLocaleTimeString()}`,
          start: item.scheduledDate,
        }));
        setEvents(calendarEvents);

        // Schedule new notifications
        const now = Date.now();

        data.forEach((item) => {
          const scheduleTime = new Date(item.scheduledDate).getTime();

          // If not notified and time is in the future
          if (
            !notifiedSchedules.has(item._id) && // assuming each item has unique _id
            scheduleTime > now
          ) {
            const delay = scheduleTime - now;

            setTimeout(() => {
              if (Notification.permission === "granted") {
                new Notification("Irrigation Time!", {
                  body: `Time to irrigate ${item.cropType}`,
                });
              }
            }, delay);

            // Add to notified set
            setNotifiedSchedules((prev) => new Set(prev).add(item._id));
          }
        });
      } catch (err) {
        console.error("Error fetching schedules:", err);
      }
    };

    // Initial fetch
    fetchAndUpdate();

    // Poll every 30 seconds
    const intervalId = setInterval(fetchAndUpdate, 30000);

    // Clean up interval
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>Irrigation Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />
    </div>
  );
};

export default CalendarView;
