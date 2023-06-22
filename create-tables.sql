DROP TABLE IF EXISTS Vols;
CREATE TABLE Vols (
    ID INTEGER PRIMARY KEY,
    OriginAirport TEXT,
    DestinationAirport TEXT
);

DROP TABLE IF EXISTS Bagages;
CREATE TABLE Bagages (
    ID INTEGER PRIMARY KEY,
    FlightNumber INTEGER,
    FOREIGN KEY (FlightNumber) REFERENCES Vols(ID)
);

DROP TABLE IF EXISTS Tapis;
CREATE TABLE Tapis (
    ID INTEGER PRIMARY KEY,
    DestinationAirport TEXT PRIMARY KEY,
    FOREIGN KEY (DestinationAirport) REFERENCES Vols(DestinationAirport)
);