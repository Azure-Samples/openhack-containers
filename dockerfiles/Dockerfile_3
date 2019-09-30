# 
# builder - first stage to build the application
# 
FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build-env
WORKDIR /app

# copy csproj and restore as distinct layers
COPY *.sln .
COPY web/*.csproj ./web/
COPY tests/IntegrationTests/*.csproj ./tests/IntegrationTests/
COPY tests/UnitTests/*.csproj ./tests/UnitTests/
RUN dotnet restore

# copy everything else and build
COPY . ./
WORKDIR /app/web
RUN dotnet build

# ------------------------------------------------

FROM build-env AS unit-test
WORKDIR /app/tests/UnitTests
RUN dotnet test

FROM build-env AS integration-test
WORKDIR /app/tests/IntegrationTests
RUN dotnet test

FROM build-env AS publish
WORKDIR /app/web
RUN dotnet publish -c Release -o out
COPY ./web/appsettings.*.json /app/web/out/
COPY ./web/appsettings.json /app/web/out/

# ------------------------------------------------

# 
# runtime - build final runtime image
# 
FROM mcr.microsoft.com/dotnet/core/aspnet:2.2.6-alpine3.9

ARG IMAGE_CREATE_DATE
ARG IMAGE_VERSION
ARG IMAGE_SOURCE_REVISION

ENV SQL_USER="sqladmin" \
    SQL_PASSWORD="changeme" \
    SQL_SERVER="changeme.database.windows.net" \
    SQL_DBNAME="mydrivingDB" \
    WEB_PORT=80 \
    WEB_SERVER_BASE_URI="http://0.0.0.0" \
    ASPNETCORE_ENVIRONMENT="Development"

# Metadata as defined in OCI image spec annotations - https://github.com/opencontainers/image-spec/blob/master/annotations.md
LABEL org.opencontainers.image.title="Trip Insights - POI (Points Of Interest) API" \
      org.opencontainers.image.description="The POI (Points Of Interest) API component forms part of the Trip Insights application." \
      org.opencontainers.image.created=$IMAGE_CREATE_DATE \
      org.opencontainers.image.version=$IMAGE_VERSION \
      org.opencontainers.image.authors="Microsoft" \
      org.opencontainers.image.url="https://github.com/vyta/openhack-containers/blob/master/dockerfiles/Dockerfile_3" \
      org.opencontainers.image.documentation="https://github.com/vyta/openhack-containers/blob/master/src/poi/README.md" \
      org.opencontainers.image.vendor="Microsoft" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/vyta/openhack-containers.git" \
      org.opencontainers.image.revision=$IMAGE_SOURCE_REVISION 

# add debugging utilities
RUN apk --no-cache add \
  curl \
  ca-certificates \
  jq \
  less \
  vim

RUN update-ca-certificates

# add the application to the container
WORKDIR /app
COPY --from=publish /app/web/out .

# run application
EXPOSE $WEB_PORT
ENTRYPOINT ["dotnet", "poi.dll"]

