import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { defaultEventImageSrc } from "@/constants/pages/components/itineraryGenerator";
import { Event } from "@/lib/pythonBackend/types";
import { extractPlaceId } from "@/lib/pythonBackend/utils";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Skeleton,
} from "@mui/material";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const eventDetailsCardHeight = 300;
export const eventDetailsCardOverlapOffset = 250;

const EventDetailsCard = ({
  event,
  index,
  setSelectedEvent,
  selected,
  numOfCards,
  setEventDetailsDialogOpen,
}: {
  event: Event;
  index: number;
  setSelectedEvent: any;
  selected: boolean;
  numOfCards: number;
  setEventDetailsDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations("itinerary.eventDetailsCard");

  const height = eventDetailsCardHeight;
  const width = "575px";
  const borderRadius = "20px";
  const overlapOffset = eventDetailsCardOverlapOffset;
  const hoverAnimationDuration = "0.3s";
  const hoverSx = {
    transform: "scale(1.05)",
    zIndex: numOfCards, // Bring the hovered card to the front
  };
  const transform = selected ? hoverSx.transform : "";
  const zIndex = selected ? hoverSx.zIndex : numOfCards - index;

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const placesLibrary = useMapsLibrary("places");
  const map = useMap();

  useEffect(() => {
    if (!placesLibrary || !map) return;

    const fetchEventImage = async () => {
      if (!event) {
        setImageSrc(null);
        setIsLoading(false);
        return;
      } else if (event.photo === "") {
        setImageSrc(defaultEventImageSrc);
        setIsLoading(false);
        return;
      }

      const placeId = extractPlaceId(event.photo);

      if (!placeId) {
        setImageSrc(null);
        setIsLoading(false);
        return;
      }

      try {
        const service = new placesLibrary.PlacesService(map);
        const request = {
          placeId: placeId,
          fields: ["photos"],
        };

        service.getDetails(request, (place) => {
          if (place && place.photos) {
            setImageSrc(place?.photos[0].getUrl());
          }
        });
      } catch (error) {
        console.error("Error fetching image:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setImageSrc(null);
    setIsLoading(true);
    fetchEventImage();
  }, [event.photo, placesLibrary, map]);

  if (isLoading) {
    return (
      <Skeleton
        height={height}
        width={width}
        variant="rounded"
        animation="wave"
      />
    );
  }

  const overlay = () => {
    const width = "85%";

    const eventLabel = () => {
      return (
        <Box
          sx={{
            display: "-webkit-box", // Ensures multi-line ellipsis
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 2, // Limits text to 2 lines
            textOverflow: "ellipsis",
          }}
        >
          <Text
            text={event.event_name.toUpperCase()}
            variant={TypographyVariant.h3}
            bold={false}
          />
        </Box>
      );
    };

    const learnMoreButton = () => {
      const handleOnClick = () => {
        setEventDetailsDialogOpen(true);
      };

      return (
        <Button onClick={handleOnClick} variant="text">
          <Text
            text={t("learnMore").toUpperCase()}
            variant={TypographyVariant.h6}
            bold={false}
            color={colorsConst.palette.text.primary}
            textDecoration={TypographyTextDecoration.underline}
          />
        </Button>
      );
    };

    return (
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius,
          border: "2px solid black",
          padding: "8px 16px",
          textAlign: "center",
          minWidth: width,
          maxWidth: width,
        }}
      >
        {eventLabel()}
        {learnMoreButton()}
      </Box>
    );
  };

  const card = () => {
    return (
      <Box
        sx={{
          position: "relative",
          borderRadius,
          overflow: "hidden",
          height,
          width,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "2px solid black",
        }}
      >
        {overlay()}
      </Box>
    );
  };

  const handleOnClick = () => {
    setSelectedEvent(event);
  };

  return (
    <Button
      key={index}
      onClick={handleOnClick}
      sx={{
        position: "absolute",
        top: `${index * overlapOffset}px`,
        zIndex,
        transition: `transform ${hoverAnimationDuration}`,
        transform,
        "&:hover": hoverSx,
      }}
    >
      {card()}
    </Button>
  );
};

export default EventDetailsCard;
