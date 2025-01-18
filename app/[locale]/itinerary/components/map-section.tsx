"use client";

import { Event, EventTimeOfDay, Position } from "@/lib/pythonBackend/types";
import { CircularProgress, Container } from "@mui/material";
import { Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
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
  const [mapMarkersData, setMapMarkersData] = useState<MapMarkerData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const height = "700px";
  const maxWidth = "60vw";
  const borderRadius = "20px";

  useEffect(() => {
    if (!events) return;

    const newMapMarkersData: MapMarkerData[] = [];

    for (const event of events) {
      newMapMarkersData.push({
        timeOfDay: event.time_of_day,
        event,
        position: {
          lat: event.coordinates!.lat ?? 0,
          lng: event.coordinates!.lng ?? 0,
        },
      });
    }

    setMapMarkersData(newMapMarkersData);
    setIsLoading(false);
  }, [events]);

  if (isLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    !isLoading &&
    mapMarkersData.length > 0 && (
      <Map
        key={JSON.stringify(mapMarkersData)}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
        style={{
          height,
          maxWidth,
          border: "2px solid black",
          borderRadius,
          overflow: "hidden",
        }}
        defaultCenter={mapMarkersData[0].position}
        defaultZoom={11}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {mapMarkersData.map((mapMarkerData, index) => (
          <MapMarker
            key={index}
            position={mapMarkerData.position}
            timeOfDay={mapMarkerData.timeOfDay}
            setSelectedEvent={setSelectedEvent}
            event={mapMarkerData.event}
            selected={
              JSON.stringify(selectedEvent) ===
              JSON.stringify(mapMarkerData.event)
            }
          />
        ))}
      </Map>
    )
  );
};

export default MapSection;

export interface DayPlanWithTimeOfDay {
  morning: Event[];
  afternoon: Event[];
  evening: Event[];
}

export interface MapMarkerData {
  timeOfDay: EventTimeOfDay;
  event: Event;
  position: Position;
}
