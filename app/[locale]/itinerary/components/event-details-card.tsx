import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { Event } from "@/lib/pythonBackend/types";
import { Box, Button } from "@mui/material";
import { useTranslations } from "next-intl";

export const eventDetailsCardHeight = 300;
export const eventDetailsCardOverlapOffset = 190;

const EventDetailsCard = ({
  event,
  index,
  setSelectedEvent,
  selected,
}: {
  event: Event;
  index: number;
  setSelectedEvent: any;
  selected: boolean;
}) => {
  const t = useTranslations("itinerary.eventDetailsCard");

  const height = eventDetailsCardHeight;
  const width = "575px";
  const borderRadius = "20px";
  const overlapOffset = eventDetailsCardOverlapOffset;
  const hoverAnimationDuration = "0.3s";
  const hoverSx = {
    transform: "scale(1.05)",
    zIndex: 3, // Bring the hovered card to the front
  };
  const transform = selected ? hoverSx.transform : "";
  const zIndex = selected ? hoverSx.zIndex : 3 - index;

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
            text={event.location_name.toUpperCase()}
            variant={TypographyVariant.h3}
            bold={false}
          />
        </Box>
      );
    };

    const learnMoreButton = () => {
      const handleOnClick = () => {
        // TODO:
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
          backgroundImage: `url(${
            // TODO: ensure the event has image url, this is only a placeholder
            "https://boutiquejapan.com/wp-content/uploads/2019/07/yasaka-pagoda-higashiyama-kyoto-japan.jpg"
          })`,
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
