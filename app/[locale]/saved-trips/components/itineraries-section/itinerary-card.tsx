import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { defaultEventImageSrc } from "@/constants/pages/components/itineraryGenerator";
import endpointsConst from "@/constants/pages/endpoints.json";
import { Box, Button, Skeleton } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SAVED_TRIPS_STYLES } from "../styles";

const ItineraryCard = ({
  title,
  pictureUrl,
  itineraryId,
  numOfCards,
  index,
  selected,
}: {
  title: string;
  pictureUrl: string;
  itineraryId: string;
  numOfCards: number;
  index: number;
  selected: boolean;
}) => {
  const router = useRouter();

  const styles = SAVED_TRIPS_STYLES.ITINERARIES_SECTION.ITINERARY_CARD;

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
        height={styles.HEIGHT}
        width={styles.WIDTH}
        variant="rounded"
        animation="wave"
      />
    );
  }

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
        top: `${index * styles.OVERLAP_OFFSET}px`,
        zIndex,
        transition: `transform ${styles.HOVER_ANIMATION_DURATION}`,
        transform,
        "&:hover": hoverSx,
      }}
    >
      <Box
        sx={{
          position: "relative",
          borderRadius: styles.BORRDER_RADIUS,
          overflow: "hidden",
          height: styles.HEIGHT,
          width: { xs: styles.WIDTH_MOBILE, md: styles.WIDTH },
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
        {/* overlay */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: styles.BORRDER_RADIUS,
            border: "2px solid black",
            padding: "8px 16px",
            textAlign: "center",
            minWidth: styles.OVERLAY_WIDTH,
            maxWidth: styles.OVERLAY_WIDTH,
          }}
        >
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
              variant={TypographyVariant.h6}
              bold={false}
            />
          </Box>
        </Box>
      </Box>
    </Button>
  );
};

export default ItineraryCard;
