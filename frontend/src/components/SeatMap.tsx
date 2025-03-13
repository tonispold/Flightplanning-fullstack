import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { textFieldStyles } from "../styles";
import { numberFieldStyles } from "../styles";
import {
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface Flight {
  id: number;
  bookedSeats: number[];
  seatPrice: number;
  businessSeatPrice: number;
  departure: String;
  destination: String;
  flightDate: String;
}

const SeatMap: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seatPrice, setSeatPrice] = useState<number | null>(null);
  const [seatBusinessSeatPrice, setBusinessSeatPrice] = useState<number | null>(
    null
  );
  const [tickets, setTickets] = useState<number>(1);
  const [recommendedSeats, setRecommendedSeats] = useState<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [filters, setFilters] = useState({
    windowSeat: false,
    moreLegSpace: false,
    closeToExit: false,
  });

  const seatCount = 60;

  // Fetch flight data including seat price
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/flights/${id}`)
      .then((response) => {
        setFlight(response.data);
        setSeatPrice(response.data.price);
        setBusinessSeatPrice(response.data.priceBusiness);
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

  // Seat recommendation logic
  const recommendSeats = () => {
    if (!flight) return;

    const bookedSeats = new Set(flight.bookedSeats);
    let availableSeats = Array.from(
      { length: seatCount },
      (_, i) => i + 1
    ).filter((seat) => !bookedSeats.has(seat));

    if (availableSeats.length < tickets) {
      setOpenErrorModal(true); // Open the modal
      setRecommendedSeats([]);
      return;
    }

    let filteredSeats: number[] = [];

    // Collect all available seats that match ANY selected filters
    if (filters.windowSeat)
      filteredSeats.push(
        ...availableSeats.filter((seat) =>
          [
            1, 4, 5, 8, 9, 12, 13, 16, 17, 20, 21, 24, 25, 28, 29, 32, 33, 36,
            37, 40, 41, 44, 45, 48, 49, 52, 53, 56, 57, 60,
          ].includes(seat)
        )
      );
    if (filters.moreLegSpace)
      filteredSeats.push(
        ...availableSeats.filter((seat) =>
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 29, 30, 31, 32].includes(seat)
        )
      );
    if (filters.closeToExit)
      filteredSeats.push(
        ...availableSeats.filter((seat) =>
          [1, 2, 3, 4, 29, 30, 31, 32, 57, 58, 59, 60].includes(seat)
        )
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
      let bestGroup: number[] = [];
      for (let i = 0; i <= remainingSeats.length - tickets; i++) {
        const group = remainingSeats.slice(i, i + tickets);
        if (group[group.length - 1] - group[0] === tickets - 1) {
          bestGroup = group;
          break;
        }
      }
      if (bestGroup.length > 0) {
        recommended.push(...bestGroup);
      } else {
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

  const navigate = useNavigate();
  const goBack = () => {
    navigate("/");
  };

  const clearSeatFilters = () => {
    setFilters({
      windowSeat: false,
      moreLegSpace: false,
      closeToExit: false,
    });
  };

  if (!flight) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box mb={2}>
        <Button variant="outlined" className="back-button" onClick={goBack}>
          ← Back to Flights
        </Button>
      </Box>

      <Box
        className="responsive-box"
        display="flex"
        justifyContent="space-between"
        p={2}
      >
        {/* Seat Map Section */}
        <Box flex={1}>
          <Typography variant="h5">
            Flight from {flight.departure} to {flight.destination} on{" "}
            {flight.flightDate}
          </Typography>

          {/* Ticket Input & Filters */}
          <Box display="flex" alignItems="center" gap={2} mt={2}>
            <TextField
              id="outlined-basic"
              label="Number of Tickets"
              type="number"
              value={tickets}
              sx={{
                ...textFieldStyles,
                ...numberFieldStyles,
              }}
              inputProps={{ min: 1, max: seatCount }}
              onChange={(e) => setTickets(parseInt(e.target.value, 10))}
            />
          </Box>

          {/* Filters */}
          <Box display="flex" gap={2} mt={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.windowSeat}
                  onChange={() => handleFilterChange("windowSeat")}
                />
              }
              label="Window Seat"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={filters.moreLegSpace}
                  onChange={() => handleFilterChange("moreLegSpace")}
                />
              }
              label="More Leg Space"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={filters.closeToExit}
                  onChange={() => handleFilterChange("closeToExit")}
                />
              }
              label="Close to Exit"
            />
          </Box>

          <Box display="flex" gap={2} mt={2}>
            <Button variant="outlined" className="clear-filters-btn" onClick={clearSeatFilters}>
              Clear Filters
            </Button>
          </Box>

          <Box display="flex">
            <Button variant="contained" onClick={recommendSeats}>
              Recommend Seats
            </Button>
          </Box>
        </Box>

        <Box>
          <Grid container spacing={1} mt={3} sx={{ maxWidth: "300px" }}>
            {Array.from({ length: seatCount / 4 }, (_, rowIndex) => {
              const baseSeat = rowIndex * 4 + 1;

              return (
                <React.Fragment key={rowIndex}>
                  {/* Add extra gap before seats 29-32 */}
                  {baseSeat === 29 && <Grid item xs={12} sx={{ height: 20 }} />}

                  <Grid container item spacing={1}>
                    {/* Left side (Seats 1 & 2) */}
                    {[0, 1].map((offset) => {
                      const seat = baseSeat + offset;
                      const isBooked = flight.bookedSeats.includes(seat);
                      const isRecommended = recommendedSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);
                      const isBusinessClass = seat >= 1 && seat <= 12;

                      return (
                        <Grid item key={seat}>
                          <Box
                            onClick={() => toggleSeatSelection(seat)}
                            sx={{
                              width: 40,
                              height: 40,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "5px",
                              backgroundColor: isBooked
                                ? "black"
                                : isSelected
                                ? "green"
                                : isRecommended
                                ? "yellow"
                                : isBusinessClass
                                ? "lightblue" // Business class seats in blue
                                : "white",
                              color: isBooked ? "white" : "black",
                              border: "1px solid gray",
                              cursor: isBooked ? "not-allowed" : "pointer",
                            }}
                          >
                            {seat}
                          </Box>
                        </Grid>
                      );
                    })}

                    {/* Aisle (Gap between columns 2 and 3) */}
                    <Grid item sx={{ width: 20 }} />

                    {/* Right side (Seats 3 & 4) */}
                    {[2, 3].map((offset) => {
                      const seat = baseSeat + offset;
                      const isBooked = flight.bookedSeats.includes(seat);
                      const isRecommended = recommendedSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);
                      const isBusinessClass = seat >= 1 && seat <= 12;

                      return (
                        <Grid item key={seat}>
                          <Box
                            onClick={() => toggleSeatSelection(seat)}
                            sx={{
                              width: 40,
                              height: 40,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "5px",
                              backgroundColor: isBooked
                                ? "black"
                                : isSelected
                                ? "green"
                                : isRecommended
                                ? "yellow"
                                : isBusinessClass
                                ? "lightblue"
                                : "white",
                              color: isBooked ? "white" : "black",
                              border: "1px solid gray",
                              cursor: isBooked ? "not-allowed" : "pointer",
                            }}
                          >
                            {seat}
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </React.Fragment>
              );
            })}
          </Grid>
        </Box>

        {/* Selected Seats & Total Price Section */}
        <Paper sx={{ width: 250, p: 2, ml: 3 }}>
          <Typography variant="h6">Selected Seats</Typography>
          {selectedSeats.length === 0 ? (
            <Typography>No seats selected</Typography>
          ) : (
            <Box mt={1}>
              {selectedSeats.map((seat) => {
                const isBusinessClass = seat >= 1 && seat <= 12;
                const seatPriceToShow = isBusinessClass
                  ? seatBusinessSeatPrice
                  : seatPrice;

                return (
                  <Typography key={seat}>
                    Seat {seat} - ${seatPriceToShow}
                  </Typography>
                );
              })}

              <Typography variant="h6" mt={2}>
                Total: $
                {selectedSeats.reduce((total, seat) => {
                  const isBusinessClass = seat >= 1 && seat <= 12;
                  return (
                    total +
                    (isBusinessClass
                      ? seatBusinessSeatPrice ?? 0
                      : seatPrice ?? 0)
                  );
                }, 0)}
              </Typography>
            </Box>
          )}
        </Paper>
        <Dialog open={openErrorModal} onClose={() => setOpenErrorModal(false)}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <Typography color="error">
              Too many tickets, not enough seats available.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenErrorModal(false)} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default SeatMap;
