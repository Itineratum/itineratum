"use client";

import {
  AddEventToItineraryDetails,
  DeleteEventFromItineraryDetails,
  ItineraryEditAction,
  ItineraryEditDetails,
  ModifyEventInItineraryDetails,
  ReorderEventInItineraryDetails,
} from "@/app/[locale]/itinerary/components/review-itinerary/review-itinerary";
import { trpc } from "@/app/_trpc/client";
import { IItinerary } from "@/constants/types/itinerary";
import { useItinerary } from "@/hooks/useItinerary";
import { DayPlan, Event, Hotel, TravelTime } from "@/lib/pythonBackend/types";
import { getIndexToMoveModifiedEventTo } from "@/lib/pythonBackend/utils";
import { useSession } from "next-auth/react";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type ReviewItineraryContextType = {
  itineraryData: IItinerary | null;
  setItineraryData: Dispatch<SetStateAction<IItinerary | null>>;
  backupItineraryData: IItinerary | null;
  setBackupItineraryData: Dispatch<SetStateAction<IItinerary | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  dayNum: number;
  setDayNum: Dispatch<SetStateAction<number>>;
  dayPlan: DayPlan | null;
  setDayPlan: Dispatch<SetStateAction<DayPlan | null>>;
  selectedEvent: Event | null;
  setSelectedEvent: Dispatch<SetStateAction<Event | null>>;
  eventDetailsDialogOpen: boolean;
  setEventDetailsDialogOpen: Dispatch<SetStateAction<boolean>>;
  travelTimes: TravelTime[];
  setTravelTimes: Dispatch<SetStateAction<TravelTime[]>>;
  adjustBudgetDialogOpen: boolean;
  setAdjustBudgetDialogOpen: Dispatch<SetStateAction<boolean>>;
  destinations: string[];
  setDestinations: Dispatch<SetStateAction<string[]>>;
  hotelSelectorDialogOpen: boolean;
  setHotelSelectorDialogOpen: Dispatch<SetStateAction<boolean>>;
  selectedHotels: Hotel[];
  setSelectedHotels: Dispatch<SetStateAction<Hotel[]>>;
  events: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
  backupEvents: Event[];
  setBackupEvents: Dispatch<SetStateAction<Event[]>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  currentEdit: Partial<
    Record<ItineraryEditAction, ItineraryEditDetails>
  > | null;
  setCurrentEdit: Dispatch<
    SetStateAction<Partial<
      Record<ItineraryEditAction, ItineraryEditDetails>
    > | null>
  >;
  edits: Partial<Record<ItineraryEditAction, ItineraryEditDetails>>[];
  setEdits: Dispatch<
    SetStateAction<Partial<Record<ItineraryEditAction, ItineraryEditDetails>>[]>
  >;
  isSavingEdits: boolean;
  setIsSavingEdits: Dispatch<SetStateAction<boolean>>;
  indexToAddEventTo: number | null;
  setIndexToAddEventTo: Dispatch<SetStateAction<number | null>>;
  addEventDialogOpen: boolean;
  setAddEventDialogOpen: Dispatch<SetStateAction<boolean>>;
  modifyEventDialogOpen: boolean;
  setModifyEventDialogOpen: Dispatch<SetStateAction<boolean>>;
  indexToModifyEventAt: number | null;
  setIndexToModifyEventAt: Dispatch<SetStateAction<number | null>>;
  canEdit: boolean;
  setCanEdit: Dispatch<SetStateAction<boolean>>;
  isSavingitinerary: boolean;
  setIsSavingItinerary: Dispatch<SetStateAction<boolean>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  canSaveItinerary: boolean;
  setCanSaveItinerary: Dispatch<SetStateAction<boolean>>;
  canGoBack: boolean;
  setCanGoBack: Dispatch<SetStateAction<boolean>>;
  showSnackbar: boolean;
  setShowSnackbar: Dispatch<SetStateAction<boolean>>;
  getItinerary: any;
  editItinerary: any;
  saveItineraryToUser: any;
  getUserSavedItineraryIds: any;
  utils: any;
};

export const ReviewItineraryContext = createContext<
  ReviewItineraryContextType | undefined
>(undefined);

