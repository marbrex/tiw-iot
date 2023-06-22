INSERT INTO Vols (ID, OriginAirport, DestinationAirport)
VALUES (1, 'Airport1', 'Airport2'),
       (2, 'Airport2', 'Airport3'),
       (3, 'Airport3', 'Airport1');

INSERT INTO Bagages (ID, FlightNumber)
VALUES (1, 3),
       (2, 1),
       (3, 2);

INSERT INTO Tapis (ID, DestinationAirport)
VALUES (1, 'Airport2'),
       (2, 'Airport3'),
       (3, 'Airport1');