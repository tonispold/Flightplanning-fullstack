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
- Install Docker & Docker Compose:
- Download Docker
- Ensure Docker Desktop is running

**2. Clone the Repository**
- git clone https://github.com/tonispold/Flightplanning-fullstack
- cd Flightplanning-fullstack

**3. Run the Application**
- docker-compose up --build

**This will:**
- Start a MySQL database (flight_db)
- Start the backend (Spring Boot)
- Start the frontend (React with Vite)

**4. Open the Web App**

Once running, open:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api/flights
