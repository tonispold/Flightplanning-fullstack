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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";

interface Flight {
  id: number;
  bookedSeats: number[];
  seatPrice: number;
  businessSeatPrice: number;
  departure: string;
  destination: string;
  flightDate: string;
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

  // Fetch flight data
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

  // Seat recommendation
  const recommendSeats = () => {
    if (!flight) return;

    const bookedSeats = new Set(flight.bookedSeats);
    const availableSeats = Array.from(
      { length: seatCount },
      (_, i) => i + 1
    ).filter((seat) => !bookedSeats.has(seat));

    if (availableSeats.length < tickets) {
      setOpenErrorModal(true);
      setRecommendedSeats([]);
      return;
    }

    let filteredSeats: number[] = [];

    const MORE_LEG_SPACE_SEATS = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 29, 30, 31, 32,
    ];

    const WINDOW_SEAT = [
      1, 4, 5, 8, 9, 12, 13, 16, 17, 20, 21, 24, 25, 28, 29, 32, 33, 36, 37, 40,
      41, 44, 45, 48, 49, 52, 53, 56, 57, 60,
    ];

    const CLOSE_TO_EXIT = [1, 2, 3, 4, 29, 30, 31, 32, 57, 58, 59, 60];

    // Collect all available seats that match ANY selected filters
    if (filters.windowSeat)
      filteredSeats.push(
        ...availableSeats.filter((seat) => WINDOW_SEAT.includes(seat))
      );
    if (filters.moreLegSpace)
      filteredSeats.push(
        ...availableSeats.filter((seat) => MORE_LEG_SPACE_SEATS.includes(seat))
      );
    if (filters.closeToExit)
      filteredSeats.push(
        ...availableSeats.filter((seat) => CLOSE_TO_EXIT.includes(seat))
      );

    // Remove duplicates from multiple filters
    filteredSeats = Array.from(new Set(filteredSeats));

    // First recommend all available filtered seats first
    const recommended: number[] = filteredSeats.slice(0, tickets);

    // Then if there aren't any seats left based on the filters, find adjacent free seats
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
        <Button variant="contained" className="back-button" onClick={goBack}>
          ← Back to Flights
        </Button>
      </Box>

      <Box
        className="responsive-box"
        display="flex"
        justifyContent="space-between"
        p={2}
      >
        <Box className="settings-box" flex={1}>
          <Typography className="header-text" variant="h5">
            Flight from {flight.departure} to {flight.destination} on{" "}
            {flight.flightDate}
          </Typography>

          <Box
            className="ticket-box"
            display="flex"
            alignItems="center"
            gap={2}
            mt={2}
          >
            <TextField
              id="outlined-basic"
              className="ticket-textfield"
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
          <Box className="seat-filters" display="flex" gap={2} mt={2}>
            <FormControlLabel
              className="center"
              control={
                <Switch
                  checked={filters.windowSeat}
                  onChange={() => handleFilterChange("windowSeat")}
                />
              }
              label="Window Seat"
            />
            <FormControlLabel
              className="center"
              control={
                <Switch
                  checked={filters.moreLegSpace}
                  onChange={() => handleFilterChange("moreLegSpace")}
                />
              }
              label="More Leg Space"
            />
            <FormControlLabel
              className="center"
              control={
                <Switch
                  checked={filters.closeToExit}
                  onChange={() => handleFilterChange("closeToExit")}
                />
              }
              label="Close to Exit"
            />
          </Box>

          <Box className="clear-filters-box" display="flex" gap={2} mt={2}>
            <Button
              variant="contained"
              className="clear-filters-btn"
              onClick={clearSeatFilters}
            >
              Clear Filters
            </Button>
          </Box>

          <Box display="flex">
            <Button
              variant="contained"
              className="recommend-seats-btn"
              onClick={recommendSeats}
            >
              Recommend Seats
            </Button>
          </Box>
        </Box>

        <Box>
          <Grid2 className="seat-display" container spacing={1} mt={3} sx={{ maxWidth: "300px" }}>
            {Array.from({ length: seatCount / 4 }, (_, rowIndex) => {
              const baseSeat = rowIndex * 4 + 1;

              return (
                <React.Fragment key={rowIndex}>
                  {/* Row 29-32 has extra leg space, so add gap */}
                  {baseSeat === 29 && <Grid2 size={12} sx={{ height: 20 }} />}

                  <Grid2 container spacing={1}>
                    {/* Left side seats */}
                    {[0, 1].map((offset) => {
                      const seat = baseSeat + offset;
                      const isBooked = flight.bookedSeats.includes(seat);
                      const isRecommended = recommendedSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);
                      const isBusinessClass = seat >= 1 && seat <= 12;

                      return (
                        <Grid2 key={seat}>
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
                        </Grid2>
                      );
                    })}

                    {/* Aisle */}
                    <Grid2 sx={{ width: 20 }} />

                    {/* Right side seats */}
                    {[2, 3].map((offset) => {
                      const seat = baseSeat + offset;
                      const isBooked = flight.bookedSeats.includes(seat);
                      const isRecommended = recommendedSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);
                      const isBusinessClass = seat >= 1 && seat <= 12;

                      return (
                        <Grid2 key={seat}>
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
                        </Grid2>
                      );
                    })}
                  </Grid2>
                </React.Fragment>
              );
            })}
          </Grid2>
        </Box>

        {/* Selected seats & total price section */}
        <Paper className="paper-price" sx={{ width: 250, p: 2, ml: 3 }}>
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
