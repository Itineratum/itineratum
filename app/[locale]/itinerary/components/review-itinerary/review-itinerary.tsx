"use client";

import AddEventDialog from "@/app/[locale]/itinerary/components/review-itinerary/add-event-dialog/add-event-dialog";
import AdjustBudgetDialog from "@/app/[locale]/itinerary/components/review-itinerary/adjust-budget-dialog/adjust-budget-dialog";
import EventDetailsDialog from "@/app/[locale]/itinerary/components/review-itinerary/event-details-dialog/event-details-dialog";
import MapSection from "@/app/[locale]/itinerary/components/review-itinerary/map-section/map-section";
import ModifyEventDialog from "@/app/[locale]/itinerary/components/review-itinerary/modify-event-dialog/modify-event-dialog";
import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import { default as constEndpoints } from "@/constants/pages/endpoints.json";
import { AddEventProvider } from "@/contexts/addEventContext";
import { AdjustBudgetDialogProvider } from "@/contexts/adjustBudgetDialogContext";
import { HotelSelectorProvider } from "@/contexts/hotelSelectorContext";
import { ModifyEventProvider } from "@/contexts/modifyEventContext";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Event } from "@/lib/pythonBackend/types";
import { getItinerarySummaryText } from "@/lib/pythonBackend/utils";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Snackbar,
  Stack,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../styles";
import BackButton from "./back-button";
import BudgetSection from "./budget-section/budget-section";
import DayButtons from "./day-buttons/day-buttons";
import DetailsSection from "./details-section/details-section";
import EditItinerarySection from "./edit-itinerary-section/edit-itinerary-section";
import HotelSelectorDialog from "./hotel-selector-dialog/hotel-selector-dialog";
import ItineraryGeneratedSection from "./itinerary-generated-section/itinerary-generated-section";
import SelectHotelButton from "./select-hotel-button";

const ReviewItinerary = ({}: {}) => {
  const {
    isLoading,
    error,
    itineraryData,
    setShowSnackbar,
    events,
    indexToModifyEventAt,
    showSnackbar,
  } = useReviewItinerary();
  const locale = useLocale();

  const t = useTranslations("itinerary");
  const styles = ITINERARY_STYLES;

  if (isLoading)
    return (
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container>
        <Stack direction="column" spacing={styles.REVIEW_ITINERARY.GAP}>
          <Text text={error} variant={TypographyVariant.h4} bold={true} />
          <Link
            href={buildLocaleEndpoint(locale, constEndpoints.home.endpoint)}
          >
            <Button variant="contained">{t("goBackHome")}</Button>
          </Link>
        </Stack>
      </Container>
    );

  if (!itineraryData)
    return (
      <Container>
        <Text
          text={t("noItinerary")}
          variant={TypographyVariant.h4}
          bold={true}
        />
      </Container>
    );

  const snackbarHandleOnClose = (event?: any, reason?: any) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar(false);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: styles.REVIEW_ITINERARY.GAP,
        paddingBottom: styles.REVIEW_ITINERARY.PADDING_BOTTOM,
      }}
    >
      <BackButton />
      <BudgetSection />
      {/* itinerary summary text */}
      <Text
        text={getItinerarySummaryText(itineraryData)}
        variant={TypographyVariant.h4}
        bold={true}
        textDecoration={TypographyTextDecoration.underline}
      />
      <DayButtons />
      <Box display="flex" justifyContent="flex-start">
        <SelectHotelButton />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: styles.REVIEW_ITINERARY.GAP,
          justifyContent: "center",
        }}
      >
        <ItineraryGeneratedSection />
        <DetailsSection />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
        }}
      >
        <EditItinerarySection />
      </Box>
      <MapSection />
      <AdjustBudgetDialogProvider>
        <AdjustBudgetDialog />
      </AdjustBudgetDialogProvider>
      <HotelSelectorProvider>
        <HotelSelectorDialog />
      </HotelSelectorProvider>
      <EventDetailsDialog />
      <AddEventProvider>
        <AddEventDialog />
      </AddEventProvider>
      <ModifyEventProvider>
        <ModifyEventDialog
          key={JSON.stringify(events[indexToModifyEventAt!])}
        />
      </ModifyEventProvider>
      <Snackbar
        open={showSnackbar}
        onClose={snackbarHandleOnClose}
        autoHideDuration={styles.SNACKBAR_AUTO_HIDE_DURATIOON}
        message={t("noReorder")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Container>
  );
};

export default ReviewItinerary;

export enum ItineraryEditAction {
  delete = "delete",
  add = "add",
  modify = "modify",
  reorder = "reorder",
}

export interface DeleteEventFromItineraryDetails {
  indexToDeleteEventFrom: number;
  event: Event;
}

export interface AddEventToItineraryDetails {
  indexToAddEventTo: number;
  newEvent: Event;
}

export interface ModifyEventInItineraryDetails {
  indexToModifyEventAt: number;
  modifiedEvent: Event;
  timeOfDayChange: boolean;
  dayNumChange: boolean;
  dayNum: number;
}

export interface ReorderEventInItineraryDetails {
  event: Event;
  oldEventIndex: number;
  newEventIndex: number;
}

export type ItineraryEditDetails =
  | DeleteEventFromItineraryDetails
  | AddEventToItineraryDetails
  | ModifyEventInItineraryDetails
  | ReorderEventInItineraryDetails;
