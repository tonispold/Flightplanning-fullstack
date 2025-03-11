import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Flight {
  id: number;
  bookedSeats: number[];
}

const SeatMap: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<number>(1);
  const [recommendedSeats, setRecommendedSeats] = useState<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    windowSeat: false,
    moreLegSpace: false,
    closeToExit: false,
  });

  const seatCount = 60;

  // Define seat categories for filters
  const windowSeats = new Set([
    1, 4, 5, 8, 9, 12, 13, 16, 17, 20, 21, 24, 25, 28, 29, 32, 33, 36, 37, 40,
    41, 44, 45, 48, 49, 52, 53, 56, 57, 60,
  ]);
  const legSpaceSeats = new Set([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 29, 30, 31, 32,
  ]);
  const exitSeats = new Set([1, 2, 3, 4, 29, 30, 31, 32, 57, 58, 59, 60]);

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

  // Toggle filters
  const handleFilterChange = (filter: keyof typeof filters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: !prevFilters[filter],
    }));
  };

  // Seat recommendation logic with improved filtering & grouping
  const recommendSeats = () => {
    if (!flight) return;

    const bookedSeats = new Set(flight.bookedSeats);
    let availableSeats = Array.from(
      { length: seatCount },
      (_, i) => i + 1
    ).filter((seat) => !bookedSeats.has(seat));

    if (availableSeats.length < tickets) {
      setError("Too many tickets, not enough seats available.");
      setRecommendedSeats([]);
      return;
    }

    let filteredSeats: number[] = [];

    // Collect all available seats that match ANY selected filters
    if (filters.windowSeat)
      filteredSeats.push(
        ...availableSeats.filter((seat) => windowSeats.has(seat))
      );
    if (filters.moreLegSpace)
      filteredSeats.push(
        ...availableSeats.filter((seat) => legSpaceSeats.has(seat))
      );
    if (filters.closeToExit)
      filteredSeats.push(
        ...availableSeats.filter((seat) => exitSeats.has(seat))
      );

    // Remove duplicates from multiple filters
    filteredSeats = Array.from(new Set(filteredSeats));

    // Step 1: Recommend all available filtered seats first
    let recommended: number[] = filteredSeats.slice(0, tickets);

    // Step 2: If not enough, find adjacent free seats
    if (recommended.length < tickets) {
      const remainingSeats = availableSeats.filter(
        (seat) => !recommended.includes(seat)
      );

      // Find the best adjacent group
      let bestGroup: number[] = [];
      for (let i = 0; i <= remainingSeats.length - tickets; i++) {
        const group = remainingSeats.slice(i, i + tickets);
        if (group[group.length - 1] - group[0] === tickets - 1) {
          bestGroup = group;
          break;
        }
      }

      // If found, add it to the recommended seats
      if (bestGroup.length > 0) {
        recommended.push(...bestGroup);
      } else {
        // Step 3: If no perfect group, find the closest seats to the already recommended ones
        const remainingNeeded = tickets - recommended.length;
        const remainingFreeSeats = remainingSeats.slice(0, remainingNeeded);

        recommended.push(...remainingFreeSeats);
      }
    }

    setRecommendedSeats(recommended);
    setSelectedSeats([]); // Reset manually selected seats
    setError(null);
  };

  // User manually selects/deselects seats
  const toggleSeatSelection = (seat: number) => {
    if (flight?.bookedSeats.includes(seat)) return;

    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seat)
        ? prevSelected.filter((s) => s !== seat)
        : [...prevSelected, seat]
    );
  };

  if (!flight) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Flight {flight.id} Seat Map</h2>

      {/* Ticket Input and Filters */}
      <div>
        <label>Number of Tickets: </label>
        <input
          type="number"
          value={tickets}
          min={1}
          max={seatCount}
          onChange={(e) => setTickets(parseInt(e.target.value, 10))}
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={filters.windowSeat}
              onChange={() => handleFilterChange("windowSeat")}
            />
            Window Seat
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.moreLegSpace}
              onChange={() => handleFilterChange("moreLegSpace")}
            />
            More Leg Space
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.closeToExit}
              onChange={() => handleFilterChange("closeToExit")}
            />
            Close to Exit
          </label>
        </div>
        <button onClick={recommendSeats}>Recommend Seats</button>
      </div>

      {/* Seat Map */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 40px)",
          gap: "5px",
          marginTop: "20px",
        }}
      >
        {Array.from({ length: seatCount }, (_, i) => i + 1).map((seat) => {
          const isBooked = flight.bookedSeats.includes(seat);
          const isRecommended = recommendedSeats.includes(seat);
          const isSelected = selectedSeats.includes(seat);

          return (
            <div
              key={seat}
              onClick={() => toggleSeatSelection(seat)}
              style={{
                width: "40px",
                height: "40px",
                textAlign: "center",
                lineHeight: "40px",
                borderRadius: "5px",
                backgroundColor: isBooked
                  ? "black"
                  : isSelected
                  ? "green"
                  : isRecommended
                  ? "yellow"
                  : "white",
                color: isBooked ? "white" : "black",
                border: "1px solid gray",
                cursor: isBooked ? "not-allowed" : "pointer",
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
