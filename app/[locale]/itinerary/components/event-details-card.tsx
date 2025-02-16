import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { defaultEventImageSrc } from "@/constants/pages/components/itineraryGenerator";
import { Event } from "@/lib/pythonBackend/types";
import { Box, Button, Skeleton } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const eventDetailsCardHeight = 300;
export const eventDetailsCardOverlapOffset = 0.85 * eventDetailsCardHeight;

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
  const width = 1.9 * height;
  const borderRadius = "20px";
  const overlapOffset = eventDetailsCardOverlapOffset;
  const hoverAnimationDuration = "0.3s";
  const hoverSx = {
    transform: "scale(1.1)",
    zIndex: numOfCards, // Bring the hovered card to the front
  };
  const transform = selected ? hoverSx.transform : "";
  const zIndex = selected ? hoverSx.zIndex : numOfCards - index;

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);

    if (event.photo === "" || !event.photo) {
      setImageSrc(defaultEventImageSrc);
    } else {
      setImageSrc(event.photo);
    }

    setIsLoading(false);
  }, [event.photo]);

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
          border: "2px solid black",
        }}
      >
        {imageSrc && (
          <Image
            key={imageSrc}
            src={imageSrc}
            alt="Event image"
            layout="fill"
            objectFit="cover"
            priority
          />
        )}
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
        width: { xs: "100%", md: width },
      }}
    >
      {card()}
    </Button>
  );
};

export default EventDetailsCard;
