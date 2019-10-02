# Trips API

This is the Trips API for the Trip Insights service.

## Dependencies

The Trips API has a dependency on a SQL Server compatible database to store the trips and trip points.

## API Paths

| Method  | Path                                          |Description                                                       |
|---------|-----------------------------------------------|------------------------------------------------------------------|
| GET     | /api/trips                                    | List all the trips                                               |
| GET     | /api/trips/{tripID}                           | Fetch an existing trip                                           |
| POST    | /api/trips                                    | Create a new trip                                                |
| PATCH   | /api/trips/{tripID}                           | Update an existing trip                                          |
| DELETE  | /api/trips/{tripID}                           | Delete an existing trip                                          |
| GET     | /api/trips/user/{userID}                      | List all the trips for the specified user                        |
| GET     | /api/trips/{tripID}/trippoints                | List all the trip points for an existing trip                    |
| GET     | /api/trips/{tripID}/trippoints/{tripPointID}  | Fetch an existing trip point for an existing trip                |
| POST    | /api/trips/{tripID}/trippoints                | Create a new trip point for an existing trip                     |
| PATCH   | /api/trips/{tripID}/trippoints/{tripPointID}  | Update an existing trip point for an existing trip               |
| DELETE  | /api/trips/{tripID}/trippoints/{tripPointID}  | Delete an existing trip point for an existing trip               |
| GET     | /api/trips/healthcheck                        | Return the healthcheck status for the Trips API                  |
| GET     | /api/docs/trips                               | Return the OpenAPI documentation for the Trips API               |

## Additional Paths

The following paths must be allowed by any network appliance or gateway that is controlling inbound access to this API. These are all paths the OpenAPI controller will leverage to build its resources.

| Method  | Path                          |Description                            |
|---------|-------------------------------|---------------------------------------|
| GET     | /api/json                     | Required by the OpenAPI controller    |

