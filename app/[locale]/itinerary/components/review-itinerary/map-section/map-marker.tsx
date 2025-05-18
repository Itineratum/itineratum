import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Event, EventTimeOfDay, Position } from "@/lib/pythonBackend/types";
import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { OutputFormat, setDefaults } from "react-geocode";
import { ITINERARY_STYLES } from "../../styles";

const MapMarker = ({
  key,
  position,
  timeOfDay,
  event,
  selected,
}: {
  key: number;
  position: Position;
  timeOfDay: EventTimeOfDay;
  event: Event;
  selected: boolean | null;
}) => {
  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    language: "en",
    region: "sg",
    outputFormat: OutputFormat.JSON,
  });

  const { setSelectedEvent } = useReviewItinerary();

  const [scale, setScale] = useState<number>(1);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [popUpShown, setPopUpShown] = useState<boolean>(false);

  const color = event.is_hotel
    ? colorsConst.components.mapSection.hotel
    : timeOfDay === EventTimeOfDay.morning
      ? colorsConst.components.mapSection.morning
      : timeOfDay === EventTimeOfDay.afternoon
        ? colorsConst.components.mapSection.afternoon
        : colorsConst.components.mapSection.evening;
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.MAP_SECTION.MAP_MARKER;

  useEffect(() => {
    setScale(selected ? styles.SELECTED_SCALE : styles.DEFAULT_SCALE);
  }, [selected]);

  const handleOnClick = () => {
    if (setSelectedEvent) setSelectedEvent(event);

    setPopUpShown(true);
  };

  const handleOnMouseEnter = () => {
    if (!selected) {
      setScale(styles.HOVERED_SCALE);
    } else {
      setScale(styles.HOVERED_SELECTED_SCALE);
    }
  };

  const handleOnMouseLeave = () => {
    if (!selected) {
      setScale(styles.DEFAULT_SCALE);
    } else {
      setScale(styles.SELECTED_SCALE);
    }
  };

  const handleOnClose = () => {
    setPopUpShown(false);
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
      {/* popup */}
      {popUpShown && (
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
      )}
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
