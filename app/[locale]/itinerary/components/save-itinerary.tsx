import Text from "@/components/atoms/text";
import { ItineraryPageStep } from "@/constants/enums/itineraryPageStep";
import { TypographyVariant } from "@/constants/enums/theme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Container, IconButton, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

const SaveItinerary = ({
  setItineraryPageStep,
}: {
  setItineraryPageStep: Dispatch<SetStateAction<ItineraryPageStep>>;
}) => {
  const t = useTranslations("itinerary");

  const spacing = 4;

  const backButton = () => {
    const handleOnClick = () => {
      setItineraryPageStep(ItineraryPageStep.reviewItinerary);
    };

    return (
      <IconButton onClick={handleOnClick} color="inherit">
        <ArrowBackIcon />
      </IconButton>
    );
  };

  const instructions = () => {
    return (
      <Text
        text={t("saveItineraryInstructions") + ":"}
        variant={TypographyVariant.h5}
        bold={true}
      />
    );
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "fit-content",
      }}
    >
      <Stack direction="column" spacing={spacing} alignItems="flex-start">
        {backButton()}
        {instructions()}
      </Stack>
    </Container>
  );
};

export default SaveItinerary;
