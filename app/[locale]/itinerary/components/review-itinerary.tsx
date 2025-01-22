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
import ModifyEventDialog from "@/app/[locale]/itinerary/components/modify-event-dialog";
import TravelCard from "@/app/[locale]/itinerary/components/travel-card";
import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { Currency } from "@/constants/enums/currency";
import { ItineraryPageStep } from "@/constants/enums/itineraryPageStep";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import endpointsConst from "@/constants/pages/endpoints.json";
import { IItinerary } from "@/constants/types/itinerary";
import { DayPlan, Event, Hotel, TravelTime } from "@/lib/pythonBackend/types";
import { getItinerarySummaryText } from "@/lib/pythonBackend/utils";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Stack,
} from "@mui/material";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const ReviewItinerary = ({
  params,
  setItineraryPageStep,
}: {
  params: { id: string };
  setItineraryPageStep: Dispatch<SetStateAction<ItineraryPageStep>>;
}) => {
  const t = useTranslations("itinerary");
  const router = useRouter();
  const { data: session } = useSession();
  const email = session?.user.email;
  const locale = useLocale();

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
  const [currentEdit, setCurrentEdit] = useState<Partial<
    Record<ItineraryEditAction, ItineraryEditDetails>
  > | null>(null); // only one edit at a time, since we want to reflect the edits in real-time
  const [edits, setEdits] = useState<
    Partial<Record<ItineraryEditAction, ItineraryEditDetails>>[]
  >([]);
  const [isSavingEdits, setIsSavingEdits] = useState<boolean>(false);
  const [indexToAddEventTo, setIndexToAddEventTo] = useState<number | null>(
    null,
  );
  const [addEventDialogOpen, setAddEventDialogOpen] = useState<boolean>(false);
  const [modifyEventDialogOpen, setModifyEventDialogOpen] =
    useState<boolean>(false);
  const [indexToModifyEventAt, setIndexToModifyEventAt] = useState<
    number | null
  >(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [isSavingitinerary, setIsSavingItinerary] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [canSaveItinerary, setCanSaveItinerary] = useState<boolean>(true);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);

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
    },
  );
  const editItinerary = trpc.itinerary.editItinerary.useMutation();
  const saveItineraryToUser = trpc.user.saveItineraryToUser.useMutation();
  const getUserSavedItineraryIds = trpc.user.getUserSavedItineraryIds.useQuery(
    {
      email: session?.user.email!,
    },
    {
      enabled: !!email,
    },
  );
  const utils = trpc.useUtils();

  const getCorrectDayPlan = (): DayPlan =>
    getItinerary.data.itinerary.filter(
      (dayPlan: DayPlan) => dayPlan.day === dayNum,
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

      if (email && email === getItinerary.data.generated_by) {
        setCanEdit(true);
      }
    }
  }, [getItinerary.data, email]);

  useEffect(() => {
    if (getUserSavedItineraryIds.data) {
      setCanSaveItinerary(
        !getUserSavedItineraryIds.data.some(
          (itineraryId: string) => itineraryId === params.id,
        ),
      );
    }
  }, [getUserSavedItineraryIds.data]);

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
    if (currentEdit) {
      let newEdits: Partial<
        Record<ItineraryEditAction, ItineraryEditDetails>
      >[];

      if (currentEdit.delete || currentEdit.delete === 0) {
        // handle event deletions
        const newEvents: Event[] = [...events];
        const indexOfEventToDelete: number = (
          currentEdit.delete as DeleteEventFromItineraryDetails
        ).indexToDeleteEventFrom;
        newEvents.splice(indexOfEventToDelete, 1);
        setEvents(newEvents);
        const eventToDelete = events[indexOfEventToDelete];
        const deleteEventFromItineraryDetails: DeleteEventFromItineraryDetails =
          {
            indexToDeleteEventFrom: indexOfEventToDelete,
            event: eventToDelete,
          };

        if (edits) {
          newEdits = [...edits];

          if (newEdits.length > 0) {
            newEdits.push({
              [ItineraryEditAction.delete]: deleteEventFromItineraryDetails,
            });
          } else {
            newEdits = [
              {
                [ItineraryEditAction.delete]: deleteEventFromItineraryDetails,
              },
            ];
          }
        } else {
          newEdits = [
            { [ItineraryEditAction.delete]: deleteEventFromItineraryDetails },
          ];
        }

        setEdits(newEdits);
      } else if (currentEdit.add || currentEdit.add === 0) {
        // handle event additions
        const newEvents: Event[] = [...events];
        const addEventToItineraryDetails: AddEventToItineraryDetails =
          currentEdit.add as AddEventToItineraryDetails;
        const indexToAddEventTo: number =
          addEventToItineraryDetails.indexToAddEventTo;
        const newEventToAdd = addEventToItineraryDetails.newEvent;
        newEvents.splice(indexToAddEventTo, 0, newEventToAdd);
        setEvents(newEvents);

        if (edits) {
          newEdits = [...edits];

          if (newEdits.length > 0) {
            newEdits.push({
              [ItineraryEditAction.add]: addEventToItineraryDetails,
            });
          } else {
            newEdits = [
              { [ItineraryEditAction.add]: addEventToItineraryDetails },
            ];
          }
        } else {
          newEdits = [
            {
              [ItineraryEditAction.add]: addEventToItineraryDetails,
            },
          ];
        }

        setEdits(newEdits);
      } else if (currentEdit.modify || currentEdit.modify === 0) {
        // handle event modifications
        const newEvents: Event[] = [...events];
        const modifyEventInItineraryDetails: ModifyEventInItineraryDetails =
          currentEdit.modify as ModifyEventInItineraryDetails;
        const indexToModifyEventAt: number =
          modifyEventInItineraryDetails.indexToModifyEventAt;
        const modifiedEvent = modifyEventInItineraryDetails.modifiedEvent;
        newEvents[indexToModifyEventAt] = modifiedEvent;
        setEvents(newEvents);

        if (edits) {
          newEdits = [...edits];

          if (newEdits.length > 0) {
            newEdits.push({
              [ItineraryEditAction.modify]: modifyEventInItineraryDetails,
            });
          } else {
            newEdits = [
              { [ItineraryEditAction.modify]: modifyEventInItineraryDetails },
            ];
          }
        } else {
          newEdits = [
            { [ItineraryEditAction.modify]: modifyEventInItineraryDetails },
          ];
        }

        setEdits(newEdits);
      }
    }
  }, [currentEdit]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get("from");

    if (from === "savedtrips") setCanGoBack(true);
  }, []);

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

  const backButton = () => {
    const spacing = 2;

    const text = () => {
      return (
        <Text text={t("back")} variant={TypographyVariant.h6} bold={false} />
      );
    };

    const button = () => {
      const handleOnClick = () => {
        router.push(
          buildLocaleEndpoint(locale, endpointsConst.savedTrips.endpoint),
        );
      };

      return (
        <IconButton onClick={handleOnClick} color="primary">
          <ArrowBackIcon />
        </IconButton>
      );
    };

    return (
      canGoBack && (
        <Stack direction="row" spacing={spacing} alignItems="center">
          {button()}
          {text()}
        </Stack>
      )
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
        <Button
          variant="contained"
          onClick={handleOnClick}
          disabled={isEditing || edits.length > 0}
        >
          <Text
            text={t("adjustBudgetDialog.adjustBudget")}
            variant={TypographyVariant.button}
            bold={true}
          />
        </Button>
      );
    };

    return (
      canEdit && (
        <Stack direction="row" spacing={spacing} alignItems="center">
          {text()}
          {adjustBudgetButton()}
        </Stack>
      )
    );
  };

  const itinerarySummaryText = () => {
    return (
      <Text
        text={getItinerarySummaryText(itineraryData)}
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
      canEdit && (
        <Button
          variant="contained"
          onClick={handleOnClick}
          disabled={isEditing || edits.length > 0}
        >
          <Text
            text={`${t("hotelSelectorDialog.selectHotel")} ${dayPlan?.destination}`}
            variant={TypographyVariant.button}
            bold={true}
          />
        </Button>
      )
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
                setCurrentEdit={setCurrentEdit}
                index={index}
                setAddEventDialogOpen={setAddEventDialogOpen}
                setIndexToAddEventTo={setIndexToAddEventTo}
                setModifyEventDialogOpen={setModifyEventDialogOpen}
                setIndexToModifyEventAt={setIndexToModifyEventAt}
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
        setCurrentEdit(null);
        setEdits([]);
        setIsEditing(!isEditing);
        setEvents(backupEvents);
      };

      return (
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
      );
    };

    const editSaveButton = () => {
      // by default, only the user account that generated the itinerary can edit the itinerary
      // this means that if some un-logged in user generated the itinerary, they cannot edit the itinerary since they were not logged in
      const loadingAnimationSize: number = 24;
      const spacing = 2;

      const handleOnClick = async () => {
        if (isEditing && edits) {
          setIsSavingEdits(true);
          const data = {
            itineraryId: params.id,
            dayNum,
            newEvents: events,
            edits,
          };
          await editItinerary.mutateAsync(data);
        }

        setIsEditing(!isEditing);
        setIsSavingEdits(false);
        setEdits([]);
        utils.itinerary.getItinerary.invalidate();
        router.refresh();
      };

      return (
        <Button
          variant="contained"
          onClick={handleOnClick}
          color={isEditing ? "secondary" : "primary"}
          disabled={(isEditing && !currentEdit) || isSavingEdits}
          sx={{ width: "auto" }}
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

    const saveItineraryButton = () => {
      // by default, anyone can save the itinerary
      const loadingAnimationSize = 24;
      const spacing = 2;

      const handleOnClick = async () => {
        setShowAlert(false);

        // if the user is logged in
        if (session?.user && email) {
          setIsSavingItinerary(true);
          const data = {
            email,
            itineraryId: params.id,
          };
          await saveItineraryToUser.mutateAsync(data);
          setIsSavingItinerary(false);
          setShowAlert(true);
          utils.invalidate();
        } else {
          window.scrollTo(0, 0);
          setItineraryPageStep(ItineraryPageStep.saveItinerary);
        }
      };

      return (
        <Button
          variant="contained"
          onClick={handleOnClick}
          color="secondary"
          disabled={isEditing}
        >
          <Stack direction="row" spacing={spacing}>
            {isSavingitinerary && (
              <CircularProgress size={loadingAnimationSize} />
            )}
            <Text
              text={
                isSavingitinerary ? t("savingItinerary") : t("saveItinerary")
              }
              variant={TypographyVariant.button}
              bold={false}
            />
          </Stack>
        </Button>
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
          {canEdit && isEditing && cancelButton()}
          {canEdit && editSaveButton()}
          {!isEditing && canSaveItinerary && saveItineraryButton()}
        </Stack>
        <Alert
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          alertText={t("itinerarySaved")}
          alertType={AlertType.success}
        />
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
      {backButton()}
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
        indexToAddEventTo={indexToAddEventTo ?? 0}
        itineraryRequest={itineraryData.request}
        events={events}
        dayPlan={dayPlan!}
        setCurrentEdit={setCurrentEdit}
      />
      <ModifyEventDialog
        key={JSON.stringify(events[indexToModifyEventAt!])}
        open={modifyEventDialogOpen}
        setOpen={setModifyEventDialogOpen}
        itineraryRequest={itineraryData.request}
        events={events}
        indexToModifyEventAt={indexToModifyEventAt ?? 0}
        dayPlan={dayPlan!}
        setCurrentEdit={setCurrentEdit}
        event={events[indexToModifyEventAt!]}
      />
    </Container>
  );
};

export default ReviewItinerary;

export enum ItineraryEditAction {
  delete = "delete",
  add = "add",
  modify = "modify",
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
}

export type ItineraryEditDetails =
  | DeleteEventFromItineraryDetails
  | AddEventToItineraryDetails
  | ModifyEventInItineraryDetails;
