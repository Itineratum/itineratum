"use client";

import AddCalendarEventDialog from "@/app/[locale]/saved-trips/components/add-calendar-event-dialog";
import AddToDoDialog from "@/app/[locale]/saved-trips/components/add-to-do-dialog";
import ItineraryCalendar from "@/app/[locale]/saved-trips/components/itinerary-calendar";
import ItineraryCard, {
  itineraryCardHeight,
  itineraryCardOverlapOffset,
  itineraryCardWidth,
} from "@/app/[locale]/saved-trips/components/itinerary-card";
import ToDoList from "@/app/[locale]/saved-trips/components/todo-list";
import { trpc } from "@/app/_trpc/client";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { CalendarEvent } from "@/constants/types/calendarEvent";
import { IItinerary } from "@/constants/types/itinerary";
import { getItinerarySummaryText } from "@/lib/pythonBackend/utils";
import { Box, CircularProgress, Container, Grid, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Text from "../atoms/text";

const SavedTripsPage = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const name = session?.user.name;
  const router = useRouter();
  const t = useTranslations("savedTrips");

  const [savedItineraries, setSavedItineraries] = useState<
    Record<string, IItinerary>[]
  >([]);
  const [userCalendarEvents, setUserCalendarEvents] = useState<CalendarEvent[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedItineraryId, setSelectedItineraryId] = useState<string | null>(
    null,
  );
  const [showAddCalendarEventDialog, setShowAddCalendarEventDialog] =
    useState<boolean>(false);
  const [showAddToDoDialog, setShowAddToDoDialog] = useState<boolean>(false);

  const margin = 5;
  const spacing = 2;
  const itinerariesSectionGrid = 5;
  const calendarToDoSectionGrid = 12 - itinerariesSectionGrid;

  const getUserSavedItineraries =
    trpc.user.getUserSavedItinerariesAndIds.useQuery({
      email: session?.user.email!,
    });
  const getUserCalendarEvents = trpc.user.getUserCalendarEvents.useQuery({
    email: session?.user.email!,
  });

  useEffect(() => {
    if (!isLoggedIn) router.push("/protected");
  }, [status, router]);

  useEffect(() => {
    if (getUserSavedItineraries.data) {
      setSavedItineraries(
        getUserSavedItineraries.data as unknown as Record<string, IItinerary>[],
      );
      setIsLoading(false);
    }
  }, [getUserSavedItineraries.data]);

  useEffect(() => {
    if (getUserCalendarEvents.data) {
      setUserCalendarEvents(getUserCalendarEvents.data);
    }
  }, [getUserCalendarEvents.data]);

  const itinerariesSection = () => {
    const border = `2px solid ${colorsConst.palette.secondary.main}`;
    const borderRadius = "20px";
    const numOfItineraryCards = savedItineraries.length;
    const margin = "16px";
    const spacing = 2;
    const padding = 2;
    const loadingAnimationSize = 24;

    const label = () => {
      return (
        <Text
          text={t("plannedTripsDescription") + ":"}
          variant={TypographyVariant.h6}
          bold={false}
        />
      );
    };

    const noItineraries = () => {
      return (
        <Text
          text={t("noItineraries")}
          variant={TypographyVariant.h6}
          bold={false}
        />
      );
    };

    return (
      <Grid item xs={itinerariesSectionGrid}>
        <Box
          sx={{
            border,
            borderRadius,
            padding,
            paddingBottom: padding + 3,
            width: itineraryCardWidth,
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Centers the ItineraryCards within the section
          }}
        >
          {isLoading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress size={loadingAnimationSize} />
            </Box>
          ) : savedItineraries.length === 0 ? (
            noItineraries()
          ) : (
            <Stack direction="column" spacing={spacing} alignItems="center">
              {label()}
              <Box
                sx={{
                  position: "relative",
                  height:
                    itineraryCardHeight +
                    (numOfItineraryCards - 1) * itineraryCardOverlapOffset,
                  marginBottom: margin,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center", // Ensures cards are centered
                }}
              >
                {savedItineraries.map((record, index) => {
                  const itineraryId = Object.keys(record)[0];
                  const itinerary = record[itineraryId];

                  return (
                    <ItineraryCard
                      key={itineraryId}
                      title={getItinerarySummaryText(itinerary)}
                      pictureUrl={itinerary.itinerary[0].events[0].photo}
                      itineraryId={itineraryId}
                      numOfCards={numOfItineraryCards}
                      index={index}
                      selected={selectedItineraryId === itineraryId}
                    />
                  );
                })}
              </Box>
            </Stack>
          )}
        </Box>
      </Grid>
    );
  };

  const calendarTodoSection = () => {
    const spacing = 2;
    const border = `2px solid black`;
    const borderRadius = "20px";
    const padding = "24px";

    const calendar = () => {
      return (
        <Box
          sx={{
            border,
            borderRadius,
            padding,
          }}
        >
          <ItineraryCalendar
            savedItineraries={savedItineraries}
            setSelectedItineraryId={setSelectedItineraryId}
            setShowAddCalendarEventDialog={setShowAddCalendarEventDialog}
            userCalendarEvents={userCalendarEvents}
          />
        </Box>
      );
    };

    const toDoList = () => {
      return (
        <Box
          sx={{
            border,
            borderRadius,
            padding,
            backgroundColor: colorsConst.palette.secondary.main,
          }}
        >
          <ToDoList setShowAddToDoDialog={setShowAddToDoDialog} />
        </Box>
      );
    };

    return (
      <Grid item xs={calendarToDoSectionGrid}>
        <Stack direction="column" spacing={spacing}>
          {calendar()}
          {toDoList()}
        </Stack>
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg">
      <Stack
        display="flex"
        direction="column"
        marginTop={margin}
        marginBottom={margin}
        spacing={spacing}
      >
        <Text
          text={`${t("welcome")}${name ? ` ${name}!` : "!"}`}
          variant={TypographyVariant.h2}
          bold={true}
        />
        <Grid container spacing={spacing}>
          {itinerariesSection()}
          {calendarTodoSection()}
        </Grid>
      </Stack>
      <AddCalendarEventDialog
        open={showAddCalendarEventDialog}
        setOpen={setShowAddCalendarEventDialog}
      />
      <AddToDoDialog open={showAddToDoDialog} setOpen={setShowAddToDoDialog} />
    </Container>
  );
};

export default SavedTripsPage;
