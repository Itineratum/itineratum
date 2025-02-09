"use client";

import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import {
  GenerateItineraryFormData,
  UserRequestedDestination,
} from "@/constants/types/formData/generateItineraryFormData";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Stack } from "@mui/material";
import dayjs from "dayjs";
import { UseFormReturn } from "react-hook-form";

export const destinationBoxSx = {
  border: `1px solid ${colorsConst.palette.primary.main}`,
  borderRadius: "8px",
  padding: "8px",
  marginBottom: "8px",
};

const DestinationItem = ({
  index,
  destination,
  destinations,
  fields,
}: {
  index: number;
  destination: UserRequestedDestination;
  destinations: UserRequestedDestination[];
  fields: UseFormReturn<GenerateItineraryFormData, any, undefined>;
}) => {
  const userRequestedDestinations = "userRequestedDestinations";
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
    const tripStartDate =
      fields.getValues("startDate") || dayjs().startOf("day");

    if (draggedIndex === index) return;

    let updatedDestinations = [...destinations];
    const [draggedItem] = updatedDestinations.splice(draggedIndex, 1);
    updatedDestinations.splice(index, 0, draggedItem);

    // Reset dates for all destinations
    updatedDestinations = updatedDestinations.map((dest) => ({
      ...dest,
      startDate: tripStartDate,
      endDate: tripStartDate,
    }));
    fields.setValue(userRequestedDestinations, updatedDestinations);
  };

  // Delete current destination
  const deleteButton = (index: number) => {
    const handleOnClick = () => {
      const tripStartDate =
        fields.getValues("startDate") || dayjs().startOf("day");
      let updatedDestinations = destinations.filter((_, i) => i !== index);
      updatedDestinations = updatedDestinations.map((dest) => ({
        ...dest,
        startDate: tripStartDate,
        endDate: tripStartDate,
      }));
      fields.setValue(userRequestedDestinations, updatedDestinations);
      fields.trigger("startDate");
      fields.trigger("endDate");
    };

    return (
      <IconButton onClick={handleOnClick}>
        <ClearOutlinedIcon />
      </IconButton>
    );
  };

  const mobileRearrangeControls = () => {
    const upButton = () => {
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
        fields.setValue(userRequestedDestinations, updatedDestinations);
      };

      return (
        index > 0 && (
          <IconButton onClick={handleOnClick}>
            <ArrowUpwardOutlinedIcon />
          </IconButton>
        )
      );
    };

    const downButton = () => {
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
        fields.setValue(userRequestedDestinations, updatedDestinations);
      };

      return (
        index < destinations.length - 1 && (
          <IconButton onClick={handleOnClick}>
            <ArrowDownwardOutlinedIcon />
          </IconButton>
        )
      );
    };

    return (
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        {upButton()}
        {downButton()}
      </Box>
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
      <Stack direction="row" spacing={spacing} alignItems="center">
        {mobileRearrangeControls()}
        <MenuIcon
          sx={{ cursor: "move", display: { xs: "none", md: "flex" } }}
        />
        <Box
          sx={{
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          <Text
            text={destination.name}
            variant={TypographyVariant.h6}
            bold={false}
          />
        </Box>
      </Stack>
      {deleteButton(index)}
    </Box>
  );
};

export default DestinationItem;
