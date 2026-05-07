# Multi-stage build for the Kitlo .NET API.
# Build:  docker build -f Kitlo.Api/Dockerfile -t kitlo-api ..
# Run:    docker run -p 8080:8080 \
#           -e ConnectionStrings__Default="Host=host.docker.internal;..." \
#           -e Jwt__Key="<long random secret>" \
#           kitlo-api

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Kitlo.slnx ./
COPY Kitlo.Core/ ./Kitlo.Core/
COPY Kitlo.Data/ ./Kitlo.Data/
COPY Kitlo.Api/ ./Kitlo.Api/
RUN dotnet restore Kitlo.slnx

RUN dotnet publish Kitlo.Api/Kitlo.Api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# ---- Runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Install curl for the HEALTHCHECK probe; -y --no-install-recommends keeps the layer small.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish ./

# Run as a dedicated non-root user. The aspnet base image ships with `app` (uid 1654);
# we re-chown the application directory so that user can read it.
RUN chown -R app:app /app
USER app

ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_EnableDiagnostics=0
EXPOSE 8080

# `/api/listings` is unauthenticated and touches the DB, so it doubles as a readiness check.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl --fail --silent http://localhost:8080/api/listings >/dev/null || exit 1

ENTRYPOINT ["dotnet", "Kitlo.Api.dll"]
