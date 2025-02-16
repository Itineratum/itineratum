import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { defaultEventImageSrc } from "@/constants/pages/components/itineraryGenerator";
import { Event } from "@/lib/pythonBackend/types";
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
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { OutputFormat, setDefaults } from "react-geocode";

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

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    language: "en",
    region: "sg",
    outputFormat: OutputFormat.JSON,
  });

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hotelAddress, setHotelAddress] = useState<string>("");

  const height = 442;
  const width = 1087;
  const contentMaxWidth = width - 80;

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

  useEffect(() => {
    if (event && event.is_hotel) {
      setHotelAddress(event?.location_address);
    }
  }, [event]);

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
      <Box
        sx={{
          width: { xs: "100%", md: width },
          height: { xs: "30vh", md: height },
          position: "relative",
        }}
      >
        <Image
          key={JSON.stringify(event)}
          style={{
            borderRadius: "20px",
            border: "2px solid black",
            objectFit: "cover",
            maxHeight: height,
            maxWidth: width,
          }}
          src={imageSrc!}
          alt={"Event image"}
          layout="fill"
          priority
        />
      </Box>
    );
  };

  const title = () => {
    return (
      <DialogTitle maxWidth={contentMaxWidth}>
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
      event?.description && (
        <DialogContentText maxWidth={contentMaxWidth}>
          <Text
            text={event ? event.description : ""}
            variant={TypographyVariant.h6}
            bold={false}
            color={colorsConst.palette.text.primary}
          />
        </DialogContentText>
      )
    );
  };

  const details = () => {
    const spacing = 2;
    const padding = 2;
    const typographyVariant = TypographyVariant.body1;

    const address = () => {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            maxWidth: contentMaxWidth,
          }}
        >
          <Text
            text={t("address") + ": "}
            variant={typographyVariant}
            bold={true}
            color={colorsConst.palette.text.primary}
          />
          <Text
            text={
              event
                ? event?.is_hotel
                  ? hotelAddress
                  : event?.location_address
                : ""
            }
            variant={typographyVariant}
            bold={false}
            color={colorsConst.palette.text.primary}
          />
        </Box>
      );
    };

    const website = () => {
      return event && event.website_uri && event.website_uri !== "N/A" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            maxWidth: contentMaxWidth,
          }}
        >
          {" "}
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
        </Box>
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
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {" "}
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
          </Box>
        );
      };

      const rating = () => {
        const ratingSpacing = 2;

        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
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
          </Box>
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
          <Grid container sx={{ gap: { xs: spacing, md: 0 } }}>
            <Grid item xs={12} md={8}>
              {openingHours()}
            </Grid>
            <Grid item xs={12} md={4}>
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

    const checkInCheckOutTime = () => {
      const checkInTime = () => {
        return (
          <Stack direction="row" spacing={spacing}>
            <Text
              text={t("checkInTime") + ": "}
              variant={typographyVariant}
              bold={true}
              color={colorsConst.palette.text.primary}
            />
            <Text
              text={event?.checkInTime ?? ""}
              variant={typographyVariant}
              bold={false}
              color={colorsConst.palette.text.primary}
            />
          </Stack>
        );
      };

      const checkOutTime = () => {
        return (
          <Stack direction="row" spacing={spacing}>
            <Text
              text={t("checkOutTime") + ": "}
              variant={typographyVariant}
              bold={true}
              color={colorsConst.palette.text.primary}
            />
            <Text
              text={event?.checkOutTime ?? ""}
              variant={typographyVariant}
              bold={false}
              color={colorsConst.palette.text.primary}
            />
          </Stack>
        );
      };

      return (
        event?.is_hotel &&
        event.checkInTime &&
        event.checkOutTime && (
          <Grid container>
            <Grid item xs={12} md={6}>
              {checkInTime()}
            </Grid>
            <Grid item xs={12} md={6}>
              {checkOutTime()}
            </Grid>
          </Grid>
        )
      );
    };

    return (
      <Stack direction="column" spacing={spacing} paddingTop={padding}>
        {address()}
        {website()}
        {openingHoursRatingSection()}
        {checkInCheckOutTime()}
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
