
# POI (Points Of Interest) API

This is the POI (Points Of Interest) API for the Trip Insights service. It collects the points of the trip when a hard stop or hard acceleration was detected.

## Dependencies

The POI (Points Of Interest) API has a dependency on a SQL Server compatible database to store the points of interest.

## API Paths

| Method  | Path                       |Description                                                 |
|---------|----------------------------|------------------------------------------------------------|
| GET     | /api/poi                   | List all the points of interest                            |
| GET     | /api/poi/{ID}              | Fetch an existing point of interest                        |
| POST    | /api/poi                   | Create a new point of interest                             |
| GET     | /api/poi/trip/{tripID}     | List all the points of interest for the specified trip     |
| GET     | /api/poi/healthcheck       | Return the healthcheck status for the POI API              |
| GET     | /api/docs/poi              | Return the OpenAPI documentation for the POI API           |

## Additional Paths

The following paths must be allowed by any network appliance or gateway that is controlling inbound access to this API. These are all paths the OpenAPI controller will leverage to build its resources.

| Method  | Path                          |Description                            |
|---------|-------------------------------|---------------------------------------|
| GET     | /swagger/docs/poi             | Required by the OpenAPI controller    |

The api has been instrumented using the [.Net Promethues library](https://github.com/prometheus-net/prometheus-net#prometheus-net).  For more information on metrics and configuration see [ASP.NET Core HTTP request metrics](https://github.com/prometheus-net/prometheus-net#aspnet-core-http-request-metrics)

| Method  | Path                          |Description                            |
|---------|-------------------------------|---------------------------------------|
| GET     | /metrics                      | includes number of HTTP requests in progress, total number of received http requets, duration of requests    |

## Configuration

The POI (Points Of Interest) API is configured via the variables in the table below.

The value for a configuration variable may be specified via an environment variable (ENV) or as the contents of a file. If the file method is used, then the filename must be the name of the variable. The following describes the additive rules configured via the .NET Core framework for obtaining a configuration value:

1. Default value for configuration variable if it is defined. Example: `sqladmin`
1. If an environment variable is specified, this overrides the value. Example: `$SQL_USER`
1. If there is a file located in `/secrets` path, then its contents overrides the value. Example: `/secrets/SQL_USER`

| Name                    | Required | Type        | Default Value  | Description                                       |
|-------------------------|----------|-------------|----------------|---------------------------------------------------|
| WEB_SERVER_BASE_URI     | No       | ENV         | http://0.0.0.0 | The url that API service web host will listen on. |
| WEB_PORT                | No       | ENV         | 80             | The port that the API service will listen on.     |
| CONFIG_FILES_PATH       | No       | ENV         | /secrets       | The base path for file based variables.           |
| SQL_USER                | Yes      | ENV or File | sqladmin       | The username for the SQL Server database.         |
| SQL_PASSWORD            | Yes      | ENV or File |                | The password for the SQL Server database.         |
| SQL_SERVER              | Yes      | ENV or File |                | The server name for the SQL Server database.      |
| SQL_DBNAME              | Yes      | ENV or File | mydrivingDB    | The name of the SQL Server database.              |
| ASPNETCORE_ENVIRONMENT  | No       | ENV         | Development    | The ASP.NET hosting environment setting.          |

## Run in Docker

To build the image

Bash
```bash
docker build --no-cache --build-arg IMAGE_VERSION="1.0" --build-arg IMAGE_CREATE_DATE="`date -u +"%Y-%m-%dT%H:%M:%SZ"`" --build-arg IMAGE_SOURCE_REVISION="`git rev-parse HEAD`" -f Dockerfile -t "tripinsights/poi:1.0" .
```

Powershell
```powershell
docker build --no-cache --build-arg IMAGE_VERSION="1.0" --build-arg IMAGE_CREATE_DATE="$(Get-Date((Get-Date).ToUniversalTime()) -UFormat '%Y-%m-%dT%H:%M:%SZ')" --build-arg IMAGE_SOURCE_REVISION="$(git rev-parse HEAD)" -f Dockerfile -t "tripinsights/poi:1.0" .
```

To run the image

```bash
# Example 1 - Set config values via environment variables
docker run -d -p 8080:80 --name poi -e "SQL_PASSWORD=$SQL_PASSWORD" -e "SQL_SERVER=$SQL_SERVER" -e "ASPNETCORE_ENVIRONMENT=Production" tripinsights/poi:1.0

# Example 2 - Set configuration via files. Server will expect config values in files like /secrets/SQL_USER.
# The secrets must be mounted from a host volume (eg. $HOST_FOLDER) into the /secrets container volume.
docker run -d -p 8080:80 --name poi -v $HOST_FOLDER:/secrets -e "ASPNETCORE_ENVIRONMENT=Production" tripinsights/poi:1.0
```

## Testing

List all the points of interest.

```bash
curl -s -X GET 'http://localhost:8080/api/poi' | jq
```

Fetch an existing point of interest with id `264ffaa3-1fe8-4fb0-a4fb-63bdbc9999ae`.

```bash
curl -s -X GET 'http://localhost:8080/api/poi/264ffaa3-1fe8-4fb0-a4fb-63bdbc9999ae' | jq
```

Create a new point of interest for a `HardBrake` (poiType=2) event. The id will be autogenerated and returned.

```bash
curl -s -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "tripId": "ea2f7ae0-3cef-49cb-b7d1-ce972113120c", "latitude": 47.39026323526123, "longitude": -123.23165568111123, "poiType": 2, "timestamp": "2019-07-12T02:30:03.351Z", "deleted": false }' 'http://localhost:8080/api/poi' | jq
```

List all the points of interest for the specified trip with id `ea2f7ae0-3cef-49cb-b7d1-ce972113120c`.

```bash
curl -s -X GET 'http://localhost:8080/api/poi/trip/ea2f7ae0-3cef-49cb-b7d1-ce972113120c' | jq
```

Get healthcheck status

```bash
curl -s -X GET 'http://localhost:8080/api/poi/healthcheck' | jq
```
