import React from "react";
import ScheduleForm from "./components/ScheduleForm";
import ScheduleList from "./components/ScheduleList";
import CalendarView from "./components/CalendarView";

function App() {
  return (
    <div className="App">
      <h1>Smart Irrigation Scheduler</h1>
      <ScheduleForm />
      <ScheduleList />
      <CalendarView />
    </div>
  );
}

export default App;
