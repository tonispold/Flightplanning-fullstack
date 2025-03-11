import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FlightList from "./components/FlightList";
import SeatMap from "./components/SeatMap";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FlightList />} />
        <Route path="/seatmap/:id" element={<SeatMap />} />
      </Routes>
    </Router>
  );
};

export default App;
