import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { useStep1 } from "@/hooks/useStep1";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import { IconButton } from "@mui/material";
import dayjs from "dayjs";

export const UpButton = ({ index }: { index: number }) => {
  const { fields } = useItineraryGenerator();
  const { destinations } = useStep1();

  const handleOnClick = () => {
    if (index === 0) return; // Already at the top

    const tripStartDate =
      fields.getValues("startDate") || dayjs().startOf("day");
    let updatedDestinations = [...destinations];
    [updatedDestinations[index - 1], updatedDestinations[index]] = [
      updatedDestinations[index],
      updatedDestinations[index - 1],
    ];
    updatedDestinations = updatedDestinations.map((dest) => ({
      ...dest,
      startDate: tripStartDate,
      endDate: tripStartDate,
    }));
    fields.setValue("userRequestedDestinations", updatedDestinations);
  };

  return (
    index > 0 && (
      <IconButton onClick={handleOnClick}>
        <ArrowUpwardOutlinedIcon />
      </IconButton>
    )
  );
};

export const DownButton = ({ index }: { index: number }) => {
  const { fields } = useItineraryGenerator();
  const { destinations } = useStep1();

  const handleOnClick = () => {
    if (index === destinations.length - 1) return; // Already at the bottom

    const tripStartDate =
      fields.getValues("startDate") || dayjs().startOf("day");
    let updatedDestinations = [...destinations];
    [updatedDestinations[index + 1], updatedDestinations[index]] = [
      updatedDestinations[index],
      updatedDestinations[index + 1],
    ];
    updatedDestinations = updatedDestinations.map((dest) => ({
      ...dest,
      startDate: tripStartDate,
      endDate: tripStartDate,
    }));
    fields.setValue("userRequestedDestinations", updatedDestinations);
  };

  return (
    index < destinations.length - 1 && (
      <IconButton onClick={handleOnClick}>
        <ArrowDownwardOutlinedIcon />
      </IconButton>
    )
  );
};
