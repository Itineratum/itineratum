"use client";

import { trpc } from "@/app/_trpc/client";
import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { Currency } from "@/constants/enums/currency";
import { GenerateItineraryStep } from "@/constants/enums/generateItinerary";
import colorsConst from "@/constants/pages/colors.json";
import endpointsConst from "@/constants/pages/endpoints.json";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import {
  generateItineraryJson,
  runPipelineWithGenerationSteps,
} from "@/lib/pythonBackend/pythonBackend";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { Box, Button, CircularProgress, Container, Stack } from "@mui/material";
import { getCookie } from "cookies-next";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ItineraryGenerationSteps from "../../../../components/molecules/itinerary-generation-steps";
import Step1 from "./step-1";
import Step2 from "./step-2";
import Step3 from "./step-3";
import Step4 from "./step-4";
import Step5 from "./step-5";
import Step6 from "./step-6";

const ItineraryGenerator = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations("home.itineraryGenerator");
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
    GenerateItineraryStep.inputting,
  );

  const border: string = `2px solid ${colorsConst.palette.secondary.main}`;
  const borderRadius: string = "16px";
  const padding: string = "20px";
  const marginTop: string = "20px";
  const spacing: number = 3;
  const variants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "left" ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "left" ? -1000 : 1000,
      opacity: 0,
    }),
  };

  const saveItinerary = trpc.itinerary.saveItinerary.useMutation();

  const steps = [
    <Container key={0}>
      <Step1 fields={fields} />
    </Container>,
    <Container key={1}>
      <Step2 fields={fields} />
    </Container>,
    <Container key={2}>
      <Step3 fields={fields} />
    </Container>,
    <Container key={3}>
      <Step4 fields={fields} />
    </Container>,
    <Container key={5}>
      <Step5 fields={fields} />
    </Container>,
    <Container key={6}>
      <Step6 fields={fields} />
    </Container>,
  ];

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
      (errorField) => fieldsAtEachStep[activeStep].includes(errorField),
    );
    const requiredFieldsFilled = fieldsAtEachStep[activeStep].every(
      (field: any) => !!fields.getValues(field),
    );

    // checks whether the start date of the first destination is the same as the trip start date, and the end date of the last destination is the same as the trip end date
    const step5Check =
      activeStep === 4
        ? watchedFields.userRequestedDestinations[0].startDate.isSame(
            watchedFields.startDate,
          ) &&
          watchedFields.userRequestedDestinations[
            watchedFields.userRequestedDestinations.length - 1
          ].endDate.isSame(watchedFields.endDate)
        : true;

    setNextButtonEnabled(
      !hasErrorsAtActiveStep &&
        requiredFieldsFilled &&
        watchedFields.userRequestedDestinations.length > 0 &&
        step5Check,
    );
  };
  useEffect(() => {
    checkFieldsValidForActiveStep();
  }, [watchedFields, activeStep]);

  const formFields = () => {
    const transitionDuration: number = 0.3;
    const marginTop: string = "10px";

    return (
      <motion.div
        layout
        style={{
          position: "relative",
          width: "100%",
          marginTop,
        }}
        transition={{ duration: transitionDuration }}
      >
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={activeStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: transitionDuration }}
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <Container
              sx={{
                display: "flex",
              }}
            >
              {steps[activeStep]}
            </Container>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  };

  const navigationButtons = () => {
    const previousButton = () => {
      const handleOnClick = () => {
        setDirection("right");
        setActiveStep((prevStep) => prevStep - 1);
      };

      return (
        activeStep > 0 && (
          <Button
            onClick={handleOnClick}
            variant="contained"
            color="primary"
            startIcon={<ArrowBackOutlinedIcon />}
            disabled={generatingItinerary}
          >
            {t("previous")}
          </Button>
        )
      );
    };

    const nextButton = () => {
      // whenever the user adds, removes, or rearranges the destinations, the start and end dates of each destination should be update such that:
      // - the start date of the first destination is the trip start date
      // - the end date of the last destination is the trip end date
      // - the start and end dates of the other destinations (if any) are (as evenly) spread out between the trip start and end dates (not including the start and end dates)
      const handleOnClickForStep1 = () => {
        const destinations = fields.getValues("userRequestedDestinations");
        const tripStartDate = fields.getValues("startDate");
        const tripEndDate = fields.getValues("endDate");
        const totalTripDays = tripEndDate.diff(tripStartDate, "day") + 1;

        if (destinations.length === 1) {
          // single destination gets entire trip duration
          fields.setValue(
            //@ts-ignore
            `userRequestedDestinations[0].startDate`,
            tripStartDate,
          );
          //@ts-ignore
          fields.setValue(`userRequestedDestinations[0].endDate`, tripEndDate);
        } else {
          // multiple destinations - distribute days sequentially
          let remainingDays = totalTripDays;
          let currentDate = tripStartDate;

          destinations.forEach((_, index) => {
            const isLast = index === destinations.length - 1;
            // last destination gets all remaining days, others get floor(remaining/destinations left)
            const daysToAllocate = isLast
              ? remainingDays
              : Math.floor(remainingDays / (destinations.length - index));

            fields.setValue(
              //@ts-ignore
              `userRequestedDestinations[${index}].startDate`,
              currentDate,
            );
            const endDate = currentDate.add(daysToAllocate - 1, "day");
            fields.setValue(
              //@ts-ignore
              `userRequestedDestinations[${index}].endDate`,
              endDate,
            );

            currentDate = endDate.add(1, "day");
            remainingDays -= daysToAllocate;
          });
        }
      };

      const handleOnClick = () => {
        if (activeStep === 0) handleOnClickForStep1();

        setDirection("left");
        setActiveStep((prevStep) => prevStep + 1);
      };

      return (
        activeStep < steps.length - 1 && (
          <Button
            onClick={handleOnClick}
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardOutlinedIcon />}
            disabled={!nextButtonEnabled}
          >
            {t("next")}
          </Button>
        )
      );
    };

    const generateButton = () => {
      const loadingAnimationSize: number = 24;

      const handleOnClick = async () => {
        setGeneratingItinerary(true);
        setShowAlert(false);
        setAlertText("");

        try {
          const itineraryForm = fields.getValues() as GenerateItineraryFormData;
          itineraryForm.localisation = {
            // TODO: hardcoded for now
            country: "sg",
            language: "en",
            currency:
              (getCookie("currency") as keyof typeof Currency) ?? Currency.sgd,
          };
          const itineraryJson = generateItineraryJson(itineraryForm);

          // const itinerary = await runPipeline(itineraryJson);
          // backup
          // const itinerary = backupRunPipelineResponseJson;

          const runPipelineRes = await runPipelineWithGenerationSteps(
            itineraryJson,
            setGenerationStep,
          );

          // debug
          // const runPipelineRes = await debugRunPipelineWithGenerationSteps(
          //   itineraryJson,
          //   setGenerationStep,
          // );
          // backup
          // const runPipelineRes = backupRunPipelineWithGenerationStepsJson;

          const email = session?.user?.email || null;
          const data = {
            email,
            request: itineraryJson,
            itinerary: runPipelineRes.itinerary.itinerary || [],
            hotels: runPipelineRes.hotels || [],
            flights: runPipelineRes.flights || [],
          };
          const itineraryId = await saveItinerary.mutateAsync(data);

          // redirect to the ItineraryPage component
          router.push(`${endpointsConst.itinerary.endpoint}/${itineraryId}`);
        } catch (error: any) {
          console.error(error);
          setAlertText(error.message);
          setShowAlert(true);
        } finally {
          setGeneratingItinerary(false);
        }
      };

      return (
        activeStep === steps.length - 1 && (
          <Button
            onClick={handleOnClick}
            variant="contained"
            color="secondary"
            endIcon={generatingItinerary ? null : <ArrowForwardOutlinedIcon />}
            disabled={generatingItinerary}
          >
            {generatingItinerary ? (
              <Stack direction="row" display="flex" alignItems="center">
                <CircularProgress size={loadingAnimationSize} />
                <Box sx={{ width: "20px" }} />
                {t("generating")}
              </Stack>
            ) : (
              t("generate")
            )}
          </Button>
        )
      );
    };

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop,
          flexDirection: {
            xs: generatingItinerary ? "column" : "row",
            md: "row",
          },
          gap: 3,
        }}
      >
        {previousButton()}
        {nextButton()}
        {generateButton()}
      </Box>
    );
  };

  return (
    <FormProvider {...fields}>
      <Stack
        direction="column"
        spacing={spacing}
        sx={{
          position: "relative",
          height: "auto",
          width: { xs: "85%", md: "100%" },
          overflow: "hidden",
          border,
          borderRadius,
          padding,
          mt: { xs: 15, md: 0 },
        }}
      >
        {formFields()}
        <Alert
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          alertText={alertText}
          alertType={AlertType.error}
        />
        {navigationButtons()}
        <Box>
          {generatingItinerary && (
            <ItineraryGenerationSteps generationStep={generationStep} />
          )}
        </Box>
      </Stack>
    </FormProvider>
  );
};

export default ItineraryGenerator;
