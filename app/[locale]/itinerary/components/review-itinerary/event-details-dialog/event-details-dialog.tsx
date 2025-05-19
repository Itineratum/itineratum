import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { defaultEventImageSrc } from "@/constants/pages/components/itineraryGenerator";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  Stack,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { OutputFormat, setDefaults } from "react-geocode";
import { ITINERARY_STYLES } from "../../styles";
import Address from "./address";
import CheckInCheckOutTime from "./check-in-check-out-time";
import OpeningHoursRatingSection from "./opening-hours-rating-section/opening-hours-rating-section";
import Website from "./website";

const EventDetailsDialog = ({}: {}) => {
  const { selectedEvent, eventDetailsDialogOpen, setEventDetailsDialogOpen } =
    useReviewItinerary();
  const event = selectedEvent;

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    language: "en",
    region: "sg",
    outputFormat: OutputFormat.JSON,
  });

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EVENT_DETAILS_DIALOG;

  useEffect(() => {
    if (!event) return;

    setIsLoading(true);

    if (event.photo === "" || !event.photo) {
      setImageSrc(defaultEventImageSrc);
    } else {
      setImageSrc(event.photo);
    }

    setIsLoading(false);
  }, [event?.photo]);

  const handleOnClose = () => {
    setEventDetailsDialogOpen(false);
  };

  return (
    <Dialog
      key={JSON.stringify(event)}
      fullScreen={false}
      open={eventDetailsDialogOpen}
      onClose={handleOnClose}
      maxWidth={false}
    >
      <Box sx={{ padding: "16px" }}>
        {/* image */}
        {isLoading || !imageSrc ? (
          <Skeleton
            variant="rounded"
            height={styles.HEIGHT}
            width={styles.WIDTH}
            animation="wave"
          />
        ) : (
          <Box
            sx={{
              width: { xs: "100%", md: styles.WIDTH },
              height: { xs: "30vh", md: styles.HEIGHT },
              position: "relative",
            }}
          >
            <Image
              key={JSON.stringify(event)}
              style={{
                borderRadius: "20px",
                border: "2px solid black",
                objectFit: "cover",
                maxHeight: styles.HEIGHT,
                maxWidth: styles.WIDTH,
              }}
              src={imageSrc!}
              alt={"Event image"}
              layout="fill"
              priority
            />
          </Box>
        )}
        {/* title */}
        <DialogTitle maxWidth={styles.CONTENT_MAX_WIDTH}>
          <Text
            text={event ? event.event_name : ""}
            variant={TypographyVariant.h4}
            bold={false}
          />
        </DialogTitle>
        <DialogContent>
          {/* description */}
          {event?.description && (
            <DialogContentText maxWidth={styles.CONTENT_MAX_WIDTH}>
              <Text
                text={event ? event.description : ""}
                variant={TypographyVariant.h6}
                bold={false}
                color={colorsConst.palette.text.primary}
              />
            </DialogContentText>
          )}
          {/* details  */}
          <Stack
            direction="column"
            spacing={styles.SPACING}
            paddingTop={styles.PADDING}
          >
            <Address />
            <Website />
            <OpeningHoursRatingSection />
            <CheckInCheckOutTime />
          </Stack>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default EventDetailsDialog;
