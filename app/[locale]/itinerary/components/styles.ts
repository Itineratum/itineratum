const eventCardMaxWidth = 515;
const eventDetailsCardHeight = 300;

export const ITINERARY_STYLES = {
  PAGE_TRANSITION_DURATION: 500,
  SNACKBAR_AUTO_HIDE_DURATIOON: 5000,
  REVIEW_ITINERARY: {
    GAP: 6,
    PADDING_BOTTOM: "20px",
    BACK_BUTTON_SPACING: 2,
    BUDGET_SECTION_SPACING: 4,
    DAY_BUTTONS_SPACING: 4,
    ITINERARY_GENERATED_SECTION_SPACING: 2,
    EVENT_CARD: {
      ICON_SIZE: 36,
      PADDING: 2,
      BORDER_RADIUS: "30px",
      MAX_WIDTH: eventCardMaxWidth,
      MAX_HEIGHT: "230px",
      SPACING: 2,
      LEFT_AVATAR: {
        SIZE: 70,
        CIRCLE_SIZE: 24,
        MOBILE_FACTOR: 0.7,
      },
    },
    DETAILS_SECTION: {
      SPACING: 2,
      MARGIN: "16px",
      EVENT_DETAILS_CARD: {
        HEIGHT: eventDetailsCardHeight,
        WIDTH: eventDetailsCardHeight * 1.9,
        BORDER_RADIUS: "20px",
        OVERLAP_OFFSET: 0.85 * eventDetailsCardHeight,
        HOVER_ANIMATION_DURATION: "0.3s",
        OVERLAY_WIDTH: "85%",
      },
    },
    EDIT_ITINERARY_SECTION: {
      SPACING: 2,
      LOADING_ANIMATION_SIZE: 24,
    },
    MAP_SECTION: {
      HEIGHT: "700px",
      MAX_WIDTH: "100%",
      BORDER_RADIUS: "20px",
      MAP_MARKER: {
        DEFAULT_SCALE: 1,
        SELECTED_SCALE: 2,
        HOVERED_SCALE: 1.5,
        HOVERED_SELECTED_SCALE: 2.5,
      },
    },
  },
};
