"use client";

import { trpc } from "@/app/_trpc/client";
import { ItineraryPageStep } from "@/constants/enums/itineraryPageStep";
import { useSession } from "next-auth/react";
import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

type ItineraryContextType = {
  itineraryPageStep: ItineraryPageStep;
  setItineraryPageStep: Dispatch<SetStateAction<ItineraryPageStep>>;
  containerHeight: string;
  setContainerHeight: Dispatch<SetStateAction<string>>;
  showSnackbar: boolean;
  setShowSnackbar: Dispatch<SetStateAction<boolean>>;
  isHandlingRedirect: boolean;
  setIsHandlingRedirect: Dispatch<SetStateAction<boolean>>;
  reviewItineraryRef: RefObject<HTMLDivElement>;
  saveItineraryRef: RefObject<HTMLDivElement>;
  params: {
    id: string;
  };
  setParams: Dispatch<
    SetStateAction<{
      id: string;
    }>
  >;
  updateItineraryGeneratedBy: any;
  saveItineraryToUser: any;
};

export const ItineraryContext = createContext<ItineraryContextType | undefined>(
  undefined,
);

export const ItineraryProvider = ({ children }: { children: ReactNode }) => {
  const [itineraryPageStep, setItineraryPageStep] = useState<ItineraryPageStep>(
    ItineraryPageStep.reviewItinerary,
  );
  const [containerHeight, setContainerHeight] = useState<string>("auto");
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [isHandlingRedirect, setIsHandlingRedirect] = useState(false);
  const [params, setParams] = useState<{ id: string }>({ id: "" });

  const reviewItineraryRef = useRef<HTMLDivElement>(null);
  const saveItineraryRef = useRef<HTMLDivElement>(null);

  const updateItineraryGeneratedBy =
    trpc.itinerary.updateItineraryGeneratedBy.useMutation();
  const saveItineraryToUser = trpc.user.saveItineraryToUser.useMutation();

  useEffect(() => {
    const activeRef =
      itineraryPageStep === ItineraryPageStep.reviewItinerary
        ? reviewItineraryRef
        : saveItineraryRef;

    if (!activeRef.current) return;

    // Reset height before measuring new component
    setContainerHeight("auto");

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        requestAnimationFrame(() => {
          setContainerHeight(`${entry.contentRect.height}px`);
        });
      }
    });

    resizeObserver.observe(activeRef.current);
    return () => resizeObserver.disconnect();
  }, [itineraryPageStep]);

  return (
    <ItineraryContext.Provider
      value={{
        itineraryPageStep,
        setItineraryPageStep,
        containerHeight,
        setContainerHeight,
        showSnackbar,
        setShowSnackbar,
        isHandlingRedirect,
        setIsHandlingRedirect,
        reviewItineraryRef,
        saveItineraryRef,
        params,
        setParams,
        updateItineraryGeneratedBy,
        saveItineraryToUser,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};
