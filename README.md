# Full-Stack Flight Planner ✈️ #

This is a **full-stack flight planning app** built with:

**Backend**: Spring Boot (Java) + MySQL
<br>
**Frontend**: React (Vite) + MUI
<br>
**Database**: MySQL 8
<br>
**Containerized with Docker & Docker Compose**

## 🚀 How to Run the App ##

**1. Install Dependencies**
- Download [Docker](https://docs.docker.com/get-started/get-docker/)
- Ensure Docker Desktop is running

**2. Clone the Repository**
- git clone https://github.com/tonispold/Flightplanning-fullstack
- cd Flightplanning-fullstack

**3. Run the Application**
- docker-compose up --build

**This will:**
- Start a **MySQL database** (flight_db)
- Start the **backend** (Spring Boot)
- Start the **frontend** (React with Vite)

**4. Open the Web App**

Once running, open:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api/flights

## 🎯 How It Works ##

**1. Flight Search:**
- Users can search for flights by **departure, destination, date, max price and max flight time**.
If there is no direct flight and the flight has a stopover, it is displayed in the search results.

**2. Seat Recommendation:**
- The system recommends closest available seats together if no filters are applied.
Users can apply filters:
  - **Window seats** (all the seats in columns 1 and 4)
  - **Extra legroom** (business class seats 1-12 and exit alley seats 29-32)
  - **Close to exit** (first row, middle exit alley row and last row)
Seats matching the filters are highlighted in yellow.

**3. Logic of the seat filtering system:**
- The filtering logic is the following: if there are **3 filters applied**, the system will go through all the empty seats that match all three filters and recommends those first. If that's not enough, the system will go through all the free seats that match **2 filters** and recommends them. If that's still not enought, the system will go through all the free seats that match **1 filter** and recommend them and then lastly it will recommend free seats that match no filters in ascending order.

**4. Seat Selection:**
- Users see an **interactive seat map** (white = available, black = booked).
The **business class** seats are seats 1-12 and are displayed in light blue.
Clicking on a seat selects/deselects it (green = selected).
The total cost updates dynamically.

**5. Booking Confirmation:**
- After selecting seats, the **total price** is displayed in the right, considering business class pricing aswell.

## 🔧 Improvements to make ##

**1. Improve the flights filtering visuals and logic**<br>
**2. Improve the seat recommendation logic when there are no filters applied**<br>
**3. Create a checkout functionality**<br>
**4. Explain the recommended seats to the user with illustrative text**

## 💡 Author notes and thoughts ##

Creating this fullstack web app took the me about **5 days**. The **biggest challenges** were the **Spring Boot backend** and **Dockerizing the web app**. The backend was hard for me because I don't have much experience with backend development and Spring Boot aswell. To understand it better, I had to read the Spring Boot documentation and use ChatGPT's help with setting some things up.

I also haven't used Docker before and learning that was a bit tricky at the start. The logic of docker is very easy, but to implement it into your web app wasn't easy at all. In the end I managed to do it with the help of google and AI. The frontend was easier, because I have more experience with frontend development and it is also the development I enjoy the most.

In creating this fullstack web app, I mainly used the help of [Spring Boot](https://docs.spring.io/spring-boot/documentation.html) and [MUI elements](https://mui.com/material-ui/all-components/) docs and ChatGPT.

## 📜 License ##

This project is open-source under the MIT License.
 

