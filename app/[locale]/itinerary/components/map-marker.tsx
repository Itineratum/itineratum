import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { Event, Position } from "@/lib/pythonBackend/types";
import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { OutputFormat, setDefaults } from "react-geocode";
import { EventCardTimeOfDay } from "./event-card";

const MapMarker = ({
  key,
  position,
  timeOfDay,
  setSelectedEvent,
  event,
  selected,
}: {
  key: number;
  position: Position;
  timeOfDay: EventCardTimeOfDay;
  setSelectedEvent: any;
  event: Event;
  selected: boolean | null;
}) => {
  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    language: "en",
    region: "sg",
    outputFormat: OutputFormat.JSON,
  });

  const [scale, setScale] = useState<number>(1);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [popUpShown, setPopUpShown] = useState<boolean>(false);

  const color = event.is_hotel
    ? colorsConst.components.mapSection.hotel
    : timeOfDay === EventCardTimeOfDay.morning
      ? colorsConst.components.mapSection.morning
      : timeOfDay === EventCardTimeOfDay.afternoon
        ? colorsConst.components.mapSection.afternoon
        : colorsConst.components.mapSection.evening;
  const defaultScale = 1;
  const selectedScale = 2;
  const hoveredScale = 1.5;
  const hoveredSelectedScale = 2.5;

  useEffect(() => {
    setScale(selected ? selectedScale : defaultScale);
  }, [selected]);

  const handleOnClick = () => {
    if (setSelectedEvent) setSelectedEvent(event);

    setPopUpShown(true);
  };

  const handleOnMouseEnter = () => {
    if (!selected) {
      setScale(hoveredScale);
    } else {
      setScale(hoveredSelectedScale);
    }
  };

  const handleOnMouseLeave = () => {
    if (!selected) {
      setScale(defaultScale);
    } else {
      setScale(selectedScale);
    }
  };

  const popUp = () => {
    const handleOnClose = () => {
      setPopUpShown(false);
    };

    return (
      popUpShown && (
        <InfoWindow anchor={marker} onClose={handleOnClose}>
          <Text
            text={event.event_name}
            variant={TypographyVariant.body1}
            bold={false}
          />
          <Text
            text={event.location_name}
            variant={TypographyVariant.body2}
            bold={false}
          />
        </InfoWindow>
      )
    );
  };

  return (
    <AdvancedMarker
      key={key}
      ref={markerRef}
      position={position}
      clickable={true}
      onClick={handleOnClick}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {popUp()}
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
