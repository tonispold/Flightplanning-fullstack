# Use an official Maven image to build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory inside the container
WORKDIR /app

# Copy the Maven project files (pom.xml first to leverage caching)
COPY pom.xml .
COPY src ./src

# Build the application using Maven
RUN mvn clean package -DskipTests

# Use a smaller JDK image for the runtime
FROM openjdk:17-jdk-slim

# Set working directory inside the container
WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=build /app/target/flightplanning-0.0.1-SNAPSHOT.jar /app/flightplanning.jar

# Expose port 8080 (or whichever port your Spring Boot app runs on)
EXPOSE 8080

# Command to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/flightplanning.jar"]
