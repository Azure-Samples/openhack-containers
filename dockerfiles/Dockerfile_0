# builder - first stage to build the application
FROM maven:3.5.4-jdk-11-slim AS build-env
ADD ./pom.xml pom.xml
ADD ./src src/
RUN mvn clean package

# runtime - build final runtime image
FROM openjdk:11-jre-slim

ARG IMAGE_CREATE_DATE
ARG IMAGE_VERSION
ARG IMAGE_SOURCE_REVISION

ENV PORT=80 \
    SQL_USER="sqladmin" \
    SQL_PASSWORD="changeme" \
    SQL_SERVER="changeme.database.windows.net" \
    SQL_DBNAME="mydrivingDB"

# Metadata as defined in OCI image spec annotations - https://github.com/opencontainers/image-spec/blob/master/annotations.md
LABEL org.opencontainers.image.title="Trip Insights - User Profile (Java) API" \
      org.opencontainers.image.description="The User Profile (Java) API component forms part of the Trip Insights application." \
      org.opencontainers.image.created=$IMAGE_CREATE_DATE \
      org.opencontainers.image.version=$IMAGE_VERSION \
      org.opencontainers.image.authors="Microsoft" \
      org.opencontainers.image.url="https://github.com/vyta/openhack-containers/blob/master/dockerfiles/Dockerfile_0" \
      org.opencontainers.image.documentation="https://github.com/vyta/openhack-containers/blob/master/src/user-java/README.md" \
      org.opencontainers.image.vendor="Microsoft" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/vyta/openhack-containers.git" \
      org.opencontainers.image.revision=$IMAGE_SOURCE_REVISION 

# add debugging utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    jq \
    less \
    vim \
	&& rm -rf /var/lib/apt/lists/*

# add the application's jar to the container
COPY --from=build-env target/swagger-spring-1.0.0.jar app.jar

# run application
EXPOSE $PORT
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom", "-Dspring.cloud.kubernetes.secrets.enabled=true", "-Dspring.cloud.kubernetes.secrets.paths=/secrets", "-jar","/app.jar"]