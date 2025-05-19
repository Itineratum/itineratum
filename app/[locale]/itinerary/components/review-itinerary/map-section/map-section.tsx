"use client";

import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Event, EventTimeOfDay, Position } from "@/lib/pythonBackend/types";
import { Box, CircularProgress, Container } from "@mui/material";
import { Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { ITINERARY_STYLES } from "../../styles";
import MapMarker from "./map-marker";

const MapSection = ({}: {}) => {
  const { events, selectedEvent } = useReviewItinerary();

  const [mapMarkersData, setMapMarkersData] = useState<MapMarkerData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.MAP_SECTION;

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
      <Box
        sx={{
          maxWidth: styles.MAX_WIDTH,
          height: { xs: "80vh", md: styles.HEIGHT },
        }}
      >
        <Map
          key={JSON.stringify(mapMarkersData)}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
          style={{
            border: "2px solid black",
            borderRadius: styles.BORDER_RADIUS,
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
              event={mapMarkerData.event}
              selected={
                JSON.stringify(selectedEvent) ===
                JSON.stringify(mapMarkerData.event)
              }
            />
          ))}
        </Map>
      </Box>
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
