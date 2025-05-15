"use client";

import AddCalendarEventDialog from "@/app/[locale]/saved-trips/components/add-calendar-event-dialog/add-calendar-event-dialog";
import AddToDoDialog from "@/app/[locale]/saved-trips/components/add-to-do-dialog/add-to-do-dialog";
import CalendarToDoSection from "@/app/[locale]/saved-trips/components/calendar-todo-section/calendar-todo-section";
import ItinerariesSection from "@/app/[locale]/saved-trips/components/itineraries-section/itineraries-section";
import { SAVED_TRIPS_STYLES } from "@/app/[locale]/saved-trips/components/styles";
import { TypographyVariant } from "@/constants/enums/theme";
import { AddCalendarEventProvider } from "@/contexts/addCalendarEventContext";
import { AddToDoProvider } from "@/contexts/addToDoContext";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import { Container, Grid, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import Text from "../atoms/text";

const SavedTripsPage = () => {
  const { isMobile, name } = useSavedTrips();

  const t = useTranslations("savedTrips");
  const styles = SAVED_TRIPS_STYLES;

  return (
    <Container maxWidth="lg">
      <Stack
        display="flex"
        direction="column"
        my={styles.MARGIN}
        spacing={styles.SPACING}
      >
        <Text
          text={`${t("welcome")}${name ? ` ${name}!` : "!"}`}
          variant={TypographyVariant.h2}
          bold={true}
        />
        <Grid container spacing={isMobile ? 0 : styles.SPACING}>
          <ItinerariesSection />
          <CalendarToDoSection />
        </Grid>
      </Stack>
      <AddCalendarEventProvider>
        <AddCalendarEventDialog />
      </AddCalendarEventProvider>
      <AddToDoProvider>
        <AddToDoDialog />
      </AddToDoProvider>
    </Container>
  );
};

export default SavedTripsPage;
