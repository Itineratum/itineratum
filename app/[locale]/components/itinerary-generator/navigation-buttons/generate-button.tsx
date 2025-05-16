import { Currency } from "@/constants/enums/currency";
import endpointsConst from "@/constants/pages/endpoints.json";
import { GenerateItineraryFormData } from "@/constants/types/formData/generateItineraryFormData";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import {
  generateItineraryJson,
  runPipelineWithGenerationSteps,
} from "@/lib/pythonBackend/pythonBackend";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { getCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import router from "next/router";
import { HOME_STYLES } from "../../styles";
import { steps } from "../form-fields/form-fields";

const GenerateButton = () => {
  const {
    setGeneratingItinerary,
    setShowAlert,
    setAlertText,
    saveItinerary,
    fields,
    activeStep,
    generatingItinerary,
    session,
    setGenerationStep,
  } = useItineraryGenerator();

  const t = useTranslations("home.itineraryGenerator");
  const styles = HOME_STYLES.ITINERARY_GENERATOR.NAVIGATION_BUTTONS;

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
        currency: (getCookie("currency") as keyof typeof Currency) ?? "SGD",
      };
      const itineraryJson = generateItineraryJson(itineraryForm);

      // const itinerary = await runPipeline(itineraryJson);
      // backup
      // const itinerary = backupRunPipelineResponseJson;

      const runPipelineRes = await runPipelineWithGenerationSteps(
        itineraryJson,
        setGenerationStep
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
            <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
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

export default GenerateButton;
