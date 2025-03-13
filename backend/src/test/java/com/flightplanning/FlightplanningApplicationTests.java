package com.flightplanning;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.sql.Date;
import java.util.*;

@SpringBootTest
class FlightplanningApplicationTests {

	private MockMvc mockMvc;

	@Mock
	private FlightRepository flightRepository;

	private FlightController flightController;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
		flightController = new FlightController(flightRepository);
		mockMvc = MockMvcBuilders.standaloneSetup(flightController).build();
	}

	// Test for getting all flights
	@Test
	void testGetAllFlights() throws Exception {
		Flight flight = new Flight();
		flight.setId(1L);
		flight.setDeparture("New York");
		flight.setDestination("Los Angeles");
		flight.setFlightDate(Date.valueOf("2025-03-13"));
		flight.setPrice(100.0);

		when(flightRepository.findAll()).thenReturn(List.of(flight));

		mockMvc.perform(get("/api/flights"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].departure").value("New York"))
				.andExpect(jsonPath("$[0].destination").value("Los Angeles"));
	}

	// Test for getting a flight by ID
	@Test
	void testGetFlightById() throws Exception {
		// Creating three flight instances
		Flight flight1 = new Flight();
		flight1.setId(1L);
		flight1.setDeparture("New York");
		flight1.setDestination("Los Angeles");
		flight1.setFlightDate(Date.valueOf("2025-03-13"));
		flight1.setPrice(100.0);

		Flight flight2 = new Flight();
		flight2.setId(2L);
		flight2.setDeparture("London");
		flight2.setDestination("Paris");
		flight2.setFlightDate(Date.valueOf("2025-04-15"));
		flight2.setPrice(120.0);

		Flight flight3 = new Flight();
		flight3.setId(3L);
		flight3.setDeparture("Tokyo");
		flight3.setDestination("Sydney");
		flight3.setFlightDate(Date.valueOf("2025-05-20"));
		flight3.setPrice(150.0);

		// Mocking the repository to return the three flights when queried
		when(flightRepository.findById(3L)).thenReturn(Optional.of(flight3)); // Mock flight with id=3

		// Mocking repository to return all flights
		when(flightRepository.findAll()).thenReturn(List.of(flight1, flight2, flight3));

		// Performing the GET request to fetch flight with id=3
		mockMvc.perform(get("/api/flights/3"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.departure").value("Tokyo"))
				.andExpect(jsonPath("$.destination").value("Sydney"))
				.andExpect(jsonPath("$.price").value(150.0));
	}

}
