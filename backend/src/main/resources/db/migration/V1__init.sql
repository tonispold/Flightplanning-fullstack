CREATE TABLE flight (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    departure VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    flight_date DATE NOT NULL,
    flight_duration VARCHAR(50) NOT NULL,
    price DOUBLE NOT NULL,
    stopover VARCHAR(255),
    price_business DOUBLE NOT NULL
);

CREATE TABLE flight_booked_seats (
    flight_id BIGINT NOT NULL,
    seat_number INT NOT NULL,
    PRIMARY KEY (flight_id, seat_number),
    FOREIGN KEY (flight_id) REFERENCES flight(id) ON DELETE CASCADE
);

/**
  * Create dummy data of different cities for flights and flight_booked_seats
  */

INSERT INTO flight (departure, destination, flight_date, flight_duration, price, stopover, price_business) 
VALUES 
('New York', 'Los Angeles', '2025-03-20', '6h 20min', 350, NULL, 420),
('Tallinn', 'Stockholm', '2025-03-20', '35min', 95, NULL, 140),
('Riga', 'Berlin', '2025-03-23', '1h 55min', 156, NULL, 200),
('Riga', 'Abu Dhabi', '2025-03-26', '4h 25min', 419, NULL, 430),
('Tallinn', 'Marbella', '2025-04-11', '4h 30min', 230, NULL, 280),
('Tallinn', 'Berlin', '2025-04-02', '2h 25min', 115, NULL, 190),
('Berlin', 'Phuket', '2025-04-02', '7h 30min', 510, NULL, 700),
('Tallinn', 'Phuket', '2025-04-02', '14h 10min', 892, 'Berlin', 1240);