export const ReviewItineraryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data: session } = useSession();
  const email = session?.user.email;

  const { params } = useItinerary();

  const [itineraryData, setItineraryData] = useState<IItinerary | null>(null);
  const [backupItineraryData, setBackupItineraryData] =
    useState<IItinerary | null>(null);
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
    null
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
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

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
  const editItinerary = trpc.itinerary.editItinerary.useMutation();
  const saveItineraryToUser = trpc.user.saveItineraryToUser.useMutation();
  const getUserSavedItineraryIds = trpc.user.getUserSavedItineraryIds.useQuery(
    {
      email: session?.user.email!,
    },
    {
      enabled: !!email,
    }
  );
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
      setBackupItineraryData(getItinerary.data);
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
          (itineraryId: string) => itineraryId === params.id
        )
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
        const updatedItinerary = [...itineraryData!.itinerary];
        const currentDayPlanIndex = updatedItinerary.findIndex(
          (dayPlan: DayPlan) => dayPlan.day === dayNum
        );
        const currentDayEvents = [
          ...updatedItinerary[currentDayPlanIndex].events,
        ];

        const indexOfEventToDelete: number = (
          currentEdit.delete as DeleteEventFromItineraryDetails
        ).indexToDeleteEventFrom;
        currentDayEvents.splice(indexOfEventToDelete, 1);
        updatedItinerary[currentDayPlanIndex] = {
          ...updatedItinerary[currentDayPlanIndex],
          events: currentDayEvents,
        };

        setItineraryData((prev) =>
          prev ? { ...prev, itinerary: updatedItinerary } : null
        );

        setEvents(currentDayEvents);
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
        const updatedItinerary = [...itineraryData!.itinerary];
        const currentDayPlanIndex = updatedItinerary.findIndex(
          (dayPlan: DayPlan) => dayPlan.day === dayNum
        );
        const currentDayEvents = [
          ...updatedItinerary[currentDayPlanIndex].events,
        ];

        const addEventToItineraryDetails: AddEventToItineraryDetails =
          currentEdit.add as AddEventToItineraryDetails;
        const indexToAddEventTo: number =
          addEventToItineraryDetails.indexToAddEventTo;
        const newEventToAdd = addEventToItineraryDetails.newEvent;
        currentDayEvents.splice(indexToAddEventTo, 0, newEventToAdd);
        updatedItinerary[currentDayPlanIndex] = {
          ...updatedItinerary[currentDayPlanIndex],
          events: currentDayEvents,
        };

        setItineraryData((prev) =>
          prev ? { ...prev, itinerary: updatedItinerary } : null
        );

        setEvents(currentDayEvents);

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
        const modifyEventInItineraryDetails: ModifyEventInItineraryDetails =
          currentEdit.modify as ModifyEventInItineraryDetails;
        const hasTimeOfDayChange =
          modifyEventInItineraryDetails.timeOfDayChange;
        const hasDayNumChange = modifyEventInItineraryDetails.dayNumChange;
        const modifiedEvent = modifyEventInItineraryDetails.modifiedEvent;
        const indexToModifyEventAt: number =
          modifyEventInItineraryDetails.indexToModifyEventAt;

        const updatedItinerary = [...itineraryData!.itinerary];
        const currentDayPlanIndex = updatedItinerary.findIndex(
          (dayPlan: DayPlan) => dayPlan.day === dayNum
        );
        const currentDayEvents = [
          ...updatedItinerary[currentDayPlanIndex].events,
        ];

        if (hasDayNumChange) {
          // remove event from the current day and update the itinerary
          const newDayNum = modifyEventInItineraryDetails.dayNum;
          currentDayEvents.splice(indexToModifyEventAt, 1);
          updatedItinerary[currentDayPlanIndex] = {
            ...updatedItinerary[currentDayPlanIndex],
            events: currentDayEvents,
          };

          // insert the event into the target day at the correct time of day position
          const targetDayPlanIndex = updatedItinerary.findIndex(
            (dayPlan: DayPlan) => dayPlan.day === newDayNum
          );
          const targetDayEvents = [
            ...updatedItinerary[targetDayPlanIndex].events,
          ];
          const indexToMoveModifiedEventTo = getIndexToMoveModifiedEventTo(
            modifiedEvent,
            targetDayEvents
          );
          targetDayEvents.splice(indexToMoveModifiedEventTo, 0, modifiedEvent);
          updatedItinerary[targetDayPlanIndex] = {
            ...updatedItinerary[targetDayPlanIndex],
            events: targetDayEvents,
          };

          setItineraryData((prev) =>
            prev ? { ...prev, itinerary: updatedItinerary } : null
          );

          // if the user is viewing the new/target day, update the events
          if (dayNum === newDayNum) {
            setEvents(targetDayEvents);
          } else if (dayNum === updatedItinerary[currentDayPlanIndex].day) {
            setEvents(currentDayEvents);
          }
        } else if (hasTimeOfDayChange) {
          // if the user modified the event's time of day, shift it to the first index where the time of day is at, regardless of whether there are any existing events during that time of day
          currentDayEvents.splice(indexToModifyEventAt, 1);
          const indexToMoveModifiedEventTo = getIndexToMoveModifiedEventTo(
            modifiedEvent,
            currentDayEvents
          );
          currentDayEvents.splice(indexToMoveModifiedEventTo, 0, modifiedEvent);
          updatedItinerary[currentDayPlanIndex] = {
            ...updatedItinerary[currentDayPlanIndex],
            events: currentDayEvents,
          };

          setItineraryData((prev) =>
            prev ? { ...prev, itinerary: updatedItinerary } : null
          );

          setEvents(currentDayEvents);
        } else {
          currentDayEvents[indexToModifyEventAt] = modifiedEvent;
          updatedItinerary[currentDayPlanIndex] = {
            ...updatedItinerary[currentDayPlanIndex],
            events: currentDayEvents,
          };

          setItineraryData((prev) =>
            prev ? { ...prev, itinerary: updatedItinerary } : null
          );

          setEvents(currentDayEvents);
        }

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
      } else if (currentEdit.reorder || currentEdit.reorder === 0) {
        // handle event reorders
        const updatedItinerary = [...itineraryData!.itinerary];
        const currentDayPlanIndex = updatedItinerary.findIndex(
          (dayPlan: DayPlan) => dayPlan.day === dayNum
        );
        const currentDayEvents = [
          ...updatedItinerary[currentDayPlanIndex].events,
        ];

        const reorderEventInItineraryDetails: ReorderEventInItineraryDetails =
          currentEdit.reorder as ReorderEventInItineraryDetails;
        const reorderedEvent: Event = reorderEventInItineraryDetails.event;
        const oldEventIndex: number =
          reorderEventInItineraryDetails.oldEventIndex;
        const newEventIndex: number =
          reorderEventInItineraryDetails.newEventIndex;
        currentDayEvents.splice(oldEventIndex, 1);
        currentDayEvents.splice(newEventIndex, 0, reorderedEvent);
        updatedItinerary[currentDayPlanIndex] = {
          ...updatedItinerary[currentDayPlanIndex],
          events: currentDayEvents,
        };

        setItineraryData((prev) =>
          prev ? { ...prev, itinerary: updatedItinerary } : null
        );

        setEvents(currentDayEvents);

        if (edits) {
          newEdits = [...edits];

          if (newEdits.length > 0) {
            newEdits.push({
              [ItineraryEditAction.reorder]: reorderEventInItineraryDetails,
            });
          } else {
            newEdits = [
              { [ItineraryEditAction.reorder]: reorderEventInItineraryDetails },
            ];
          }
        } else {
          newEdits = [
            { [ItineraryEditAction.reorder]: reorderEventInItineraryDetails },
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

  return (
    <ReviewItineraryContext.Provider
      value={{
        itineraryData,
        setItineraryData,
        backupItineraryData,
        setBackupItineraryData,
        isLoading,
        setIsLoading,
        error,
        setError,
        dayNum,
        setDayNum,
        dayPlan,
        setDayPlan,
        selectedEvent,
        setSelectedEvent,
        eventDetailsDialogOpen,
        setEventDetailsDialogOpen,
        travelTimes,
        setTravelTimes,
        adjustBudgetDialogOpen,
        setAdjustBudgetDialogOpen,
        destinations,
        setDestinations,
        hotelSelectorDialogOpen,
        setHotelSelectorDialogOpen,
        selectedHotels,
        setSelectedHotels,
        events,
        setEvents,
        backupEvents,
        setBackupEvents,
        isEditing,
        setIsEditing,
        currentEdit,
        setCurrentEdit,
        edits,
        setEdits,
        isSavingEdits,
        setIsSavingEdits,
        indexToAddEventTo,
        setIndexToAddEventTo,
        addEventDialogOpen,
        setAddEventDialogOpen,
        modifyEventDialogOpen,
        setModifyEventDialogOpen,
        indexToModifyEventAt,
        setIndexToModifyEventAt,
        canEdit,
        setCanEdit,
        isSavingitinerary,
        setIsSavingItinerary,
        showAlert,
        setShowAlert,
        canSaveItinerary,
        setCanSaveItinerary,
        canGoBack,
        setCanGoBack,
        showSnackbar,
        setShowSnackbar,
        getItinerary,
        editItinerary,
        saveItineraryToUser,
        getUserSavedItineraryIds,
        utils,
      }}
    >
      {children}
    </ReviewItineraryContext.Provider>
  );
};
