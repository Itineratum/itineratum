"use client";

import { MapMarkerData } from "@/app/[locale]/itinerary/components/review-itinerary/map-section/map-section";
import { trpc } from "@/app/_trpc/client";
import { AlertType } from "@/constants/enums/alertType";
import { Currency } from "@/constants/enums/currency";
import { useItinerary } from "@/hooks/useItinerary";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Hotel } from "@/lib/pythonBackend/types";
import {
  AdvancedMarkerRef,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type HotelSelectorContextType = {
  hotels: Hotel[];
  destinationIndex: number;
  destination: string | undefined;
  currency: Currency;
  itineraryId: string;
  hotelTabValue: number;
  setHotelTabValue: Dispatch<SetStateAction<number>>;
  hotel: Hotel | null;
  setHotel: Dispatch<SetStateAction<Hotel | null>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  alertText: string;
  setAlertText: Dispatch<SetStateAction<string>>;
  alertType: AlertType;
  setAlertType: Dispatch<SetStateAction<AlertType>>;
  mapMarkersData: MapMarkerData[];
  setMapMarkersData: Dispatch<SetStateAction<MapMarkerData[]>>;
  hotelMarkerPopupShown: boolean;
  setHotelMarkerPopupShown: Dispatch<SetStateAction<boolean>>;
  hotelMarkerRef: (m: AdvancedMarkerRef | null) => void;
  hotelMarker: google.maps.marker.AdvancedMarkerElement | null;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  adjustItineraryHotels: any;
  utils: any;
  handleOnClose: () => void;
  hotelSelected: (hotel: Hotel | null) => boolean;
};

export const HotelSelectorContext = createContext<
  HotelSelectorContextType | undefined
>(undefined);

export const HotelSelectorProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { params } = useItinerary();
  const {
    hotelSelectorDialogOpen,
    setHotelSelectorDialogOpen,
    itineraryData,
    dayPlan,
    destinations,
    selectedHotels,
    events,
  } = useReviewItinerary();

  const hotels =
    itineraryData?.hotels[destinations.indexOf(dayPlan!.destination) ?? []] ??
    [];
  const destinationIndex = destinations.indexOf(dayPlan!.destination);
  const destination = dayPlan?.destination;
  const currency = itineraryData?.request.payload.localisation
    .currency as Currency;
  const itineraryId = params.id;

  const [hotelTabValue, setHotelTabValue] = useState<number>(0);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [mapMarkersData, setMapMarkersData] = useState<MapMarkerData[]>([]);
  const [hotelMarkerPopupShown, setHotelMarkerPopupShown] =
    useState<boolean>(false);
  const [hotelMarkerRef, hotelMarker] = useAdvancedMarkerRef();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const adjustItineraryHotels =
    trpc.itinerary.adjustItineraryHotels.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (hotels) {
      setHotel(hotels[hotelTabValue]);
      setShowAlert(false);
    }
  }, [hotels, hotelTabValue]);

  useEffect(() => {
    if (hotelSelectorDialogOpen && hotels) {
      setHotelTabValue(0);
      setHotel(hotels[0]);
      setShowAlert(false);
      setAlertText("");
      setAlertType(AlertType.info);
    }
  }, [open, destinationIndex, destination, hotels]);

  useEffect(() => {
    if (!events) return;

    const newMapMarkersData: MapMarkerData[] = [];

    for (const event of events) {
      newMapMarkersData.push({
        timeOfDay: event.time_of_day,
        event,
        position: {
          lat: event.coordinates!.lat ?? 0,
          lng: event.coordinates!.lng ?? 0,
        },
      });
    }

    setMapMarkersData(newMapMarkersData);
  }, [events]);

  const handleOnClose = () => {
    if (!isLoading) setHotelSelectorDialogOpen(false);
  };

  const hotelSelected = (hotel: Hotel | null) => {
    return selectedHotels.some(
      (selectedHotel: Hotel | null) =>
        selectedHotel &&
        hotel &&
        selectedHotel.name === hotel.name &&
        JSON.stringify(selectedHotel.coordinates) ===
          JSON.stringify(hotel.coordinates),
    );
  };

  return (
    <HotelSelectorContext.Provider
      value={{
        hotels,
        destinationIndex,
        destination,
        currency,
        itineraryId,
        hotelTabValue,
        setHotelTabValue,
        hotel,
        setHotel,
        showAlert,
        setShowAlert,
        alertText,
        setAlertText,
        alertType,
        setAlertType,
        mapMarkersData,
        setMapMarkersData,
        hotelMarkerPopupShown,
        setHotelMarkerPopupShown,
        hotelMarkerRef,
        hotelMarker,
        isLoading,
        setIsLoading,
        adjustItineraryHotels,
        utils,
        handleOnClose,
        hotelSelected,
      }}
    >
      {children}
    </HotelSelectorContext.Provider>
  );
};
