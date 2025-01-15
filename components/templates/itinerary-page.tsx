"use client";

import AddEventDialog from "@/app/[locale]/itinerary/components/add-event-dialog";
import AdjustBudgetDialog from "@/app/[locale]/itinerary/components/adjust-budget-dialog";
import DayButton from "@/app/[locale]/itinerary/components/day-button";
import EventCard from "@/app/[locale]/itinerary/components/event-card";
import EventDetailsCard, {
  eventDetailsCardHeight,
  eventDetailsCardOverlapOffset,
} from "@/app/[locale]/itinerary/components/event-details-card";
import EventDetailsDialog from "@/app/[locale]/itinerary/components/event-details-dialog";
import HotelSelectorDialog from "@/app/[locale]/itinerary/components/hotel-selector-dialog";
import MapSection from "@/app/[locale]/itinerary/components/map-section";
import TravelCard from "@/app/[locale]/itinerary/components/travel-card";
import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import { Currency } from "@/constants/enums/currency";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { IItinerary } from "@/constants/types/itinerary";
import { DayPlan, Event, Hotel, TravelTime } from "@/lib/pythonBackend/types";
import { Box, Button, CircularProgress, Container, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ItineraryPage = ({ params }: { params: { id: string } }) => {
  const t = useTranslations("itinerary");
  const router = useRouter();

  const [itineraryData, setItineraryData] = useState<IItinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dayNum, setDayNum] = useState<number>(1);
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventDetailsDialogOpen, setEventDetailsDialogOpen] =
    useState<boolean>(false);
  const [travelTimes, setTravelTimes] = useState<TravelTime[]>([]);
  const [adjustBudgetDialogOpen, setAdjustBudgetDialogOpen] =
    useState<boolean>(false);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [hotelSelectorDialogOpen, setHotelSelectorDialogOpen] =
    useState<boolean>(false);
  const [selectedHotels, setSelectedHotels] = useState<Hotel[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [backupEvents, setBackupEvents] = useState<Event[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [edit, setEdit] = useState<Partial<
    Record<ItineraryEditAction, number | AddEventToItineraryAction>
  > | null>(null); // only one edit at a time, since we want to reflect the edits in real-time
  const [edits, setEdits] = useState<Partial<
    Record<ItineraryEditAction, Event[]>
  > | null>(null);
  const [isSavingEdits, setIsSavingEdits] = useState<boolean>(false);
  const [addEventDialogOpen, setAddEventDialogOpen] = useState<boolean>(false);
  const [indexToAddEventTo, setIndexToAddEventTo] = useState<number | null>(
    null
  );

  const gap = 6;
  const paddingBottom = "20px";

  const getItinerary = trpc.itinerary.getItinerary.useQuery(
    { itineraryId: params.id },
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: adjustBudgetDialogOpen,
      onError: (error) => {
        setError(error.message);
        setIsLoading(false);
      },
    }
  );
  const deleteEventFromItinerary =
    trpc.itinerary.deleteEventFromItinerary.useMutation();
  const utils = trpc.useUtils();

  const getCorrectDayPlan = (): DayPlan =>
    getItinerary.data.itinerary.filter(
      (dayPlan: DayPlan) => dayPlan.day === dayNum
    )[0];

  const getDestinations = () => {
    const newDestinations: string[] = [];

    getItinerary.data.itinerary.forEach((dayPlan: DayPlan) => {
      if (newDestinations.indexOf(dayPlan.destination) === -1) {
        newDestinations.push(dayPlan.destination);
      }
    });

    return newDestinations;
  };

  useEffect(() => {
    if (getItinerary.data) {
      setItineraryData(getItinerary.data);
      setDayPlan(getCorrectDayPlan());
      setDestinations(getDestinations());
      setSelectedHotels(getItinerary.data.selected_hotels ?? []);
      setTravelTimes(getItinerary.data.travel_times[dayNum - 1]);
      setIsLoading(false);
    }
  }, [getItinerary.data]);

  useEffect(() => {
    if (getItinerary.data) {
      setDayPlan(getCorrectDayPlan());
      setTravelTimes(getItinerary.data.travel_times[dayNum - 1]);
      setEvents(getCorrectDayPlan().events);
      setBackupEvents(getCorrectDayPlan().events);
      setSelectedEvent(null);
    }
  }, [dayNum]);

  // set the events state
  useEffect(() => {
    if (dayPlan) {
      const events = dayPlan.events;
      setEvents(events);
      setBackupEvents(events);
    }
  }, [dayPlan]);

  useEffect(() => {
    if (edit) {
      if (edit.delete || edit.delete === 0) {
        // handle event deletions
        const newEvents: Event[] = [...events];
        const indexOfEventToDelete: number = edit.delete as number;
        newEvents.splice(indexOfEventToDelete, 1);
        setEvents(newEvents);
        const eventToDelete = events[indexOfEventToDelete];
        let newEdits: Partial<Record<ItineraryEditAction, Event[]>>;

        if (edits) {
          newEdits = { ...edits };

          if (newEdits.delete) {
            newEdits.delete.push(eventToDelete);
          } else {
            newEdits.delete = [eventToDelete];
          }
        } else {
          newEdits = { [ItineraryEditAction.delete]: [eventToDelete] };
        }

        setEdits(newEdits);
      } else if (edit.add || edit.add === 0) {
        // TODO: handle event additions
        const newEvents: Event[] = [...events];
        const addEventToItineraryAction: AddEventToItineraryAction =
          edit.add as AddEventToItineraryAction;
        const indexToAddEventTo: number =
          addEventToItineraryAction.indexToAddEventTo;
        newEvents.splice(
          indexToAddEventTo,
          0,
          addEventToItineraryAction.newEvent
        );
        setEvents(newEvents);
        let newEdits: Partial<Record<ItineraryEditAction, Event[]>>;

        if (edits) {
        }
      } else if (edit.modify || edit.modify === 0) {
        // TODO: handle event modifications
      }
    }
  }, [edit]);

  useEffect(() => {
    console.log(edits);
  }, [edits]);

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
    const numDays = itineraryData.itinerary.length;

    const getDestinationsString = (): string => {
      let output = "";
      destinations.map((destination, index) => {
        output += destination;

        if (index < destinations.length - 2) {
          output += ", ";
        } else if (index === destinations.length - 2) {
          output += " and ";
        }
      });
      return output;
    };

    const text = `${numDays} ${numDays > 1 ? t("days") : t("day")} ${numDays} ${numDays > 1 ? t("nights") : t("night")} ${t("to")} ${getDestinationsString()}`;

    return (
      <Text
        text={text}
        variant={TypographyVariant.h4}
        bold={true}
        textDecoration={TypographyTextDecoration.underline}
      />
    );
  };

  const budgetSection = () => {
    const spacing = 4;

    const text = () => {
      return (
        <Text
          text={`${t("budget")}: ${Currency[itineraryData.request.payload.localisation.currency]}${itineraryData.request.payload.budget}`}
          variant={TypographyVariant.h4}
          bold={true}
        />
      );
    };

    const adjustBudgetButton = () => {
      const handleOnClick = () => {
        setAdjustBudgetDialogOpen(true);
      };

      return (
        <Button variant="contained" onClick={handleOnClick}>
          <Text
            text={t("adjustBudgetDialog.adjustBudget")}
            variant={TypographyVariant.button}
            bold={true}
          />
        </Button>
      );
    };

    return (
      <Stack direction="row" spacing={spacing} alignItems="center">
        {text()}
        {adjustBudgetButton()}
      </Stack>
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
        {Array(itineraryData.itinerary.length)
          .fill(0)
          .map((_, index) => (
            <DayButton
              key={index}
              dayNum={index + 1}
              setDayNum={setDayNum}
              selected={index + 1 === dayNum}
              disabled={isEditing}
            />
          ))}
      </Stack>
    );
  };

  const selectHotelButton = () => {
    const handleOnClick = () => {
      setHotelSelectorDialogOpen(true);
    };

    return (
      <Button variant="contained" onClick={handleOnClick}>
        <Text
          text={`${t("hotelSelectorDialog.selectHotel")} ${dayPlan?.destination}`}
          variant={TypographyVariant.button}
          bold={true}
        />
      </Button>
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

    const eventCardsWithTravelTime = () => {
      const spacing = 2;

      const startDate = dayjs(itineraryData.request.payload.start_date);
      const date = dayNum === 1 ? startDate : startDate.add(dayNum - 1, "day");
      const destination = dayPlan!.destination;

      const noTravelTimes = () => {
        return (
          <Box display="flex" justifyContent="center">
            <Text
              text={t("noTravelTimes")}
              variant={TypographyVariant.body1}
              bold={false}
            />
          </Box>
        );
      };

      return (
        <Stack direction="column" spacing={spacing}>
          {events.map((event, index) => (
            <Stack key={index} direction="column" spacing={spacing}>
              <EventCard
                date={date}
                destination={destination}
                timeOfDay={event.time_of_day}
                setSelectedEvent={setSelectedEvent}
                event={event}
                selected={
                  JSON.stringify(event) === JSON.stringify(selectedEvent)
                }
                isEditing={isEditing}
                setEdit={setEdit}
                index={index}
                setAddEventDialogOpen={setAddEventDialogOpen}
                setIndexToAddEventTo={setIndexToAddEventTo}
              />
              {!isEditing &&
                (travelTimes.length < 1
                  ? noTravelTimes()
                  : index < events.length - 1 &&
                    travelTimes[index] && (
                      <TravelCard travelTime={travelTimes[index]} />
                    ))}
            </Stack>
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
    const margin = "16px";
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
        <Box sx={{ marginTop: margin }}>
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
            marginBottom: margin,
          }}
        >
          {events.map((event, index) => {
            if (!event) return null;

            return (
              <EventDetailsCard
                key={index}
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

  const editItinerarySection = () => {
    const spacing = 2;

    const cancelButton = () => {
      const handleOnClick = () => {
        setEdit(null);
        setEdits(null);
        setIsEditing(!isEditing);
        setEvents(backupEvents);
      };

      return (
        isEditing && (
          <Button
            variant="contained"
            onClick={handleOnClick}
            sx={{ backgroundColor: colorsConst.palette.text.secondary }}
            disabled={isSavingEdits}
          >
            <Text
              text={t("cancel")}
              variant={TypographyVariant.button}
              bold={true}
              color={colorsConst.palette.text.primary}
            />
          </Button>
        )
      );
    };

    const editSaveButton = () => {
      const loadingAnimationSize: number = 24;
      const spacing = 2;

      // TODO: handle adding and modification of events too
      const handleOnClick = async () => {
        if (isEditing && edits) {
          // save the edits
          setIsSavingEdits(true);
          const data = {
            itineraryId: params.id,
            dayNum,
            newEvents: events,
            edits,
          };
          await deleteEventFromItinerary.mutateAsync(data);
        }

        setIsEditing(!isEditing);
        setIsSavingEdits(false);
        setEdits(null);
        utils.itinerary.getItinerary.invalidate();
        router.refresh();
      };

      return (
        <Button
          variant="contained"
          onClick={handleOnClick}
          color={isEditing ? "secondary" : "primary"}
          disabled={(isEditing && !edit) || isSavingEdits}
        >
          {isSavingEdits ? (
            <Stack direction="row" spacing={spacing}>
              <CircularProgress size={loadingAnimationSize} />
              <Text
                text={t("saving")}
                variant={TypographyVariant.button}
                bold={true}
              />
            </Stack>
          ) : (
            <Text
              text={isEditing ? t("save") : t("edit")}
              variant={TypographyVariant.button}
              bold={true}
            />
          )}
        </Button>
      );
    };

    const instructions = () => {
      return (
        isEditing && (
          <Text
            text={t("editInstructions")}
            variant={TypographyVariant.body1}
            bold={true}
          />
        )
      );
    };

    return (
      <Stack direction="column" spacing={spacing}>
        <Stack
          direction="row"
          spacing={spacing}
          display="flex"
          justifyContent="flex-end"
        >
          {cancelButton()}
          {editSaveButton()}
        </Stack>
        {instructions()}
      </Stack>
    );
  };
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: gap,
        paddingBottom,
      }}
    >
      {budgetSection()}
      {itinerarySummaryText()}
      {dayButtons()}
      <Box display="flex" justifyContent="flex-start">
        {selectHotelButton()}
      </Box>
      <Stack direction="row" spacing={gap} justifyContent="center">
        {itineraryGeneratedSection()}
        {detailsSection()}
      </Stack>
      <Box display="flex" justifyContent="flex-end">
        {editItinerarySection()}
      </Box>
      <MapSection
        events={events}
        setSelectedEvent={setSelectedEvent}
        selectedEvent={selectedEvent}
      />
      <AdjustBudgetDialog
        open={adjustBudgetDialogOpen}
        setOpen={setAdjustBudgetDialogOpen}
        itineraryRequest={itineraryData.request}
        itineraryId={params.id}
      />
      <HotelSelectorDialog
        open={hotelSelectorDialogOpen}
        setOpen={setHotelSelectorDialogOpen}
        hotels={
          itineraryData.hotels[destinations.indexOf(dayPlan!.destination) ?? []]
        }
        selectedHotels={selectedHotels}
        setSelectedHotels={setSelectedHotels}
        destinationIndex={destinations.indexOf(dayPlan!.destination)}
        destination={dayPlan!.destination}
        currency={
          itineraryData.request.payload.localisation.currency as Currency
        }
        itineraryId={params.id}
        events={events}
      />
      <EventDetailsDialog
        open={eventDetailsDialogOpen}
        setOpen={setEventDetailsDialogOpen}
        event={selectedEvent}
      />
      <AddEventDialog
        open={addEventDialogOpen}
        setOpen={setAddEventDialogOpen}
        itineraryId={params.id}
        indexToAddEventTo={indexToAddEventTo ?? 0}
        itineraryRequest={itineraryData.request}
        events={events}
        dayPlan={dayPlan!}
        setEdit={setEdit}
      />
    </Container>
  );
};

export default ItineraryPage;

export enum ItineraryEditAction {
  delete = "delete",
  add = "add",
  modify = "modify",
}

export interface AddEventToItineraryAction {
  indexToAddEventTo: number;
  newEvent: Event;
}
