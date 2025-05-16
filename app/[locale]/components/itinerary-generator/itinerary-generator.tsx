"use client";

import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { Box, Stack } from "@mui/material";
import { FormProvider } from "react-hook-form";
import { HOME_STYLES } from "../styles";
import { FormFields } from "./form-fields/form-fields";
import ItineraryGenerationSteps from "./itinerary-generation-steps/itinerary-generation-steps";
import NavigationButtons from "./navigation-buttons/navigation-buttons";

const ItineraryGenerator = () => {
  const { fields, showAlert, setShowAlert, alertText, generatingItinerary } =
    useItineraryGenerator();

  const styles = HOME_STYLES.ITINERARY_GENERATOR;

  return (
    <FormProvider {...fields}>
      <Stack
        direction="column"
        spacing={styles.SPACING}
        sx={{
          position: "relative",
          height: "auto",
          width: { xs: "85%", md: "100%" },
          overflow: "hidden",
          border: styles.BORDER,
          borderRadius: styles.BORDER_RADIUS,
          padding: styles.PADDING,
          mt: { xs: 15, md: 0 },
        }}
      >
        <FormFields />
        <Alert
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          alertText={alertText}
          alertType={AlertType.error}
        />
        <NavigationButtons />
        <Box>{generatingItinerary && <ItineraryGenerationSteps />}</Box>
      </Stack>
    </FormProvider>
  );
};

export default ItineraryGenerator;
