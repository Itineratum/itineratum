"use client";

import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import { IItinerary } from "@/constants/types/itinerary";
import { CircularProgress, Container, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import DayButton from "../components/day-button";
import EventCard, { EventCardTimeOfDay } from "../components/event-card";

const Itinerary = ({ params }: { params: { id: string } }) => {
  const t = useTranslations("itinerary");

  const [itineraryData, setItineraryData] = useState<IItinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dayNum, setDayNum] = useState<number>(1);
  const [numDays, setNumDays] = useState<number>(1);

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

  useEffect(() => {
    if (getItinerary.data) {
      setItineraryData(getItinerary.data);
      setNumDays(getItinerary.data.itinerary.length);
      setIsLoading(false);
    }
  }, [getItinerary.data]);

  if (isLoading)
    return (
      <Container>
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
    let cities = "";
    let currentCity = "";
    itineraryData.itinerary.map((locationItinerary, index) => {
      const city = locationItinerary.city;

      if (city !== currentCity) {
        cities += city;
        currentCity = city;
      } else return;

      if (index < itineraryData.itinerary.length - 2) {
        cities += ", ";
      } else if (
        itineraryData.itinerary.length > 1 &&
        index == itineraryData.itinerary.length - 2
      ) {
        cities += " and ";
      }
    });
    const text = `${numDays} ${numDays > 1 ? t("days") : t("day")} ${numDays} ${numDays > 1 ? t("nights") : t("night")} ${t("to")} ${cities}`;

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
        sx={{ overflow: "scroll", maxWidth: "100%" }}
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
    const spacing: number = 2;

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
      const dayPlan = itineraryData.itinerary.filter(
        (dayPlan) => dayPlan.day === dayNum,
      )[0];
      const startDate = dayjs(itineraryData.request.payload.start_date);
      const date = dayNum === 1 ? startDate : startDate.add(dayNum - 1, "day");

      const morningEventCard = () => {
        return dayPlan.morning ? (
          <EventCard
            date={date}
            location={dayPlan.morning.location_name}
            city={dayPlan.city}
            timeOfDay={EventCardTimeOfDay.morning}
          />
        ) : null;
      };

      const afternoonEventCard = () => {
        return dayPlan.afternoon ? (
          <EventCard
            date={date}
            location={dayPlan.afternoon.location_name}
            city={dayPlan.city}
            timeOfDay={EventCardTimeOfDay.afternoon}
          />
        ) : null;
      };

      const eveningEventCard = () => {
        return dayPlan.evening ? (
          <EventCard
            date={date}
            location={dayPlan.evening.location_name}
            city={dayPlan.city}
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

  const detailsSection = () => {};

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
      </Stack>
    </Container>
  );
};

export default Itinerary;
