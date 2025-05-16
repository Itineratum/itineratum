import colorsConst from "@/constants/pages/colors.json";
import { UserRequestedDestination } from "@/constants/types/formData/generateItineraryFormData";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { useStep1 } from "@/hooks/useStep1";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { Box, Button } from "@mui/material";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

const AddLocationButton = () => {
  const { fields } = useItineraryGenerator();
  const { currentDestination, setCurrentDestination, destinations } =
    useStep1();

  const t = useTranslations("home.itineraryGenerator.step1");

  const handleOnClick = () => {
    const tripStartDate =
      fields.getValues("startDate") || dayjs().startOf("day");

    if (currentDestination.trim() === "") return;

    const destination: UserRequestedDestination = {
      name: currentDestination,
      startDate: tripStartDate,
      endDate: tripStartDate,
    };
    var updatedDestinations = [...destinations, destination];

    // reset the startDate and endDate for all destinations
    updatedDestinations = updatedDestinations.map((destination) => ({
      ...destination,
      startDate: tripStartDate,
      endDate: tripStartDate,
    }));

    fields.setValue("userRequestedDestinations", updatedDestinations, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setCurrentDestination("");
    fields.trigger("startDate");
    fields.trigger("endDate");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
      <Button
        variant="text"
        startIcon={<AddCircleOutlineOutlinedIcon />}
        sx={{ color: colorsConst.palette.text.primary }}
        onClick={handleOnClick}
        disabled={currentDestination === ""}
      >
        {t("addLocation")}
      </Button>
    </Box>
  );
};

export default AddLocationButton;
