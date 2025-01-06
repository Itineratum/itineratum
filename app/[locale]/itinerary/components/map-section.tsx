"use client";

import { Event } from "@/lib/pythonBackend/types";
import { CircularProgress } from "@mui/material";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  Marker,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { fromAddress, OutputFormat, setDefaults } from "react-geocode";

const MapSection = ({ events }: { events: Event[] }) => {
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

      await Promise.all(
        events.map(async (event) => {
          if (!event) return;
          const { results } = await fromAddress(event.location_address);
          const { lat, lng } = results[0].geometry.location;
          newPositions.push({ lat, lng });
        }),
      );

      setPositions(newPositions);
      setIsLoading(false);
    };

    fetchPositions();
  }, [events]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        key={JSON.stringify(positions)}
        style={{
          height,
          width,
          border: "2px solid black",
          borderRadius,
          overflow: "hidden",
        }}
        defaultCenter={positions[0]}
        defaultZoom={10}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log(
            "camera changed:",
            ev.detail.center,
            "zoom:",
            ev.detail.zoom,
          )
        }
      >
        {positions.map((position, index) => (
          <Marker key={index} position={position} />
        ))}
      </Map>
    </APIProvider>
  );
};

export default MapSection;

interface Position {
  lat: number;
  lng: number;
}
