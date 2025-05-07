FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

RUN apt-get update && apt-get install -y libgdiplus

WORKDIR /src

COPY . .
RUN dotnet restore "Accounting.sln" && dotnet publish "Accounting-API/Accounting-API.csproj" -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0

RUN apt-get update && apt-get install -y libgdiplus

WORKDIR /app

COPY --from=build /app/publish .
COPY .env .env

ENTRYPOINT ["dotnet", "Accounting-API.dll", "--urls", "https://0.0.0.0:5000"]