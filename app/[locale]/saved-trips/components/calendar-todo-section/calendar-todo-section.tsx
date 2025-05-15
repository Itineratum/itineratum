import colorsConst from "@/constants/pages/colors.json";
import { Box, Grid, Stack } from "@mui/material";
import { SAVED_TRIPS_STYLES } from "../styles";
import ItineraryCalendar from "./itinerary-calendar/itinerary-calendar";
import ToDoList from "./todo-list/todo-list";

const CalendarToDoSection = () => {
  const styles = SAVED_TRIPS_STYLES;

  return (
    <Grid
      item
      xs={12}
      md={styles.CALENDAR_TODO_SECTION_GRID}
      sx={{ my: styles.SPACING }}
    >
      <Stack direction="column" spacing={styles.SPACING}>
        <Box
          sx={{
            border: styles.CALENDAR_TODO_SECTION.BORDER,
            borderRadius: styles.CALENDAR_TODO_SECTION.BORDER_RADIUS,
            padding: styles.CALENDAR_TODO_SECTION.PADDING,
          }}
        >
          <ItineraryCalendar />
        </Box>
        <Box
          sx={{
            border: styles.CALENDAR_TODO_SECTION.BORDER,
            borderRadius: styles.CALENDAR_TODO_SECTION.BORDER_RADIUS,
            padding: styles.CALENDAR_TODO_SECTION.PADDING,
            backgroundColor: colorsConst.palette.secondary.main,
          }}
        >
          <ToDoList />
        </Box>
      </Stack>
    </Grid>
  );
};

export default CalendarToDoSection;
