# Use an official Java runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the jar file from the target directory
COPY target/flightplanning-0.0.1-SNAPSHOT.jar /app/flightplanning.jar

# Expose port 8080 (or whichever port your Spring Boot app runs on)
EXPOSE 8080

# Command to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "flightplanning.jar"]
