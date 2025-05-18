import { defaultEventImageSrc } from "@/constants/pages/components/itineraryGenerator";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Event } from "@/lib/pythonBackend/types";
import { Box, Button, Skeleton } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ITINERARY_STYLES } from "../../../styles";
import Overlay from "./overlay";

const EventDetailsCard = ({
  event,
  index,
  numOfCards,
}: {
  event: Event;
  index: number;
  numOfCards: number;
}) => {
  const { setSelectedEvent, selectedEvent } = useReviewItinerary();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const t = useTranslations("itinerary.eventDetailsCard");
  const styles =
    ITINERARY_STYLES.REVIEW_ITINERARY.DETAILS_SECTION.EVENT_DETAILS_CARD;

  const selected = JSON.stringify(event) === JSON.stringify(selectedEvent);

  const hoverSx = {
    transform: "scale(1.1)",
    zIndex: numOfCards, // Bring the hovered card to the front
  };
  const transform = selected ? hoverSx.transform : "";
  const zIndex = selected ? hoverSx.zIndex : numOfCards - index;

  useEffect(() => {
    setIsLoading(true);

    if (event.photo === "" || !event.photo) {
      setImageSrc(defaultEventImageSrc);
    } else {
      setImageSrc(event.photo);
    }

    setIsLoading(false);
  }, [event.photo]);

  const handleOnClick = () => {
    setSelectedEvent(event);
  };

  if (isLoading) {
    return (
      <Skeleton
        height={styles.HEIGHT}
        width={styles.WIDTH}
        variant="rounded"
        animation="wave"
      />
    );
  }

  return (
    <Button
      key={index}
      onClick={handleOnClick}
      sx={{
        position: "absolute",
        top: `${index * styles.OVERLAP_OFFSET}px`,
        zIndex,
        transition: `transform ${styles.HOVER_ANIMATION_DURATION}`,
        transform,
        "&:hover": hoverSx,
        width: { xs: "100%", md: styles.WIDTH },
      }}
    >
      <Box
        sx={{
          position: "relative",
          borderRadius: styles.BORDER_RADIUS,
          overflow: "hidden",
          height: styles.HEIGHT,
          width: styles.WIDTH,
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
        <Overlay event={event} />
      </Box>
    </Button>
  );
};

export default EventDetailsCard;
