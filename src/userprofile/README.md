# User Profile API

This is the User Profile API for the Trip Insights service.

## Dependencies

The User Profile API has a dependency on a SQL Server compatible database to store the user profiles.

## API Paths

| Method  | Path                   |Description                                                |
|---------|------------------------|-----------------------------------------------------------|
| GET     | /api/user              | List all the user profiles                                |
| GET     | /api/user/{id}         | Fetch the user profile for a specific user                |
| POST    | /api/user/{id}         | Create a new user profile                                 |
| PATCH   | /api/user/{id}         | Update an existing user profile                           |
| DELETE  | /api/user/{id}         | Delete an existing user profile                           |
| GET     | /api/user/healthcheck  | Return the healthcheck status for the User Profile API    |
| GET     | /api/docs/user         | Return the OpenAPI documentation for the User Profile API |


The api has been instrumented using the [Express prometheus bundle middleware](https://www.npmjs.com/package/express-prom-bundle).  

| Method  | Path                          |Description                            |
|---------|-------------------------------|---------------------------------------|
| GET     | /metrics                      | includes information on requests    |

## Configuration

The User Profile API is configured via the variables in the table below.

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

## Run in Docker

To build the image

Bash
```bash
docker build --no-cache --build-arg IMAGE_VERSION="1.0" --build-arg IMAGE_CREATE_DATE="`date -u +"%Y-%m-%dT%H:%M:%SZ"`" --build-arg IMAGE_SOURCE_REVISION="`git rev-parse HEAD`" -f Dockerfile -t "tripinsights/userprofile:1.0" .
```

Powershell
```powershell
docker build --no-cache --build-arg IMAGE_VERSION="1.0" --build-arg IMAGE_CREATE_DATE="$(Get-Date((Get-Date).ToUniversalTime()) -UFormat '%Y-%m-%dT%H:%M:%SZ')" --build-arg IMAGE_SOURCE_REVISION="$(git rev-parse HEAD)" -f Dockerfile -t "tripinsights/userprofile:1.0" .
```

To run the image

```bash
# Example 1 - Set config values via environment variables
docker run -d -p 8080:80 --name userprofile -e "SQL_PASSWORD=$SQL_PASSWORD" -e "SQL_SERVER=$SQL_SERVER" tripinsights/userprofile:1.0

# Example 2 - Set configuration via files. Server will expect config values in files like /secrets/SQL_USER.
# The secrets must be mounted from a host volume (eg. $HOST_FOLDER) into the /secrets container volume.
docker run -d -p 8080:80 --name userprofile -v $HOST_FOLDER:/secrets tripinsights/userprofile:1.0
```

## Testing

List all user profiles.

```bash
curl -s -X GET 'http://localhost:8080/api/user' | jq
```

Fetch the user profile for id `aa1d876a-3e37-4a7a-8c9b-769ee6217ec2`.

```bash
curl -s -X GET 'http://localhost:8080/api/user/aa1d876a-3e37-4a7a-8c9b-769ee6217ec2' | jq
```

Create a new user profile with id `aa1d876a-3e37-4a7a-8c9b-769ee6217ec2`.

```bash
curl -s -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "Deleted": false, "FirstName": "Hacker","FuelConsumption": 0,"HardAccelerations": 0,"HardStops": 0, "LastName": "Test","MaxSpeed": 0,"ProfilePictureUri": "https://pbs.twimg.com/profile_images/1003946090146693122/IdMjh-FQ_bigger.jpg", "Ranking": 0,"Rating": 0, "TotalDistance": 0, "TotalTime": 0, "TotalTrips": 0,  "UserId": "hacker2" }' 'http://localhost:8080/api/user/aa1d876a-3e37-4a7a-8c9b-769ee6217ec2' | jq
```

Update the `FuelConsumption` and `HardStops` values for an existing user profile with id of `aa1d876a-3e37-4a7a-8c9b-769ee6217ec2`.

```bash
curl -s -X PATCH --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "FuelConsumption":20, "HardStops":74371 }' 'http://localhost:8080/api/user/aa1d876a-3e37-4a7a-8c9b-769ee6217ec2' | jq
```

Delete the user profile for id `aa1d876a-3e37-4a7a-8c9b-769ee6217ec2`.

```bash
curl -s -X DELETE 'http://localhost:8080/api/user/aa1d876a-3e37-4a7a-8c9b-769ee6217ec2'
```

Get healthcheck status

```bash
curl -s -X GET 'http://localhost:8080/api/user/healthcheck' | jq
```