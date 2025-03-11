package com.flightplanning;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:5173") // Adjust based on frontend port
public class FlightController {

    private final FlightRepository flightRepository;

    public FlightController(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    // ✅ Get all flights
    @GetMapping
    public List<Flight> getFlights() {
        return flightRepository.findAll();
    }

    // ✅ Get a specific flight by ID
    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        Optional<Flight> optionalFlight = flightRepository.findById(id);

        if (optionalFlight.isPresent()) {
            Flight flight = optionalFlight.get();

            // If no bookedSeats exist, we can generate them randomly for testing purposes.
            if (flight.getBookedSeats() == null || flight.getBookedSeats().isEmpty()) {
                Set<Integer> bookedSeats = new HashSet<>();
                Random random = new Random();
                int bookedSeatsCount = random.nextInt(60) + 1; // Random 1-60
                while (bookedSeats.size() < bookedSeatsCount) {
                    bookedSeats.add(random.nextInt(60) + 1);
                }
                flight.setBookedSeats(bookedSeats);
                flightRepository.save(flight); // Save the flight with the newly generated bookedSeats
            }

            return ResponseEntity.ok(flight);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
