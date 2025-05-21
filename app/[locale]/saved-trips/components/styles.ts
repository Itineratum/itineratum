import colorsConst from "@/constants/pages/colors.json";

const itinerariesSectionGrid = 5;

export const SAVED_TRIPS_STYLES = {
  MARGIN: 5,
  SPACING: 2,
  ITINERARIES_SECTION_GRID: itinerariesSectionGrid,
  CALENDAR_TODO_SECTION_GRID: 12 - itinerariesSectionGrid,
  ADD_CALENDAR_EVENT_DIALOG: {
    SPACING: 4,
    FIELD_SPACING: 2,
    LOADING_ANIMATION_SIZE: 24,
  },
  ADD_TO_DO_DIALOG: {
    SPACING: 4,
    FIELD_SPACING: 2,
    LOADING_ANIMATION_SIZE: 24,
  },
  ITINERARIES_SECTION: {
    BORDER: `2px solid ${colorsConst.palette.secondary.main}`,
    BORDER_RADIUS: "20px",
    MARGIN: "16px",
    SPACING: 2,
    PADDING: 2,
    LOADING_ANIMATION_SIZE: 24,
    ITINERARY_CARD: {
      HEIGHT: 230,
      WIDTH: 420,
      WIDTH_MOBILE: "80vw",
      OVERLAP_OFFSET: 200,
      BORRDER_RADIUS: "20px",
      HOVER_ANIMATION_DURATION: "0.3s",
      HOVER_SX: {
        transform: "scale(1.1)",
      },
      OVERLAY_WIDTH: "85%",
    },
  },
  CALENDAR_TODO_SECTION: {
    BORDER: "2px solid black",
    BORDER_RADIUS: "20px",
    PADDING: "24px",
    TODO_LIST: {
      SPACING: 2,
      MAX_HEIGHT: "592px",
      LOADING_ANIMATION_SIZE: 24,
    },
    ITINERARY_CALENDAR: {
      SPACING: 2,
      HEIGHT: "600px",
      USER_CALENDAR_EVENT_DIALOG: {
        SPACING: 2,
        LOADING_ANIMATION_SIZE: 24,
      },
    },
  },
  EXPENSES_PIE_CHART_SECTION: {
    PIE_CHART_SIZE: 300,
    PIE_CHART_PADDING: 200
  }
};
