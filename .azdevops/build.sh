docker-compose build --no-cache \
            --parallel \
            --build-arg IMAGE_VERSION=1.0 \
            --build-arg IMAGE_CREATE_DATE="`date -u +"%Y-%m-%dT%H:%M:%SZ"`" \
            --build-arg IMAGE_SOURCE_REVISION="`git rev-parse HEAD`"

docker-compose up -d