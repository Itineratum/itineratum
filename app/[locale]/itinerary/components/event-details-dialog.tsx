import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { defaultEventImageSrc } from "@/constants/pages/components/itineraryGenerator";
import { Event } from "@/lib/pythonBackend/types";
import { extractPlaceId } from "@/lib/pythonBackend/utils";
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Rating,
  Skeleton,
  Stack,
} from "@mui/material";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Dispatch, SetStateAction, Suspense, useEffect, useState } from "react";

const EventDetailsDialog = ({
  open,
  setOpen,
  event,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  event: Event | null;
}) => {
  const t = useTranslations("itinerary.eventDetailsCard");

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const placesLibrary = useMapsLibrary("places");
  const map = useMap();

  const height = 442;
  const width = 1087;

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
    fetchEventImage();
  }, [event, placesLibrary, map]);

  const handleOnClose = () => {
    setOpen(false);
  };

  const image = () => {
    return isLoading || !imageSrc ? (
      <Skeleton
        variant="rounded"
        height={height}
        width={width}
        animation="wave"
      />
    ) : (
      <Image
        key={JSON.stringify(event)}
        style={{
          borderRadius: "20px",
          border: "2px solid black",
          objectFit: "cover",
        }}
        src={imageSrc!}
        alt={"Event image"}
        width={width}
        height={height}
        priority
      />
    );
  };

  const title = () => {
    return (
      <DialogTitle maxWidth={width - 80}>
        <Text
          text={event ? event.event_name : ""}
          variant={TypographyVariant.h4}
          bold={false}
        />
      </DialogTitle>
    );
  };

  const description = () => {
    return (
      <DialogContentText maxWidth={width - 80}>
        <Text
          text={event ? event.description : ""}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
      </DialogContentText>
    );
  };

  const details = () => {
    const spacing = 2;
    const padding = 2;
    const typographyVariant = TypographyVariant.body1;

    const address = () => {
      return (
        <Stack direction="row" spacing={spacing}>
          <Text
            text={t("address") + ": "}
            variant={typographyVariant}
            bold={true}
            color={colorsConst.palette.text.primary}
          />
          <Text
            text={event ? event.location_address : ""}
            variant={typographyVariant}
            bold={false}
            color={colorsConst.palette.text.primary}
          />
        </Stack>
      );
    };

    const website = () => {
      return event && event.website_uri && event.website_uri !== "N/A" ? (
        <Stack direction="row" spacing={spacing}>
          <Text
            text={t("website") + ": "}
            variant={typographyVariant}
            bold={true}
            color={colorsConst.palette.text.primary}
          />
          <Text
            text={t("clickHere")}
            variant={typographyVariant}
            bold={false}
            color={colorsConst.palette.text.primary}
            link={event ? event.website_uri : ""}
          />
        </Stack>
      ) : null;
    };

    const openingHoursRatingSection = () => {
      const openingHours = () => {
        const getFormattedOpeningHours = (openingHours: string[]): string => {
          if (openingHours.length == 0) return "NA";

          const groupedHours: { days: string[]; hours: string }[] = [];

          openingHours.forEach((entry) => {
            const [day, hours] = entry.split(": ");

            if (
              !groupedHours.length ||
              groupedHours[groupedHours.length - 1].hours !== hours
            ) {
              groupedHours.push({ days: [day], hours });
            } else {
              groupedHours[groupedHours.length - 1].days.push(day);
            }
          });

          let output: string = "";

          groupedHours.map(({ days, hours }) => {
            if (days.length === 1) {
              output += `${days[0].slice(0, 3)} | ${hours}\n`;
            } else {
              output += `${days[0].slice(0, 3)} - ${days[days.length - 1].slice(0, 3)} | ${hours}\n`;
            }
          });

          return output;
        };

        return (
          <Stack direction="row" spacing={spacing}>
            <Text
              text={t("openingHours") + ": "}
              variant={TypographyVariant.body1}
              bold={true}
              color={colorsConst.palette.text.primary}
            />
            <Text
              text={event ? getFormattedOpeningHours(event.openingHours) : ""}
              variant={TypographyVariant.body1}
              bold={false}
              color={colorsConst.palette.text.primary}
            />
          </Stack>
        );
      };

      const rating = () => {
        const ratingSpacing = 2;

        return (
          <Stack direction="row" spacing={ratingSpacing}>
            <Text
              text={t("rating") + ": "}
              variant={typographyVariant}
              bold={true}
              color={colorsConst.palette.text.primary}
            />
            {event ? (
              <Stack direction="row" spacing={ratingSpacing}>
                <Rating
                  precision={0.1}
                  value={event.rating ? event.rating : 0}
                  readOnly
                />
                <Text
                  text={event.rating ? `${event.rating}/5` : "No Rating"}
                  variant={typographyVariant}
                  bold={false}
                  color={colorsConst.palette.text.primary}
                />
              </Stack>
            ) : null}
          </Stack>
        );
      };

      if (
        event &&
        event.openingHours &&
        event.openingHours.length > 0 &&
        event.rating &&
        event.rating > 0
      ) {
        return (
          <Grid container>
            <Grid item xs={8}>
              {openingHours()}
            </Grid>
            <Grid item xs={4}>
              {rating()}
            </Grid>
          </Grid>
        );
      } else if (event && event.openingHours && event.openingHours.length > 0) {
        return openingHours();
      } else if (event && event.rating && event.rating > 0) {
        return rating();
      } else {
        return null;
      }
    };

    return (
      <Stack direction="column" spacing={spacing} paddingTop={padding}>
        {address()}
        {website()}
        {openingHoursRatingSection()}
      </Stack>
    );
  };

  return (
    <Dialog
      key={JSON.stringify(event)}
      fullScreen={false}
      open={open}
      onClose={handleOnClose}
      maxWidth={false}
    >
      <Box sx={{ padding: "16px" }}>
        {image()}
        {title()}
        <DialogContent>
          {description()}
          {details()}
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default EventDetailsDialog;
