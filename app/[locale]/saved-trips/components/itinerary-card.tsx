import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { defaultEventImageSrc } from "@/constants/pages/components/itineraryGenerator";
import { Box, Button, Skeleton } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import endpointsConst from "@/constants/pages/endpoints.json";

export const itineraryCardHeight = 300;
export const itineraryCardWidth = 575;
export const itineraryCardOverlapOffset = 250;

const ItineraryCard = ({
  title,
  pictureUrl,
  itineraryId,
  numOfCards,
  index,
}: {
  title: string;
  pictureUrl: string;
  itineraryId: string;
  numOfCards: number;
  index: number;
}) => {
  const router = useRouter();

  const height = itineraryCardHeight;
  const width = itineraryCardWidth;
  const borderRadius = "20px";
  const overlapOffset = itineraryCardOverlapOffset;
  const hoverAnimationDuration = "0.3s";
  const hoverSx = {
    transform: "scale(1.1)",
    zIndex: numOfCards, // Bring the hovered card to the front
  };
  const zIndex = numOfCards - index;

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);

    if (pictureUrl === "" || !pictureUrl) {
      setImageSrc(defaultEventImageSrc);
    } else {
      setImageSrc(pictureUrl);
    }

    setIsLoading(false);
  }, [pictureUrl]);

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
            text={title.toUpperCase()}
            variant={TypographyVariant.h5}
            bold={false}
          />
        </Box>
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
      </Box>
    );
  };

  const handleOnClick = () => {
    router.push(
      `${endpointsConst.itinerary.endpoint}/${itineraryId}?from=savedtrips`,
    );
  };

  return (
    <Button
      key={itineraryId}
      onClick={handleOnClick}
      sx={{
        position: "absolute",
        top: `${index * overlapOffset}px`,
        zIndex,
        transition: `transform ${hoverAnimationDuration}`,
        "&:hover": hoverSx,
      }}
    >
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
    </Button>
  );
};

export default ItineraryCard;
