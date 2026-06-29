FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /workspace

COPY . .

RUN mvn clean package -pl api-backend -am -DskipTests

RUN cp api-backend/target/*.jar /tmp/app.jar

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /tmp/app.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]