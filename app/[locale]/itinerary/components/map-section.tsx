"use client";

import { Event } from "@/lib/pythonBackend/types";
import { CircularProgress, Container } from "@mui/material";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { fromAddress, OutputFormat, setDefaults } from "react-geocode";
import { EventCardTimeOfDay } from "./event-card";
import MapMarker from "./map-marker";

const MapSection = ({
  events,
  setSelectedEvent,
  selectedEvent,
}: {
  events: Event[];
  setSelectedEvent: any;
  selectedEvent: Event | null;
}) => {
  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    language: "en",
    region: "sg",
    outputFormat: OutputFormat.JSON,
  });

  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const height = "700px";
  const width = "60vw";
  const borderRadius = "20px";

  useEffect(() => {
    const fetchPositions = async () => {
      const newPositions: Position[] = [];

      for (const event of events) {
        if (!event) continue;

        try {
          const { results } = await fromAddress(event.location_address);
          const { lat, lng } = results[0].geometry.location;
          newPositions.push({ lat, lng });
        } catch (error) {
          console.error(error);
        }
      }

      setPositions(newPositions);
      setIsLoading(false);
    };

    fetchPositions();
  }, [events]);

  if (isLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        key={JSON.stringify(positions)}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
        style={{
          height,
          width,
          border: "2px solid black",
          borderRadius,
          overflow: "hidden",
        }}
        defaultCenter={positions[0]}
        defaultZoom={11}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {positions.map((position, index) => (
          <MapMarker
            key={index}
            position={position}
            timeOfDay={
              index === 0
                ? EventCardTimeOfDay.morning
                : index === 1
                  ? EventCardTimeOfDay.afternoon
                  : EventCardTimeOfDay.evening
            }
            setSelectedEvent={setSelectedEvent}
            event={events[index]}
            selected={
              JSON.stringify(selectedEvent) === JSON.stringify(events[index])
            }
          />
        ))}
      </Map>
    </APIProvider>
  );
};

export default MapSection;

export interface Position {
  lat: number;
  lng: number;
}
