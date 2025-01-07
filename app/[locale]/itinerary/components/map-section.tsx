"use client";

import { Event } from "@/lib/pythonBackend/types";
import { CircularProgress, Container } from "@mui/material";
import { Map } from "@vis.gl/react-google-maps";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { fromAddress, OutputFormat, setDefaults } from "react-geocode";
import { EventCardTimeOfDay } from "./event-card";
import MapMarker from "./map-marker";

const MapSection = ({
  dayPlanWithTimeOfDay,
  setSelectedEvent,
  selectedEvent,
  setEventDetailsDialogOpen,
}: {
  dayPlanWithTimeOfDay: DayPlanWithTimeOfDay;
  setSelectedEvent: any;
  selectedEvent: Event | null;
  setEventDetailsDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    language: "en",
    region: "sg",
    outputFormat: OutputFormat.JSON,
  });

  const [mapMarkersData, setMapMarkersData] = useState<MapMarkerData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const height = "700px";
  const width = "60vw";
  const borderRadius = "20px";

  useEffect(() => {
    const fetchPositions = async () => {
      const newMapMarkersData: MapMarkerData[] = [];

      for (const timeOfDay in dayPlanWithTimeOfDay) {
        if (
          !Object.prototype.hasOwnProperty.call(dayPlanWithTimeOfDay, timeOfDay)
        )
          continue;
        const events =
          dayPlanWithTimeOfDay[timeOfDay as keyof typeof dayPlanWithTimeOfDay];

        for (const event of events) {
          if (!event) continue;

          try {
            const { results } = await fromAddress(event.location_address);
            const { lat, lng } = results[0].geometry.location;
            const newMapMarkerData: MapMarkerData = {
              timeOfDay:
                EventCardTimeOfDay[
                  timeOfDay as keyof typeof EventCardTimeOfDay
                ],
              event,
              position: { lat, lng },
            };
            newMapMarkersData.push(newMapMarkerData);
          } catch (error) {
            console.error(error);
          }
        }
      }

      setMapMarkersData(newMapMarkersData);
      setIsLoading(false);
    };

    fetchPositions();
  }, [dayPlanWithTimeOfDay]);

  if (isLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Map
      key={JSON.stringify(mapMarkersData)}
      mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
      style={{
        height,
        width,
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
          setEventDetailsDialogOpen={setEventDetailsDialogOpen}
        />
      ))}
    </Map>
  );
};

export default MapSection;

export interface Position {
  lat: number;
  lng: number;
}

export interface DayPlanWithTimeOfDay {
  morning: Event[];
  afternoon: Event[];
  evening: Event[];
}

export interface MapMarkerData {
  timeOfDay: EventCardTimeOfDay;
  event: Event;
  position: Position;
}
