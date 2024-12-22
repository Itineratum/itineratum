import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import {
  GenerateItineraryFormData,
  UserRequestedDestination,
} from "@/constants/types/formData/generateItineraryFormData";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Stack } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";

const DestinationItem = ({
  index,
  destination,
  destinations,
  setDestinations,
  fields,
}: {
  index: number;
  destination: UserRequestedDestination;
  destinations: UserRequestedDestination[];
  setDestinations: Dispatch<SetStateAction<UserRequestedDestination[]>>;
  fields: UseFormReturn<GenerateItineraryFormData, any, undefined>;
}) => {
  const userRequestedDestinations = "userRequestedDestinations";
  const destinationBoxSx = {
    border: `1px solid ${colorsConst.palette.primary.main}`,
    borderRadius: "8px",
    padding: "8px",
    marginBottom: "8px",
  };
  const spacing: number = 2;

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const draggedIndex = parseInt(event.dataTransfer.getData("text/plain"));

    if (draggedIndex === index) return;

    const updatedDestinations = [...destinations];
    const [draggedItem] = updatedDestinations.splice(draggedIndex, 1);

    updatedDestinations.splice(index, 0, draggedItem);

    setDestinations(updatedDestinations);
    fields.setValue(userRequestedDestinations, updatedDestinations);
  };

  const deleteButton = (index: number) => {
    const handleOnClick = () => {
      const updatedDestinations = destinations.filter((_, i) => i !== index);
      setDestinations(updatedDestinations);
      fields.setValue(userRequestedDestinations, updatedDestinations);
    };

    return (
      <IconButton onClick={handleOnClick}>
        <ClearOutlinedIcon />
      </IconButton>
    );
  };

  return (
    <Box
      key={index}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={destinationBoxSx}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Stack direction="row" spacing={spacing} alignItems={"center"}>
        <MenuIcon sx={{ cursor: "move" }} />
        <Text
          text={destination.name}
          variant={TypographyVariant.h6}
          bold={false}
        />
      </Stack>
      {deleteButton(index)}
    </Box>
  );
};

export default DestinationItem;
