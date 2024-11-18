"use client";

import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import { Box, Button, Container, Slide, TextField, Stack, IconButton } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import colorsConst from "@/constants/pages/colors.json";
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

const Base = () => {
  const fields = useForm<GenerateItineraryFormData>();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [showSlide, setShowSlide] = useState<boolean>(true);

  const numOfSteps = 3;
  const pageTransitionDuration: number = 500;

  const formFields = () => {
    const border: string = `2px solid ${colorsConst.palette.secondary.main}`;
    const borderRadius: string = "16px";
    const padding: string = "20px";

    const handleSubmit = fields.handleSubmit((data) => {
      console.log("Form data submitted:", data);
    });

    const step1 = () => {
      return (
        activeStep === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Stack spacing={3} direction="row" alignItems="center">
              <TextField
                {...fields.register("from")}
                label="From:"
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
              <TextField
                {...fields.register("destination")}
                label="Destination:"
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
              <Button startIcon={<AddLocationIcon />}>Add Location</Button>
            </Stack>
          </Box>
        )
      );
    };

    const step2 = () => {
      return (
        activeStep === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Stack spacing={3} direction="row" alignItems="center">
              <TextField
                {...fields.register("dateFrom")}
                label="From:"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <IconButton>
                      <CalendarMonthIcon />
                    </IconButton>
                  ),
                }}
              />
              <TextField
                {...fields.register("dateTo")}
                label="To:"
                variant="outlined"
              />
            </Stack>
          </Box>
        )
      );
    };

    const step3 = () => {
      return (
        activeStep === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div>Review your data before submission:</div>
            <pre>{JSON.stringify(fields.getValues(), null, 2)}</pre>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Box>
        )
      );
    };

    return (
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          height: "auto",
          minHeight: "30vh",
          border,
          borderRadius,
          padding,
        }}
      >
        <Slide
          in={showSlide}
          direction={direction}
          timeout={pageTransitionDuration}
          mountOnEnter
          unmountOnExit
          key={activeStep}
        >
          <form onSubmit={handleSubmit}>
            {step1()}
            {step2()}
            {step3()}
          </form>
        </Slide>
      </Box>
    );
  };

  const navigationButtons = () => {
    const previousButton = () => {
      const handleOnClick = () => {
        setShowSlide(false);
        setDirection("right");
        setTimeout(() => {
          setActiveStep((prevStep) => prevStep - 1);
          setShowSlide(true);
        }, pageTransitionDuration);
      };

      return (
        activeStep > 0 && (
          <Button onClick={handleOnClick} variant="contained" color="primary" startIcon={<ArrowBackOutlinedIcon />}>
            Previous
          </Button>
        )
      );
    };

    const nextButton = () => {
      const handleOnClick = () => {
        setShowSlide(false);
        setDirection("left");
        setTimeout(() => {
          setActiveStep((prevStep) => prevStep + 1);
          setShowSlide(true);
        }, pageTransitionDuration);
      };

      return (
        activeStep < numOfSteps - 1 && (
          <Button onClick={handleOnClick} variant="contained" color="primary" endIcon={<ArrowForwardOutlinedIcon />}>
            Next
          </Button>
        )
      );
    };

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        {previousButton()}
        {nextButton()}
      </Box>
    );
  };

  return (
    <Container>
      <FormProvider {...fields}>
        {formFields()}
        {navigationButtons()}
      </FormProvider>
    </Container>
  );
};

export default Base;
