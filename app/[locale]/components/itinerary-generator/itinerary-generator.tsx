"use client";

import colorsConst from "@/constants/pages/colors.json";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { Box, Button, Container, Stack } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FormProvider, get, useForm } from "react-hook-form";
import Step1 from "./step-1";
import Step2 from "./step-2";
import Step3 from "./step-3";

const ItineraryGenerator = () => {
  const t = useTranslations("home.itineraryGenerator");
  const fields = useForm<GenerateItineraryFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      userRequestedDestinations: [],
    },
  });

  const [activeStep, setActiveStep] = useState<number>(0);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [nextButtonEnabled, setNextButtonEnabled] = useState<boolean>(false);

  const numOfSteps: number = 3;
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

  // ensures that only when the fields in the activeStep are filled in, and have no errors, then the user will be able to use the navigation buttons
  const fieldsAtEachStep = [
    ["startLocation", "userRequestedDestinations", "startDate", "endDate"],
    [
      "budget",
      "totalHotelRooms",
      "numPeopleTravelling",
      "numPeopleTravelling.adults",
      "numPeopleTravelling.children",
    ],
    ["focus", "focus.focus1", "focus.focus2", "focus.focus3", "focus.focus4"],
  ];
  const watchedFields = fields.watch();
  const checkFieldsValidForActiveStep = () => {
    const hasErrorsAtActiveStep = Object.keys(fields.formState.errors).some(
      (errorField) => fieldsAtEachStep[activeStep].includes(errorField)
    );
    const requiredFieldsFilled = fieldsAtEachStep[activeStep].every(
      (field: any) => !!fields.getValues(field)
    );
    setNextButtonEnabled(
      !hasErrorsAtActiveStep &&
        requiredFieldsFilled &&
        watchedFields.userRequestedDestinations.length > 0
    );
  };
  useEffect(() => {
    checkFieldsValidForActiveStep();
  }, [watchedFields, activeStep]);

  const formFields = () => {
    const transitionDuration: number = 0.3;
    const marginTop: string = "10px";

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
    ];

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
            {steps[activeStep]}
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
          >
            {t("previous")}
          </Button>
        )
      );
    };

    const spacing = () => {
      return <Box sx={{ flexGrow: 1 }} />;
    };

    const nextButton = () => {
      const handleOnClick = () => {
        setDirection("left");
        setActiveStep((prevStep) => prevStep + 1);
      };

      return (
        activeStep < numOfSteps - 1 && (
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

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop,
        }}
      >
        {previousButton()}
        {spacing()}
        {nextButton()}
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
          width: "100%",
          overflow: "hidden",
          border,
          borderRadius,
          padding,
        }}
      >
        {formFields()}
        {navigationButtons()}
      </Stack>
    </FormProvider>
  );
};

export default ItineraryGenerator;
