# Steg 1: Bruk Java 21 for å bygge koden
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Kopier alle filene fra backend-mappen inn i containeren
COPY . .

# Gjør Maven-wrapperen kjørbar (viktig for Linux-servere)
RUN chmod +x mvnw

# Bygg selve .jar-filen (vi hopper over tester for å spare tid under deploy)
RUN ./mvnw clean package -DskipTests

# Steg 2: Lag en lettvekt-container for å kjøre appen
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Hent den ferdige .jar-filen fra bygg-steget over
COPY --from=build /app/target/*.jar app.jar

# Fortell Render at appen bruker port 8080
EXPOSE 8080

# Kommandoen som starter backenden din
ENTRYPOINT ["java", "-jar", "app.jar"]