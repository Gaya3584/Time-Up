import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import './CalendarView.css';

const CalendarView = ({ schedules }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const notificationTimeouts = useRef(new Map());
  const calendarRef = useRef(null);

  // Clean up timeouts on unmount
  useEffect(() => {
    const timeoutsMap = notificationTimeouts.current;

    return () => {
      timeoutsMap.forEach(timeout => clearTimeout(timeout));
      timeoutsMap.clear();
    };
  }, []);

  // Request notification permission once
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!schedules || schedules.length === 0) {
      setEvents([]);
      // Clear existing timeouts
      const timeoutsMap = notificationTimeouts.current;
      timeoutsMap.forEach(timeout => clearTimeout(timeout));
      timeoutsMap.clear();
      return;
    }

    // Clear existing timeouts
    const timeoutsMap = notificationTimeouts.current;
    timeoutsMap.forEach(timeout => clearTimeout(timeout));
    timeoutsMap.clear();

    // Transform schedules to calendar events
    const calendarEvents = schedules.map((schedule) => {
      const scheduleDate = new Date(schedule.scheduledDate);
      const now = Date.now();
      const scheduleTime = scheduleDate.getTime();
      const delay = scheduleTime - now;

      // Schedule notification for future events
      if (delay > 0) {
        const timeoutId = setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification("🌱 Irrigation Reminder", {
              body: `Time to irrigate your ${schedule.cropType}`,
              icon: "🌱",
              badge: "🌱"
            });
          }
          // Remove from timeouts map after firing
          notificationTimeouts.current.delete(schedule._id);
        }, delay);

        notificationTimeouts.current.set(schedule._id, timeoutId);
      }

      return {
        id: schedule._id,
        title: schedule.cropType,
        start: schedule.scheduledDate,
        extendedProps: {
          time: scheduleDate.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          cropType: schedule.cropType,
          location: schedule.location,
          soilType: schedule.soilType,
          irrigationNeeded: schedule.irrigationNeeded,
          phoneNumber: schedule.phoneNumber
        }
      };
    });

    setEvents(calendarEvents);
  }, [schedules]);

  // Handle date selection
  const handleDateClick = (dateInfo) => {
    const clickedDate = dateInfo.dateStr;
    setSelectedDate(clickedDate);
    
    // Find events for the selected date
    const eventsOnDate = events.filter(event => {
      const eventDate = new Date(event.start).toISOString().split('T')[0];
      return eventDate === clickedDate;
    });
    
    setSelectedDateEvents(eventsOnDate);
  };

  // Handle view change and update title
  const handleViewChange = (viewInfo) => {
    setCurrentView(viewInfo.view.type);
    setCurrentTitle(viewInfo.view.title);
  };

  // Update title when calendar changes
  const updateCalendarTitle = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setCurrentTitle(calendarApi.view.title);
    }
  };

  // Custom navigation functions
  const goToToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      setSelectedDate(new Date().toISOString().split('T')[0]);
      updateCalendarTitle();
    }
  };

  const goToPrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      updateCalendarTitle();
    }
  };

  const goToNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      updateCalendarTitle();
    }
  };

  const changeToMonthView = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView('dayGridMonth');
      setCurrentView('dayGridMonth');
      updateCalendarTitle();
    }
  };

  const changeToWeekView = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView('dayGridWeek');
      setCurrentView('dayGridWeek');
      updateCalendarTitle();
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div className="event-content">
        <div className="event-title">{eventInfo.event.title}</div>
        <div className="event-time">{eventInfo.event.extendedProps.time}</div>
      </div>
    );
  };

  const formatSelectedDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Irrigation Schedule</h2>
        <p>Manage your crop watering times</p>
      </div>

      {/* Custom Navigation Bar */}
      <div className="custom-nav-bar">
        <div className="nav-section nav-left">
          <button className="nav-button prev-button" onClick={goToPrev}>
            ← Previous
          </button>
          <button className="nav-button next-button" onClick={goToNext}>
            Next →
          </button>
          <button className="nav-button today-button" onClick={goToToday}>
            Today
          </button>
        </div>
        
        <div className="nav-section nav-center">
          <h3 className="calendar-title">{currentTitle}</h3>
        </div>
        
        <div className="nav-section nav-right">
          <button 
            className={`nav-button view-button ${currentView === 'dayGridMonth' ? 'active' : ''}`}
            onClick={changeToMonthView}
          >
            Month
          </button>
          <button 
            className={`nav-button view-button ${currentView === 'dayGridWeek' ? 'active' : ''}`}
            onClick={changeToWeekView}
          >
            Week
          </button>
        </div>
      </div>
      
      <div className="calendar-wrapper">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false} // Disable default toolbar since we're using custom navigation
          events={events}
          eventContent={renderEventContent}
          height="auto"
          dayMaxEvents={3}
          moreLinkClick="popover"
          eventDisplay="block"
          displayEventTime={false}
          dateClick={handleDateClick}
          viewDidMount={handleViewChange}
          datesSet={updateCalendarTitle} // Update title when dates change
          selectable={true}
          selectMirror={true}
        />
      </div>

      {/* Selected Date Information */}
      {selectedDate && (
        <div className="selected-date-info">
          <div className="selected-date-header">
            <h3>Selected Date: {formatSelectedDate(selectedDate)}</h3>
          </div>
          
          {selectedDateEvents.length > 0 ? (
            <div className="selected-date-events">
              <h4>Scheduled Irrigations ({selectedDateEvents.length}):</h4>
              <div className="events-list">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="event-detail-card">
                    <div className="event-detail-header">
                      <span className="crop-icon">🌱</span>
                      <span className="crop-name">{event.extendedProps.cropType}</span>
                      <span className="event-time-badge">{event.extendedProps.time}</span>
                    </div>
                    
                    {event.extendedProps.location && (
                      <div className="event-detail-row">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">{event.extendedProps.location}</span>
                      </div>
                    )}
                    
                    {event.extendedProps.soilType && (
                      <div className="event-detail-row">
                        <span className="detail-icon">🌍</span>
                        <span className="detail-text">{event.extendedProps.soilType}</span>
                      </div>
                    )}
                    
                    {event.extendedProps.irrigationNeeded && (
                      <div className="event-detail-row">
                        <span className="detail-icon">💧</span>
                        <span className="detail-text">{event.extendedProps.irrigationNeeded}</span>
                      </div>
                    )}
                    
                    {event.extendedProps.phoneNumber && (
                      <div className="event-detail-row">
                        <span className="detail-icon">📞</span>
                        <span className="detail-text">{event.extendedProps.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-events">
              <p>No irrigation scheduled for this date</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;