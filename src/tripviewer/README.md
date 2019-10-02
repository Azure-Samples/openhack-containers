# TripViewer

This is the TripViewer website for the Trip Insights service.

## Dependencies

The TripViewer website relies on the Trip Insights APIs to be reachable in order to display correct information.

## Paths

The following paths are available on the site:

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | / | Home page of the Trip Viewer site |
| GET | /Trip | Displays a map and trip information. This path is dependent on the `trips` API to function correctly |
| GET | /UserProfile | Displays the user's profile. This path depends on the `userprofile` API to function correctly |

The api has been instrumented using the [.Net Promethues library](https://github.com/prometheus-net/prometheus-net#prometheus-net).  For more information on metrics and configuration see [ASP.NET Core HTTP request metrics](https://github.com/prometheus-net/prometheus-net#aspnet-core-http-request-metrics)

| Method  | Path                          |Description                            |
|---------|-------------------------------|---------------------------------------|
| GET     | /metrics                      | includes number of HTTP requests in progress, total number of received http requets, duration of requests    |

## Configuration

The TripViewer site is configured via the variables in the table below.

The value for a configuration variable should be specified via an environment variable.

| Name | Required | Format | Description |
|----- | -------- | ------ | ----------- |
| USER_API_ENDPOINT | Yes | "http://endpoint.you.specify(:port)" | The FQDN of the `userprofile` API endpoint. |
| TRIPS_API_ENDPOINT | Yes | "http://endpoint.you.specify(:port)" | The FQDN of the `trips` API endpoint. |
| BING_MAPS_KEY | No | \<guid\> | A Bing Maps API key |

## Run in Docker

To build the image

Bash
```bash
docker build --no-cache --build-arg IMAGE_VERSION="1.0" --build-arg IMAGE_CREATE_DATE="`date -u +"%Y-%m-%dT%H:%M:%SZ"`" --build-arg IMAGE_SOURCE_REVISION="`git rev-parse HEAD`" -f Dockerfile -t "tripinsights/tripviewer:1.0" .
```

Powershell
```powershell
docker build --no-cache --build-arg IMAGE_VERSION="1.0" --build-arg IMAGE_CREATE_DATE="$(Get-Date((Get-Date).ToUniversalTime()) -UFormat '%Y-%m-%dT%H:%M:%SZ')" --build-arg IMAGE_SOURCE_REVISION="$(git rev-parse HEAD)" -f Dockerfile -t "tripinsights/tripviewer:1.0" .
```

To run the image

```bash
docker run -d -p 8080:80 --name tripviewer -e "USER_API_ENDPOINT=http://$ENDPOINT" -e "TRIPS_API_ENDPOINT=http://$ENDPOINT" tripinsights/tripviewer:1.0
```

## Testing

Open "http://localhost:8080/" in the browser. While running the docker container, header and documentation links will be broken as they rely on the Trip Insights APIs to be running and reachable.
