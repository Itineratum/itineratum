"use client";

import { trpc } from "@/app/_trpc/client";
import { GenerateItineraryStep } from "@/constants/enums/generateItinerary";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useForm, UseFormReturn } from "react-hook-form";

type ItineraryGeneratorContextType = {
  session: Session | null;
  router: AppRouterInstance;
  fields: UseFormReturn<GenerateItineraryFormData, any, undefined>;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  direction: "left" | "right";
  setDirection: Dispatch<SetStateAction<"left" | "right">>;
  nextButtonEnabled: boolean;
  setNextButtonEnabled: Dispatch<SetStateAction<boolean>>;
  generatingItinerary: boolean;
  setGeneratingItinerary: Dispatch<SetStateAction<boolean>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  alertText: string;
  setAlertText: Dispatch<SetStateAction<string>>;
  generationStep: GenerateItineraryStep;
  setGenerationStep: Dispatch<SetStateAction<GenerateItineraryStep>>;
  saveItinerary: any;
};

export const ItineraryGeneratorContext = createContext<
  ItineraryGeneratorContextType | undefined
>(undefined);

export const ItineraryGeneratorProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const fields = useForm<GenerateItineraryFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      userRequestedDestinations: [],
      otherRequirements: {
        petFriendly: false,
        familyFriendly: false,
        moreSustainable: false,
      },
    },
  });

  const [activeStep, setActiveStep] = useState<number>(0);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [nextButtonEnabled, setNextButtonEnabled] = useState<boolean>(false);
  const [generatingItinerary, setGeneratingItinerary] =
    useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [generationStep, setGenerationStep] = useState<GenerateItineraryStep>(
    GenerateItineraryStep.inputting
  );

  const saveItinerary = trpc.itinerary.saveItinerary.useMutation();

  // ensures that only when the fields in the activeStep are filled in, and have no errors, then the user will be able to use the navigation buttons
  const fieldsAtEachStep = [
    ["originCountry", "userRequestedDestinations", "startDate", "endDate"],
    [
      "budget",
      "totalHotelRooms",
      "numPeopleTravelling",
      "numPeopleTravelling.adults",
      "numPeopleTravelling.children",
    ],
    [
      "focus",
      "focus.attraction",
      "focus.localCuisine",
      "focus.nature",
      "focus.shopping",
    ],
    ["preferredTransport"],
    ["userRequestedDestinations"],
    [""], // Step6 is optional
  ];
  const watchedFields = fields.watch();
  const checkFieldsValidForActiveStep = () => {
    const hasErrorsAtActiveStep = Object.keys(fields.formState.errors).some(
      (errorField) => fieldsAtEachStep[activeStep].includes(errorField)
    );
    const requiredFieldsFilled = fieldsAtEachStep[activeStep].every(
      (field: any) => !!fields.getValues(field)
    );

    // checks whether the start date of the first destination is the same as the trip start date, and the end date of the last destination is the same as the trip end date
    const step5Check =
      activeStep === 4
        ? watchedFields.userRequestedDestinations[0].startDate.isSame(
            watchedFields.startDate
          ) &&
          watchedFields.userRequestedDestinations[
            watchedFields.userRequestedDestinations.length - 1
          ].endDate.isSame(watchedFields.endDate)
        : true;

    setNextButtonEnabled(
      !hasErrorsAtActiveStep &&
        requiredFieldsFilled &&
        watchedFields.userRequestedDestinations.length > 0 &&
        step5Check
    );
  };

  useEffect(() => {
    checkFieldsValidForActiveStep();
  }, [watchedFields, activeStep]);

  return (
    <ItineraryGeneratorContext.Provider
      value={{
        session,
        router,
        fields,
        activeStep,
        setActiveStep,
        direction,
        setDirection,
        nextButtonEnabled,
        setNextButtonEnabled,
        generatingItinerary,
        setGeneratingItinerary,
        showAlert,
        setShowAlert,
        alertText,
        setAlertText,
        generationStep,
        setGenerationStep,
        saveItinerary,
      }}
    >
      {children}
    </ItineraryGeneratorContext.Provider>
  );
};
