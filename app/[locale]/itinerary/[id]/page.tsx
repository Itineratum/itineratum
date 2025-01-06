"use client";

import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import { IItinerary } from "@/constants/types/itinerary";
import { DayPlan } from "@/lib/pythonBackend/types";
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
import MapSection from "../components/map-section";

const Itinerary = ({ params }: { params: { id: string } }) => {
  const t = useTranslations("itinerary");

  const [itineraryData, setItineraryData] = useState<IItinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dayNum, setDayNum] = useState<number>(1);
  const [numDays, setNumDays] = useState<number>(1);
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);

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

      const morningEventCard = () => {
        return dayPlan!.morning ? (
          <EventCard
            date={date}
            location={dayPlan!.morning.location_name}
            destination={dayPlan!.destination}
            timeOfDay={EventCardTimeOfDay.morning}
          />
        ) : null;
      };

      const afternoonEventCard = () => {
        return dayPlan!.afternoon ? (
          <EventCard
            date={date}
            location={dayPlan!.afternoon.location_name}
            destination={dayPlan!.destination}
            timeOfDay={EventCardTimeOfDay.afternoon}
          />
        ) : null;
      };

      const eveningEventCard = () => {
        return dayPlan!.evening ? (
          <EventCard
            date={date}
            location={dayPlan!.evening.location_name}
            destination={dayPlan!.destination}
            timeOfDay={EventCardTimeOfDay.evening}
          />
        ) : null;
      };

      return (
        <Stack direction="column" spacing={spacing}>
          {morningEventCard()}
          {afternoonEventCard()}
          {eveningEventCard()}
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
    let numOfCards = Object.values(dayPlan!).filter(
      (value) => value !== null && typeof value === "object",
    ).length;

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

    const morningEventDetailsCard = () => {
      return dayPlan!.morning ? (
        <EventDetailsCard event={dayPlan!.morning} index={0} />
      ) : null;
    };

    const afternoonEventDetailsCard = () => {
      return dayPlan!.afternoon ? (
        <EventDetailsCard event={dayPlan!.afternoon} index={1} />
      ) : null;
    };

    const eveningEventDetailsCard = () => {
      return dayPlan!.evening ? (
        <EventDetailsCard event={dayPlan!.evening} index={2} />
      ) : null;
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
          {morningEventDetailsCard()}
          {afternoonEventDetailsCard()}
          {eveningEventDetailsCard()}
        </Box>
        {detailsSectionNote()}
      </Stack>
    );
  };

  return (
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
        events={[dayPlan!.morning, dayPlan!.afternoon, dayPlan!.evening]}
      />
    </Container>
  );
};

export default Itinerary;
