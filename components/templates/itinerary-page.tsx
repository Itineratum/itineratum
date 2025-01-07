"use client";

import DayButton from "@/app/[locale]/itinerary/components/day-button";
import EventCard, {
  EventCardTimeOfDay,
} from "@/app/[locale]/itinerary/components/event-card";
import EventDetailsCard, {
  eventDetailsCardHeight,
  eventDetailsCardOverlapOffset,
} from "@/app/[locale]/itinerary/components/event-details-card";
import EventDetailsDialog from "@/app/[locale]/itinerary/components/event-details-dialog";
import MapSection from "@/app/[locale]/itinerary/components/map-section";
import TravelCard from "@/app/[locale]/itinerary/components/travel-card";
import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import { IItinerary } from "@/constants/types/itinerary";
import { DayPlan, Event } from "@/lib/pythonBackend/types";
import { Box, CircularProgress, Container, Stack } from "@mui/material";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

const ItineraryPage = ({ params }: { params: { id: string } }) => {
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
  const [travelTimes, setTravelTimes] = useState<any[]>([]);

  const routesLibrary = useMapsLibrary("routes");
  const map = useMap();

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

  const getTravelOriginDestinations = (list: string[]): string[][] => {
    const result: string[][] = [];

    for (let i = 0; i < list.length - 1; i++) {
      result.push([list[i], list[i + 1]]);
    }

    return result;
  };

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

  useEffect(() => {
    if (!map || !routesLibrary || !dayPlan) return;

    const distanceMatrixService = new routesLibrary.DistanceMatrixService();
    const eventLocations: string[] = dayPlan.morning
      .concat(dayPlan.afternoon)
      .concat(dayPlan.evening)
      .map((event) => event.location_address);

    const originDestinationPairs = getTravelOriginDestinations(eventLocations);

    const fetchTravelTimes = async () => {
      const newTravelTimes: any[] = [];

      for (const originDestinationPair of originDestinationPairs) {
        const request: google.maps.DistanceMatrixRequest = {
          origins: [originDestinationPair[0]],
          destinations: [originDestinationPair[1]],
          travelMode: google.maps.TravelMode.DRIVING, // using the driving travel mode for now, can't seem to use transit travel mode
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        };

        try {
          const response =
            await distanceMatrixService.getDistanceMatrix(request);
          const travelTime = {
            // origin: originDestinationPair[0],
            // destination: originDestinationPair[1],
            distance: response.rows[0].elements[0].distance.text,
            duration: response.rows[0].elements[0].duration.text,
          };
          newTravelTimes.push(travelTime);
        } catch (error) {
          console.error("Error fetching distance matrix:", error);
        }
      }

      console.log(newTravelTimes);
      setTravelTimes(newTravelTimes);
    };

    fetchTravelTimes();
  }, [map, routesLibrary]);

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
    //   const startDate = dayjs(itineraryData.request.payload.start_date);
    //   const date = dayNum === 1 ? startDate : startDate.add(dayNum - 1, "day");
    //   const destination = dayPlan!.destination;

    //   const morningEventCards = () => {
    //     const events = dayPlan!.morning;

    //     return (
    //       <Stack direction="column" spacing={spacing}>
    //         {events.map((event) => {
    //           if (!event) return null;

    //           return (
    //             <EventCard
    //               date={date}
    //               destination={destination}
    //               timeOfDay={EventCardTimeOfDay.morning}
    //               setSelectedEvent={setSelectedEvent}
    //               event={event}
    //               selected={
    //                 JSON.stringify(event) === JSON.stringify(selectedEvent)
    //               }
    //             />
    //           );
    //         })}
    //       </Stack>
    //     );
    //   };

    //   const afternoonEventCards = () => {
    //     const events = dayPlan!.afternoon;

    //     return (
    //       <Stack direction="column" spacing={spacing}>
    //         {events.map((event) => {
    //           if (!event) return null;

    //           return (
    //             <EventCard
    //               date={date}
    //               destination={destination}
    //               timeOfDay={EventCardTimeOfDay.afternoon}
    //               setSelectedEvent={setSelectedEvent}
    //               event={event}
    //               selected={
    //                 JSON.stringify(event) === JSON.stringify(selectedEvent)
    //               }
    //             />
    //           );
    //         })}
    //       </Stack>
    //     );
    //   };

    //   const eveningEventCards = () => {
    //     const events = dayPlan!.evening;

    //     return (
    //       <Stack direction="column" spacing={spacing}>
    //         {events.map((event) => {
    //           if (!event) return null;

    //           return (
    //             <EventCard
    //               date={date}
    //               destination={destination}
    //               timeOfDay={EventCardTimeOfDay.evening}
    //               setSelectedEvent={setSelectedEvent}
    //               event={event}
    //               selected={
    //                 JSON.stringify(event) === JSON.stringify(selectedEvent)
    //               }
    //             />
    //           );
    //         })}
    //       </Stack>
    //     );
    //   };

    //   return (
    //     <Stack direction="column" spacing={spacing}>
    //       {morningEventCards()}
    //       {afternoonEventCards()}
    //       {eveningEventCards()}
    //     </Stack>
    //   );
    // };

    const eventCardsWithTravelTime = () => {
      const startDate = dayjs(itineraryData.request.payload.start_date);
      const date = dayNum === 1 ? startDate : startDate.add(dayNum - 1, "day");
      const destination = dayPlan!.destination;

      const events = dayPlan!.morning
        .concat(dayPlan!.afternoon)
        .concat(dayPlan!.evening);

      return (
        <Stack direction="column" spacing={2}>
          {events.map((event, index) => (
            <React.Fragment key={index}>
              <EventCard
                date={date}
                destination={destination}
                timeOfDay={
                  index < dayPlan!.morning.length
                    ? EventCardTimeOfDay.morning
                    : index <
                        dayPlan!.morning.length + dayPlan!.afternoon.length
                      ? EventCardTimeOfDay.afternoon
                      : EventCardTimeOfDay.evening
                }
                setSelectedEvent={setSelectedEvent}
                event={event}
                selected={
                  JSON.stringify(event) === JSON.stringify(selectedEvent)
                }
              />
              {index < events.length - 1 && travelTimes[index] && (
                <TravelCard
                  duration={travelTimes[index].duration}
                  distance={travelTimes[index].distance}
                />
              )}
            </React.Fragment>
          ))}
        </Stack>
      );
    };

    return (
      <Stack direction="column" spacing={spacing}>
        {heading()}
        {eventCardsWithTravelTime()}
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
  );
};

export default ItineraryPage;
