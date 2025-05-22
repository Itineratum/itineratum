import { useSavedTrips } from "@/hooks/useSavedTrips";
import { getItinerarySummaryText } from "@/lib/pythonBackend/utils";
import { Box, Select, SelectChangeEvent } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const ItinerarySelectorDropdown = () => {
  const { savedItineraries, selectedItineraryId, setSelectedItineraryId } =
    useSavedTrips();

  const handleOnChange = (event: SelectChangeEvent) => {
    setSelectedItineraryId(event.target.value);
  };

  return (
    savedItineraries &&
    savedItineraries.length > 0 && (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Select
          displayEmpty
          value={selectedItineraryId || ""}
          onChange={handleOnChange}
          sx={{ backgroundColor: "white", width: "90%" }}
        >
          {savedItineraries.map((record, _) => {
            const itineraryId = Object.keys(record)[0];
            const itinerary = record[itineraryId];

            return (
              <MenuItem value={itineraryId}>
                {getItinerarySummaryText(itinerary)}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
    )
  );
};

export default ItinerarySelectorDropdown;
