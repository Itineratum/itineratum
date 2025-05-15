"use client";

import { trpc } from "@/app/_trpc/client";
import { CalendarEvent } from "@/constants/types/calendarEvent";
import { IItinerary } from "@/constants/types/itinerary";
import { useMediaQuery } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type SavedTripsContextType = {
  isLoggedIn: boolean;
  name: string | null | undefined;
  isMobile: boolean;
  savedItineraries: Record<string, IItinerary>[];
  setSavedItineraries: Dispatch<SetStateAction<Record<string, IItinerary>[]>>;
  userCalendarEvents: CalendarEvent[];
  setUserCalendarEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  selectedItineraryId: string | null;
  setSelectedItineraryId: Dispatch<SetStateAction<string | null>>;
  showAddCalendarEventDialog: boolean;
  setShowAddCalendarEventDialog: Dispatch<SetStateAction<boolean>>;
  showAddToDoDialog: boolean;
  setShowAddToDoDialog: Dispatch<SetStateAction<boolean>>;
  getUserSavedItineraries: any;
  getUserCalendarEvents: any;
  selectedUserCalendarEvent: CalendarEvent | null;
  setSelectedUserCalendarEvent: Dispatch<SetStateAction<CalendarEvent | null>>;
  userCalendarEventDialogOpen: boolean;
  setUserCalendarEventDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export const SavedTripsContext = createContext<
  SavedTripsContextType | undefined
>(undefined);

export const SavedTripsProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const name = session?.user.name;
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");
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
  const [selectedUserCalendarEvent, setSelectedUserCalendarEvent] =
    useState<CalendarEvent | null>(null);
  const [userCalendarEventDialogOpen, setUserCalendarEventDialogOpen] =
    useState<boolean>(false);

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

  return (
    <SavedTripsContext.Provider
      value={{
        isLoggedIn,
        name,
        isMobile,
        savedItineraries,
        setSavedItineraries,
        userCalendarEvents,
        setUserCalendarEvents,
        isLoading,
        setIsLoading,
        selectedItineraryId,
        setSelectedItineraryId,
        showAddCalendarEventDialog,
        setShowAddCalendarEventDialog,
        showAddToDoDialog,
        setShowAddToDoDialog,
        getUserSavedItineraries,
        getUserCalendarEvents,
        selectedUserCalendarEvent,
        setSelectedUserCalendarEvent,
        userCalendarEventDialogOpen,
        setUserCalendarEventDialogOpen,
      }}
    >
      {children}
    </SavedTripsContext.Provider>
  );
};
