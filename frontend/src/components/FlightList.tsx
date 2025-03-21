import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Flight } from "../types";
import { textFieldStyles } from "../styles";
import { numberFieldStyles } from "../styles";
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";

const FlightList: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter states
  const [departureFilter, setDepartureFilter] = useState<string>("");
  const [destinationFilter, setDestinationFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [maxDurationFilter, setMaxDurationFilter] = useState<string>("");

  // Fetch flights
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get<Flight[]>(
          "http://localhost:8080/api/flights"
        );
        const formattedFlights = response.data.map((flight) => ({
          ...flight,
          flightDate: new Date(flight.flightDate),
        }));
        setFlights(formattedFlights);
        setFilteredFlights(formattedFlights);
      } catch (error) {
        console.error("Error fetching flights data", error);
        setError("Error fetching flights data");
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  // Function to format the date
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // Convert duration to total minutes
  const convertDurationToMinutes = (duration: string): number => {
    const hoursMatch = duration.match(/(\d+)h/);
    const minutesMatch = duration.match(/(\d+)m/);
    const hours = hoursMatch ? parseInt(hoursMatch[1]) * 60 : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    return hours + minutes;
  };

  const clearFilters = () => {
    setDepartureFilter("");
    setDestinationFilter("");
    setDateFilter("");
    setPriceFilter("");
    setMaxDurationFilter("");
  };

  // Auto-refresh filters on every input change
  useEffect(() => {
    let filtered = [...flights];

    if (departureFilter) {
      filtered = filtered.filter((flight) =>
        flight.departure.toLowerCase().includes(departureFilter.toLowerCase())
      );
    }

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
      const maxMinutes = parseInt(maxDurationFilter) * 60;
      filtered = filtered.filter(
        (flight) =>
          convertDurationToMinutes(flight.flightDuration) <= maxMinutes
      );
    }

    setFilteredFlights(filtered);
  }, [
    departureFilter,
    destinationFilter,
    dateFilter,
    priceFilter,
    maxDurationFilter,
    flights,
  ]);

  if (loading) return <Typography>Loading flights...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  // Handle flight selection
  const handleFlightClick = (flightId: number) => {
    navigate(`/seatmap/${flightId}`);
  };

  return (
    <Box className="content-box" p={3}>
      <Typography variant="h4" gutterBottom>
        Available Flights
      </Typography>

      <Grid2
        container
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 2,
          mb: 3,
        }}
      >
        <Grid2
          sx={{
            gridColumn: "span 12",
            "@media (min-width:600px)": { gridColumn: "span 6" },
            "@media (min-width:960px)": { gridColumn: "span 3" },
          }}
        >
          <TextField
            id="departure-filter"
            label="Departure"
            variant="outlined"
            sx={textFieldStyles}
            fullWidth
            value={departureFilter}
            onChange={(e) => setDepartureFilter(e.target.value)}
          />
        </Grid2>
        <Grid2
          sx={{
            gridColumn: "span 12",
            "@media (min-width:600px)": { gridColumn: "span 6" },
            "@media (min-width:960px)": { gridColumn: "span 3" },
          }}
        >
          <TextField
            id="destination-filter"
            label="Destination"
            variant="outlined"
            sx={textFieldStyles}
            fullWidth
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
          />
        </Grid2>
        <Grid2
          sx={{
            gridColumn: "span 12",
            "@media (min-width:600px)": { gridColumn: "span 6" },
            "@media (min-width:960px)": { gridColumn: "span 3" },
          }}
        >
          <TextField
            id="date-filter"
            label="Flight Date"
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="custom-date-field"
          />
        </Grid2>
        <Grid2
          sx={{
            gridColumn: "span 12",
            "@media (min-width:600px)": { gridColumn: "span 6" },
            "@media (min-width:960px)": { gridColumn: "span 3" },
          }}
        >
          <TextField
            id="price-filter"
            label="Max Price ($)"
            type="number"
            variant="outlined"
            sx={{
              ...textFieldStyles,
              ...numberFieldStyles,
            }}
            fullWidth
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          />
        </Grid2>
        <Grid2
          sx={{
            gridColumn: "span 12",
            "@media (min-width:600px)": { gridColumn: "span 6" },
            "@media (min-width:960px)": { gridColumn: "span 3" },
          }}
        >
          <TextField
            id="duration-filter"
            label="Max Duration (hours)"
            type="number"
            variant="outlined"
            sx={{
              ...textFieldStyles,
              ...numberFieldStyles,
            }}
            fullWidth
            value={maxDurationFilter}
            onChange={(e) => setMaxDurationFilter(e.target.value)}
          />
        </Grid2>
        <Grid2
          sx={{
            gridColumn: "span 12",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            className="clear-filters-btn"
            variant="contained"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </Grid2>
      </Grid2>

      {/* Flights Grid */}
      <Grid2
        container
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 2,
        }}
      >
        {filteredFlights.map((flight) => (
          <Grid2
            key={flight.id}
            sx={{
              gridColumn: "span 12",
              "@media (min-width:600px)": { gridColumn: "span 6" },
              "@media (min-width:960px)": { gridColumn: "span 4" },
            }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
              onClick={() => handleFlightClick(flight.id)}
            >
              <CardContent>
                <Typography variant="h6">
                  {flight.departure} →{" "}
                  {flight.stopover ? `${flight.stopover} → ` : ""}{" "}
                  {flight.destination}
                </Typography>
                <Typography color="textSecondary">
                  <strong>Date:</strong> {formatDate(flight.flightDate)}
                </Typography>
                <Typography color="textSecondary">
                  <strong>Duration:</strong> {flight.flightDuration}
                </Typography>
                {flight.stopover && (
                  <Typography color="textSecondary">
                    <strong>Stopover:</strong> {flight.stopover}
                  </Typography>
                )}
                <Typography color="textSecondary">
                  <strong>Business Class Price:</strong> ${flight.priceBusiness}
                </Typography>
                <Typography color="textSecondary">
                  <strong>Economy Class Price:</strong> ${flight.price}
                </Typography>
              </CardContent>
              <Box textAlign="center" pb={2}>
                <Button variant="contained">Select Flight</Button>
              </Box>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default FlightList;
