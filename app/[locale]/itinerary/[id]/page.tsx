"use client";

import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import { IItinerary } from "@/constants/types/itinerary";
import { DayPlan, Event } from "@/lib/pythonBackend/types";
import { Box, CircularProgress, Container, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import DayButton from "../components/day-button";
import EventCard, { EventCardTimeOfDay } from "../components/event-card";
import EventDetailsCard, {
  eventDetailsCardHeight,
  eventDetailsCardOverlapOffset,
} from "../components/event-details-card";
import EventDetailsDialog from "../components/event-details-dialog";
import MapSection from "../components/map-section";
import { APIProvider } from "@vis.gl/react-google-maps";

const Itinerary = ({ params }: { params: { id: string } }) => {
  const t = useTranslations("itinerary");

  const [itineraryData, setItineraryData] = useState<IItinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dayNum, setDayNum] = useState<number>(1);
  const [numDays, setNumDays] = useState<number>(1);
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventDetailsDialogOpen, setEventDetailsDialogOpen] =
    useState<boolean>(false);

  const gap = 6;
  const paddingBottom = "20px";

  const getItinerary = trpc.itinerary.getItinerary.useQuery(
    { itineraryId: params.id },
    {
      enabled: true,
      retry: false,
      onError: (error) => {
        setError(error.message);
        setIsLoading(false);
      },
    },
  );

  const getCorrectDayPlan = () =>
    getItinerary.data.itinerary.filter(
      (dayPlan: DayPlan) => dayPlan.day === dayNum,
    )[0];

  useEffect(() => {
    if (getItinerary.data) {
      setItineraryData(getItinerary.data);
      setNumDays(getItinerary.data.itinerary.length);
      setDayPlan(getCorrectDayPlan());
      setIsLoading(false);
    }
  }, [getItinerary.data]);

  useEffect(() => {
    if (getItinerary.data) {
      setDayPlan(getCorrectDayPlan());
    }
  }, [dayNum]);

  if (isLoading)
    return (
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  if (error)
    return (
      <Container>
        <Text text={error} variant={TypographyVariant.h4} bold={true} />
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

  const itinerarySummaryText = () => {
    let destinations = "";
    const userRequestedDestinations =
      itineraryData.request.payload.user_requested_destinations;

    userRequestedDestinations.map((userRequestedDestination, index) => {
      destinations += userRequestedDestination.name;

      if (index < userRequestedDestinations.length - 2) {
        destinations += ", ";
      } else if (index === userRequestedDestinations.length - 2) {
        destinations += " and ";
      }
    });
    const text = `${numDays} ${numDays > 1 ? t("days") : t("day")} ${numDays} ${numDays > 1 ? t("nights") : t("night")} ${t("to")} ${destinations}`;

    return (
      <Text
        text={text}
        variant={TypographyVariant.h4}
        bold={true}
        textDecoration={TypographyTextDecoration.underline}
      />
    );
  };

  const dayButtons = () => {
    const spacing: number = 4;

    return (
      <Stack
        direction="row"
        spacing={spacing}
        sx={{ overflow: "auto", maxWidth: "100%" }}
      >
        {Array(numDays)
          .fill(0)
          .map((_, i) => (
            <DayButton
              dayNum={i + 1}
              setDayNum={setDayNum}
              selected={i + 1 === dayNum}
            />
          ))}
      </Stack>
    );
  };

  const itineraryGeneratedSection = () => {
    const spacing = 2;

    const heading = () => {
      return (
        <Text
          text={t("itineraryGenerated")}
          variant={TypographyVariant.h5}
          bold={true}
          textDecoration={TypographyTextDecoration.underline}
        />
      );
    };

    const eventCards = () => {
      const startDate = dayjs(itineraryData.request.payload.start_date);
      const date = dayNum === 1 ? startDate : startDate.add(dayNum - 1, "day");
      const destination = dayPlan!.destination;

      const morningEventCards = () => {
        const events = dayPlan!.morning;

        return (
          <Stack direction="column" spacing={spacing}>
            {events.map((event) => {
              if (!event) return null;

              return (
                <EventCard
                  date={date}
                  destination={destination}
                  timeOfDay={EventCardTimeOfDay.morning}
                  setSelectedEvent={setSelectedEvent}
                  event={event}
                  selected={
                    JSON.stringify(event) === JSON.stringify(selectedEvent)
                  }
                />
              );
            })}
          </Stack>
        );
      };

      const afternoonEventCards = () => {
        const events = dayPlan!.afternoon;

        return (
          <Stack direction="column" spacing={spacing}>
            {events.map((event) => {
              if (!event) return null;

              return (
                <EventCard
                  date={date}
                  destination={destination}
                  timeOfDay={EventCardTimeOfDay.afternoon}
                  setSelectedEvent={setSelectedEvent}
                  event={event}
                  selected={
                    JSON.stringify(event) === JSON.stringify(selectedEvent)
                  }
                />
              );
            })}
          </Stack>
        );
      };

      const eveningEventCards = () => {
        const events = dayPlan!.evening;

        return (
          <Stack direction="column" spacing={spacing}>
            {events.map((event) => {
              if (!event) return null;

              return (
                <EventCard
                  date={date}
                  destination={destination}
                  timeOfDay={EventCardTimeOfDay.evening}
                  setSelectedEvent={setSelectedEvent}
                  event={event}
                  selected={
                    JSON.stringify(event) === JSON.stringify(selectedEvent)
                  }
                />
              );
            })}
          </Stack>
        );
      };

      return (
        <Stack direction="column" spacing={spacing}>
          {morningEventCards()}
          {afternoonEventCards()}
          {eveningEventCards()}
        </Stack>
      );
    };

    return (
      <Stack direction="column" spacing={spacing}>
        {heading()}
        {eventCards()}
      </Stack>
    );
  };

  const detailsSection = () => {
    const spacing = 2;

    const events = dayPlan!.morning
      .concat(dayPlan!.afternoon)
      .concat(dayPlan!.evening);
    let numOfCards = events.length;

    const heading = () => {
      return (
        <Text
          text={t("details") + "*"}
          variant={TypographyVariant.h5}
          bold={true}
          textDecoration={TypographyTextDecoration.underline}
        />
      );
    };

    const detailsSectionNote = () => {
      return (
        <Box sx={{ marginTop: "16px" }}>
          <Text
            text={"*" + t("eventDetailsCard.details")}
            variant={TypographyVariant.body1}
            bold={true}
          />
        </Box>
      );
    };

    return (
      <Stack direction="column" spacing={spacing}>
        {heading()}
        <Box
          sx={{
            position: "relative",
            height:
              eventDetailsCardHeight +
              (numOfCards - 1) * eventDetailsCardOverlapOffset,
            marginBottom: "16px",
          }}
        >
          {events.map((event, index) => {
            if (!event) return null;

            return (
              <EventDetailsCard
                event={event}
                index={index}
                setSelectedEvent={setSelectedEvent}
                selected={
                  JSON.stringify(event) === JSON.stringify(selectedEvent)
                }
                numOfCards={numOfCards}
                setEventDetailsDialogOpen={setEventDetailsDialogOpen}
              />
            );
          })}
        </Box>
        {detailsSectionNote()}
      </Stack>
    );
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: gap,
          paddingBottom,
        }}
      >
        {itinerarySummaryText()}
        {dayButtons()}
        <Stack direction="row" spacing={gap}>
          {itineraryGeneratedSection()}
          {detailsSection()}
        </Stack>
        <MapSection
          dayPlanWithTimeOfDay={{
            morning: dayPlan!.morning,
            afternoon: dayPlan!.afternoon,
            evening: dayPlan!.evening,
          }}
          setSelectedEvent={setSelectedEvent}
          selectedEvent={selectedEvent}
          setEventDetailsDialogOpen={setEventDetailsDialogOpen}
        />
        <EventDetailsDialog
          open={eventDetailsDialogOpen}
          setOpen={setEventDetailsDialogOpen}
          event={selectedEvent}
        />
      </Container>
    </APIProvider>
  );
};

export default Itinerary;
