"use client";

import colorsConst from "@/constants/pages/colors.json";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { Box, Button, Container, Stack } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Step1 from "./step-1";
import Step2 from "./step-2";
import Step3 from "./step-3";

const ItineraryGenerator = () => {
  const t = useTranslations("home.itineraryGenerator");
  const fields = useForm<GenerateItineraryFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [activeStep, setActiveStep] = useState<number>(0);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [navigationButtonsEnabled, setNavigationButtonsEnabled] =
    useState<boolean>(false);

  const numOfSteps: number = 3;
  const border: string = `2px solid ${colorsConst.palette.secondary.main}`;
  const borderRadius: string = "16px";
  const padding: string = "20px";
  const marginTop: string = "20px";
  const spacing: number = 30;
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
    ["budget", "totalHotelRooms", "numPeopleTravelling"],
  ];
  const watchedFields = fields.watch();
  const checkFieldsValidForActiveStep = () => {
    const hasErrors = Object.keys(fields.formState.errors).length > 0;
    const isFormValid = fields.formState.isValid;
    const requiredFieldsFilled = fieldsAtEachStep[activeStep].every(
      (field: any) => !!fields.getValues(field)
    );

    setNavigationButtonsEnabled(
      !hasErrors && isFormValid && requiredFieldsFilled
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
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={activeStep}
          custom={direction}
          variants={variants}
          initial={activeStep === 0 && direction === "left" ? false : "enter"}
          animate="center"
          exit="exit"
          transition={{ duration: transitionDuration }}
          style={{
            position: "absolute",
            marginTop,
          }}
        >
          {steps[activeStep]}
        </motion.div>
      </AnimatePresence>
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
            disabled={!navigationButtonsEnabled}
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
            disabled={!navigationButtonsEnabled}
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
