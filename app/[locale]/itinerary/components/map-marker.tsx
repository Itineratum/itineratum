import colorsConst from "@/constants/pages/colors.json";
import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { OutputFormat, setDefaults } from "react-geocode";
import { EventCardTimeOfDay } from "./event-card";
import { Position } from "./map-section";
import { Event } from "@/lib/pythonBackend/types";
import { Dispatch, SetStateAction } from "react";

const MapMarker = ({
  key,
  position,
  timeOfDay,
  setSelectedEvent,
  event,
  selected,
  setEventDetailsDialogOpen,
}: {
  key: number;
  position: Position;
  timeOfDay: EventCardTimeOfDay;
  setSelectedEvent: any;
  event: Event;
  selected: boolean;
  setEventDetailsDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    language: "en",
    region: "sg",
    outputFormat: OutputFormat.JSON,
  });

  const color =
    timeOfDay === EventCardTimeOfDay.morning
      ? colorsConst.components.mapSection.morning
      : timeOfDay === EventCardTimeOfDay.afternoon
        ? colorsConst.components.mapSection.afternoon
        : colorsConst.components.mapSection.evening;
  const scale = selected ? 2 : 1;

  const handleOnClick = () => {
    setSelectedEvent(event);
    setEventDetailsDialogOpen(true);
  };

  return (
    <AdvancedMarker
      key={key}
      position={position}
      clickable={true}
      onClick={handleOnClick}
    >
      <Pin
        background={color}
        borderColor={color}
        glyphColor={colorsConst.components.mapSection.glyphColor}
        scale={scale}
      />
    </AdvancedMarker>
  );
};

export default MapMarker;
