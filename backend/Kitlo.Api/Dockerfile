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

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Kitlo.Api.dll"]