The api has been instrumented using the [Go Promethues library](https://github.com/prometheus/client_golang).  

| Method  | Path                          |Description                            |
|---------|-------------------------------|---------------------------------------|
| GET     | /metrics                      | includes information on requests    |

## Configuration

The Trips API is configured via the variables in the table below.

The value for a configuration variable may be specified via an environment variable (ENV) or as the contents of a file. If the file method is used, then the filename must be the name of the variable. The following describes the precedence used for obtaining a configuration value:

1. Content of file located in `/secrets` path. Example: `/secrets/SQL_USER`
2. Value of environment variable. Example: `$SQL_USER`
3. Default value for configuration variable. Example: `sqladmin`

| Name                 | Required | Type        | Default Value | Description                                   |
|----------------------|----------|-------------|---------------|-----------------------------------------------|
| PORT                 | No       | ENV         | 80            | The port that the API service will listen on. |
| CONFIG_FILES_PATH    | No       | ENV         | /secrets      | The base path for file based variables.       |
| SQL_USER             | Yes      | ENV or File | sqladmin      | The username for the SQL Server database.     |
| SQL_PASSWORD         | Yes      | ENV or File |               | The password for the SQL Server database.     |
| SQL_SERVER           | Yes      | ENV or File |               | The server name for the SQL Server database.  |
| SQL_DBNAME           | Yes      | ENV or File | mydrivingDB   | The name of the SQL Server database.          |
| OPENAPI_DOCS_URI     | Yes      | ENV         |               | The external ip address and port of this api. This is used by the OpenAPI UI. |
| DEBUG_LOGGING        | No       | ENV         | false         | Add debug logging.                            |

## Run in Docker

To build the image

Bash
```bash
docker build --no-cache --build-arg IMAGE_VERSION="1.0" --build-arg IMAGE_CREATE_DATE="`date -u +"%Y-%m-%dT%H:%M:%SZ"`" --build-arg IMAGE_SOURCE_REVISION="`git rev-parse HEAD`" -f Dockerfile -t "tripinsights/trips:1.0" .
```

Powershell
```powershell
docker build --no-cache --build-arg IMAGE_VERSION="1.0" --build-arg IMAGE_CREATE_DATE="$(Get-Date((Get-Date).ToUniversalTime()) -UFormat '%Y-%m-%dT%H:%M:%SZ')" --build-arg IMAGE_SOURCE_REVISION="$(git rev-parse HEAD)" -f Dockerfile -t "tripinsights/trips:1.0" .
```

To run the image

```bash
# Example 1 - Set config values via environment variables
docker run -d -p 8080:80 --name trips -e "SQL_PASSWORD=$SQL_PASSWORD" -e "SQL_SERVER=$SQL_SERVER" -e "DOCS_URI=http://$EXTERNAL_IP" tripinsights/trips:1.0

# Example 2 - Set configuration via files. Server will expect config values in files like /secrets/SQL_USER.
# The secrets must be mounted from a host volume (eg. $HOST_FOLDER) into the /secrets container volume.
docker run -d -p 8080:80 --name trips -v $HOST_FOLDER:/secrets tripinsights/trips:1.0
```

## Testing

List all the trips.

```bash
curl -s -X GET 'http://localhost:8080/api/trips' | jq
```

Fetch an existing trip with id `ea2f7ae0-3cef-49cb-b7d1-ce972113120c`.

```bash
curl -s -X GET 'http://localhost:8080/api/trips/ea2f7ae0-3cef-49cb-b7d1-ce972113120c' | jq
```

Create a new trip. The id will be autogenerated and returned.

```bash
curl -s -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "Name": "Trip 2", "UserId": "hacker2", "RecordedTimeStamp": "2019-07-11T10:00:15.003Z", "EndTimeStamp": "2019-07-11T10:10:15.003Z", "Rating": 90, "IsComplete": false, "HasSimulatedOBDData": false, "AverageSpeed": 0, "FuelUsed": 0, "HardStops": 75, "HardAccelerations": 63, "Distance": 5.95 }' 'http://localhost:8080/api/trips' | jq
```

Update the `AverageSpeed` and `FuelUsed` values for an existing trip with id `8f6c3f13-b214-4f8e-917f-1385d5f1b922`.

```bash
curl -s -X PATCH --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "AverageSpeed": 60, "FuelUsed": 12 }' 'http://localhost:8080/api/trips/8f6c3f13-b214-4f8e-917f-1385d5f1b922' | jq
BROKEN - Overrides all non-provided fields with blanks. This is not how PATCH should behave.
```

Delete the trip for id `8f6c3f13-b214-4f8e-917f-1385d5f1b922`

```bash
curl -s -X DELETE 'http://localhost:8080/api/trips/8f6c3f13-b214-4f8e-917f-1385d5f1b922'
```

List the trips for user `hacker2`.

```bash
curl -s -X GET 'http://localhost:8080/api/trips/user/hacker2' | jq
BROKEN - getAllTripsForUser - Error scanning Trips: sql: expected 14 destination arguments in Scan, not 15
```

List all the trip points for an existing trip with id `ea2f7ae0-3cef-49cb-b7d1-ce972113120c`.

```bash
curl -s -X GET 'http://localhost:8080/api/trips/ea2f7ae0-3cef-49cb-b7d1-ce972113120c/trippoints' | jq
SLIGHTLY BROKEN - dates not serialising correctly
```

Fetch an existing trip point with id `23dfc028-f84f-4230-b297-88a4bafb6c22` for an existing trip with id `ea2f7ae0-3cef-49cb-b7d1-ce972113120c`.

```bash
curl -s -X GET 'http://localhost:8080/api/trips/ea2f7ae0-3cef-49cb-b7d1-ce972113120c/trippoints/23dfc028-f84f-4230-b297-88a4bafb6c22' | jq
SLIGHTLY BROKEN - dates not serialising correctly
```

Create a new trip point for an existing trip with id `ea2f7ae0-3cef-49cb-b7d1-ce972113120c`.

```bash
curl -s -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "TripId": "ea2f7ae0-3cef-49cb-b7d1-ce972113120c", "Latitude": 47.67598, "Longitude": -122.10612, "RecordedTimeStamp": "2018-05-24T10:00:15.003Z", "Sequence": 1, "RPM": 720, "ShortTermFuelBank": -1, "LongTermFuelBank": -4, "ThrottlePosition": 16, "RelativeThrottlePosition": 6, "Runtime": 665, "EngineLoad": 16, "MassFlowRate": 20,   "EngineFuelRate": -255, "VIN": "JTEBU5JR9B5046693", "HasOBDData": true, "HasSimulatedOBDData": false }' 'http://localhost:8080/api/trips/ea2f7ae0-3cef-49cb-b7d1-ce972113120c/trippoints' | jq
SLIGHTLY BROKEN - cannot specify VIN in POST.
```

Update the `Latitude` and `Longitude` values for an existing trip point with id `23dfc028-f84f-4230-b297-88a4bafb6c22` for an existing trip with id `ea2f7ae0-3cef-49cb-b7d1-ce972113120c`.

```bash
curl -s -X PATCH --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "Latitude": 48.67598, "Longitude": -121.10612 }' 'http://localhost:8080/api/trips/ea2f7ae0-3cef-49cb-b7d1-ce972113120c/trippoints/53dffb4b-91a4-45c2-a10e-a3b3aada3390' | jq
BROKEN - Error while patching Trip Point on the database: mssql: Error converting data type varchar to float..
```

Delete an existing trip point with id `23dfc028-f84f-4230-b297-88a4bafb6c22` for an existing trip with id `ea2f7ae0-3cef-49cb-b7d1-ce972113120c`.

```bash
curl -s -X DELETE 'http://localhost:8080/api/trips/ea2f7ae0-3cef-49cb-b7d1-ce972113120c/trippoints/53dffb4b-91a4-45c2-a10e-a3b3aada3390'
```

Get healthcheck status

```bash
curl -s -X GET 'http://localhost:8080/api/trips/healthcheck' | jq
```