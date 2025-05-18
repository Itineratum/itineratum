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
};

export const ItineraryContext = createContext<ItineraryContextType | undefined>(
  undefined
);

export const ItineraryProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const email = session?.user.email;

  const [itineraryPageStep, setItineraryPageStep] = useState<ItineraryPageStep>(
    ItineraryPageStep.reviewItinerary
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

  useEffect(() => {
    const handleRedirectFromLoginSignup = async () => {
      setIsHandlingRedirect(true);

      // update the itinerary document's generated_by field to their email address
      const data = {
        email: email!,
        itineraryId: params.id,
      };
      await updateItineraryGeneratedBy.mutateAsync(data);

      // add the itinerary to the user's document in MongoDB
      await saveItineraryToUser.mutateAsync(data);

      // clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);

      setShowSnackbar(true);
      setIsHandlingRedirect(false);
    };

    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get("from");

    if (email && (from === "login" || from === "signup")) {
      // if the user was redirected back here from login/signup, then it means that they were previous viewing this itinerary but was not logged in and were instructed to do so
      handleRedirectFromLoginSignup();
    }
  }, [email]);

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
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};
