"use client";

import { HOME_STYLES } from "@/app/[locale]/components/styles";
import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { UserRequestedDestination } from "@/constants/types/formData/generateItineraryFormData";
import { useItineraryGenerator } from "@/hooks/useItineraryGenerator";
import { useStep1 } from "@/hooks/useStep1";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Stack } from "@mui/material";
import dayjs from "dayjs";
import DeleteButton from "./delete-button";
import { DownButton, UpButton } from "./mobile-rearrange-controls";

const DestinationItem = ({
  index,
  destination,
}: {
  index: number;
  destination: UserRequestedDestination;
}) => {
  const { fields } = useItineraryGenerator();
  const { destinations } = useStep1();

  const styles = HOME_STYLES.ITINERARY_GENERATOR.STEP_1.DESTINATION_ITEM;

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
    fields.setValue("userRequestedDestinations", updatedDestinations);
  };

  return (
    <Box
      key={index}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={styles.BOX_SX}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Stack direction="row" spacing={styles.SPACING} alignItems="center">
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <UpButton index={index} />
          <DownButton index={index} />
        </Box>
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
      <DeleteButton index={index} />
    </Box>
  );
};

export default DestinationItem;
