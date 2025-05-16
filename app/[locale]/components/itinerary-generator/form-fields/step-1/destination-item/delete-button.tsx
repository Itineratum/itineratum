import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { useStep1 } from "@/hooks/useStep1";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { IconButton } from "@mui/material";
import dayjs from "dayjs";

const DeleteButton = ({ index }: { index: number }) => {
  const { fields } = useItineraryGenerator();
  const { destinations } = useStep1();

  const handleOnClick = () => {
    const tripStartDate =
      fields.getValues("startDate") || dayjs().startOf("day");
    let updatedDestinations = destinations.filter((_, i) => i !== index);
    updatedDestinations = updatedDestinations.map((dest) => ({
      ...dest,
      startDate: tripStartDate,
      endDate: tripStartDate,
    }));
    fields.setValue("userRequestedDestinations", updatedDestinations);
    fields.trigger("startDate");
    fields.trigger("endDate");
  };

  return (
    <IconButton onClick={handleOnClick}>
      <ClearOutlinedIcon />
    </IconButton>
  );
};

export default DeleteButton;
