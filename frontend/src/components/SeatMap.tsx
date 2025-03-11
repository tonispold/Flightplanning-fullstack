import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Flight {
  id: number;
  bookedSeats: number[]; // Store booked seat numbers
}

const SeatMap: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [error, setError] = useState<string | null>(null);

  const seatCount = 60;

  // Fetch flight data
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/flights/${id}`)
      .then((response) => {
        setFlight(response.data);
      })
      .catch(() => {
        setError("Flight not found.");
      });
  }, [id]);

  if (!flight) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Flight {flight.id} Seat Map</h2>

      {/* Seat Map */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 35px)", // Adjust for 10 columns in the grid
          gap: "5px",
          marginTop: "20px",
        }}
      >
        {Array.from({ length: seatCount }, (_, i) => i + 1).map((seat) => {
          const isBooked = flight.bookedSeats.includes(seat);

          return (
            <div
              key={seat}
              style={{
                width: "40px",
                height: "40px",
                textAlign: "center",
                lineHeight: "40px",
                borderRadius: "5px",
                backgroundColor: isBooked ? "black" : "white", // Black for booked seats
                color: isBooked ? "white" : "black", // White text for booked seats
                border: "1px solid gray",
                cursor: isBooked ? "not-allowed" : "pointer", // Not clickable for booked seats
              }}
            >
              {seat}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeatMap;
