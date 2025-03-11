import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Flight } from "../types";

const FlightList: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Filter states
  const [destinationFilter, setDestinationFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [maxDurationFilter, setMaxDurationFilter] = useState<string>(""); // New flight duration filter

  // Fetch flights from the backend
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get<Flight[]>(
          "http://localhost:8080/api/flights"
        );

        // Convert flightDate strings to Date objects
        const formattedFlights = response.data.map((flight) => ({
          ...flight,
          flightDate: new Date(flight.flightDate),
        }));

        setFlights(formattedFlights);
        setFilteredFlights(formattedFlights);
      } catch (error) {
        setError("Error fetching flights data");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  // Function to format the date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
  };

  // Convert "2h 30m" to total minutes (e.g., "2h 30m" => 150 minutes)
  const convertDurationToMinutes = (duration: string): number => {
    const hoursMatch = duration.match(/(\d+)h/);
    const minutesMatch = duration.match(/(\d+)m/);

    const hours = hoursMatch ? parseInt(hoursMatch[1]) * 60 : 0; // Convert hours to minutes
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

    return hours + minutes;
  };

  // Auto-refresh filters on every input change
  useEffect(() => {
    let filtered = [...flights];

    if (destinationFilter) {
      filtered = filtered.filter((flight) =>
        flight.destination
          .toLowerCase()
          .includes(destinationFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (flight) => formatDate(flight.flightDate) === dateFilter
      );
    }

    if (priceFilter) {
      filtered = filtered.filter(
        (flight) => flight.price <= parseFloat(priceFilter)
      );
    }

    if (maxDurationFilter) {
      const maxMinutes = parseInt(maxDurationFilter) * 60; // Convert hours to minutes
      filtered = filtered.filter(
        (flight) =>
          convertDurationToMinutes(flight.flightDuration) <= maxMinutes
      );
    }

    setFilteredFlights(filtered);
  }, [destinationFilter, dateFilter, priceFilter, maxDurationFilter, flights]);

  if (loading) return <div>Loading flights...</div>;
  if (error) return <div>{error}</div>;

  // Handle flight selection
  const handleFlightClick = (flightId: number) => {
    navigate(`/seatmap/${flightId}`); // Open seat map page in the same tab
  };

  return (
    <div>
      <h2>Available Flights</h2>

      {/* Filter Form */}
      <div className="filter-form">
        <input
          type="text"
          placeholder="Filter by destination"
          value={destinationFilter}
          onChange={(e) => setDestinationFilter(e.target.value)}
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Duration (hours)"
          value={maxDurationFilter}
          onChange={(e) => setMaxDurationFilter(e.target.value)}
        />
      </div>

      {/* Display filtered flight data */}
      <ul>
        {filteredFlights.map((flight) => (
          <li
            key={flight.id}
            className="flight-item"
            onClick={() => handleFlightClick(flight.id)} // Clickable flight
          >
            <p>
              <strong>Departure:</strong> {flight.departure}
            </p>
            <p>
              <strong>Destination:</strong> {flight.destination}
            </p>
            <p>
              <strong>Flight Date:</strong> {formatDate(flight.flightDate)}
            </p>
            <p>
              <strong>Flight Duration:</strong> {flight.flightDuration}
            </p>
            <p>
              <strong>Price:</strong> ${flight.price}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightList;
