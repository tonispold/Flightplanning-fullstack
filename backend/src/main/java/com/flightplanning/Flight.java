package com.flightplanning;

import jakarta.persistence.*;
import java.sql.Date;
import java.util.Set;

@Entity
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String departure;
    private String destination;
    private Date flightDate;
    private String flightDuration;
    private double price;
    private String stopover;
    private double priceBusiness;

    @ElementCollection
    @CollectionTable(name = "flight_booked_seats", joinColumns = @JoinColumn(name = "flight_id"))
    @Column(name = "seat_number")
    private Set<Integer> bookedSeats;

    public Set<Integer> getBookedSeats() {
        return bookedSeats;
    }

    public void setBookedSeats(Set<Integer> bookedSeats) {
        this.bookedSeats = bookedSeats;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDeparture() {
        return departure;
    }

    public void setDeparture(String departure) {
        this.departure = departure;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Date getFlightDate() {
        return flightDate;
    }

    public void setFlightDate(Date flightDate) {
        this.flightDate = flightDate;
    }

    public String getFlightDuration() {
        return flightDuration;
    }

    public void setFlightDuration(String flightDuration) {
        this.flightDuration = flightDuration;
    }

    public double getPrice() {
        return this.price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getStopover() {
        return this.stopover;
    }

    public void setStopover(String stopover) {
        this.stopover = stopover;
    }

    public double getPriceBusiness() {
        return this.priceBusiness;
    }

    public void setPriceBusiness(double priceBusiness) {
        this.priceBusiness = priceBusiness;
    }
}
