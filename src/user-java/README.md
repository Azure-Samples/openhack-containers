# User Profile (Java) API

This is the User Profile (Java) API for the Trip Insights service. It only provides create and update capabilities on the User Profile.

## Dependencies

The User Profile (Java) API has a dependency on a SQL Server compatible database to store the user profiles.

## API Paths

| Method  | Path                        |Description                                                       |
|---------|-----------------------------|------------------------------------------------------------------|
| POST    | /api/user-java/{id}         | Create a new user profile                                        |
| PATCH   | /api/user-java/{id}         | Update an existing user profile                                  |
| GET     | /api/user-java/healthcheck  | Return the healthcheck status for the User Profile (Java) API    |
| GET     | /api/docs/user-java         | Return the OpenAPI documentation for the User Profile (Java) API |

## Additional Paths

The following paths must be allowed by any network appliance or gateway that is controlling inbound access to this API. These are all paths the OpenAPI controller will leverage to build its resources.

| Method  | Path                          |Description                            |
|---------|-------------------------------|---------------------------------------|
| GET     | /api/documentation/user-java  | Required by the OpenAPI controller    |
| GET     | /api/swagger-resources        | Required by the OpenAPI controller    |
| GET     | /api/api-docs                 | Required by the OpenAPI controller    |

The api has been instrumented using the [Springboot actuator with prometheus enabled](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-metrics-export-prometheus).  

| Method  | Path                          |Description                            |
|---------|-------------------------------|---------------------------------------|
| GET     | /api/metrics                      | includes information on requests    |

## Configuration

The User Profile (Java) API is configured via the variables in the table below.

The value for a configuration variable may be specified via an environment variable (ENV) or as the contents of a file. If the file method is used, then the filename must be the name of the variable. The following describes the precedence used for obtaining a configuration value:

1. Content of file located in `/secrets` path. Example: `/secrets/SQL_USER`
2. Value of environment variable. Example: `$SQL_USER`
3. Default value for configuration variable. Example: `sqladmin`

| Name                 | Required | Type        | Default Value | Description                                   |
|----------------------|----------|-------------|---------------|-----------------------------------------------|
| PORT                 | No       | ENV         | 80            | The port that the API service will listen on. |
| SQL_USER             | Yes      | ENV or File | sqladmin      | The username for the SQL Server database.     |
| SQL_PASSWORD         | Yes      | ENV or File |               | The password for the SQL Server database.     |
| SQL_SERVER           | Yes      | ENV or File |               | The server name for the SQL Server database.  |
| SQL_DBNAME           | Yes      | ENV or File | mydrivingDB   | The name of the SQL Server database.          |

## Run in Docker

To build the image

Bash
```bash
docker build --no-cache --build-arg IMAGE_VERSION="1.0" --build-arg IMAGE_CREATE_DATE="`date -u +"%Y-%m-%dT%H:%M:%SZ"`" --build-arg IMAGE_SOURCE_REVISION="`git rev-parse HEAD`" -f Dockerfile -t "tripinsights/user-java:1.0" .
```

Powershell
```powershell
docker build --no-cache --build-arg IMAGE_VERSION="1.0" --build-arg IMAGE_CREATE_DATE="$(Get-Date((Get-Date).ToUniversalTime()) -UFormat '%Y-%m-%dT%H:%M:%SZ')" --build-arg IMAGE_SOURCE_REVISION="$(git rev-parse HEAD)" -f Dockerfile -t "tripinsights/user-java:1.0" .
```

To run the image

```bash
# Example 1 - Set config values via environment variables
docker run -d -p 8080:80 --name user-java -e "SQL_PASSWORD=$SQL_PASSWORD" -e "SQL_SERVER=$SQL_SERVER" tripinsights/user-java:1.0

# Example 2 - Set configuration via files. Server will expect config values in files like /secrets/SQL_USER.
# The secrets must be mounted from a host volume (eg. $HOST_FOLDER) into the /secrets container volume.
docker run -d -p 8080:80 --name user-java -v $HOST_FOLDER:/secrets tripinsights/user-java:1.0
```

## Testing

Create a new user profile with id of `aa1d876a-3e37-4a7a-8c9b-769ee6217ec2`.

```bash
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "createdAt": "2018-08-07", "deleted": false, "firstName": "Hacker","fuelConsumption": 0,"hardAccelerations": 0,"hardStops": 0, "lastName": "Test","maxSpeed": 0,"profilePictureUri": "https://pbs.twimg.com/profile_images/1003946090146693122/IdMjh-FQ_bigger.jpg", "ranking": 0,"rating": 0, "totalDistance": 0, "totalTime": 0, "totalTrips": 0,  "updatedAt": "2018-08-07", "userId": "hacker2" }' 'http://localhost:8080/api/user-java/aa1d876a-3e37-4a7a-8c9b-769ee6217ec2'
```

Update the `fuelConsumption` and `hardStops` values for an existing user profile with id of `aa1d876a-3e37-4a7a-8c9b-769ee6217ec2`.

```bash
curl -X PATCH --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "fuelConsumption":20, "hardStops":74371 }' 'http://localhost:8080/api/user-java/aa1d876a-3e37-4a7a-8c9b-769ee6217ec2'
```

Get healthcheck status

```bash
curl -X GET 'http://localhost:8080/api/user-java/healthcheck'
```