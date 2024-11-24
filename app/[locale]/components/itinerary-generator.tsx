"use client";

import colorsConst from "@/constants/pages/colors.json";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { Box, Button, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

const ItineraryGenerator = () => {
  const t = useTranslations("home.itineraryGenerator");
  const fields = useForm<GenerateItineraryFormData>();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [direction, setDirection] = useState<"left" | "right">("left");

  const numOfSteps: number = 3;
  const border: string = `2px solid ${colorsConst.palette.secondary.main}`;
  const borderRadius: string = "16px";
  const padding: string = "20px";
  const marginTop: string = "20px";

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

  const formFields = () => {
    const transitionDuration: number = 0.3;

    const steps = [
      <Container key={0}>STEP 1</Container>,
      <Container key={1}>STEP 2</Container>,
      <Container key={2}>STEP 3</Container>,
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
            width: "100%",
            position: "absolute",
            height: "100%",
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
    <Container>
      <FormProvider {...fields}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "auto",
            overflow: "hidden",
            border,
            borderRadius,
            padding,
          }}
        >
          {formFields()}
          {navigationButtons()}
        </Box>
      </FormProvider>
    </Container>
  );
};

export default ItineraryGenerator;
