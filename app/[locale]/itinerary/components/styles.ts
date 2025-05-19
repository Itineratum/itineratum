import { TypographyVariant } from "@/constants/enums/theme";

const eventCardMaxWidth = 515;
const eventDetailsCardHeight = 300;
const amenitiesGrid = 4;
const eventDetailsDialogWidth = 1087;

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
    ADJUST_BUDGET_DIALOG: {
      TEXT_LABEL_MARGIN_RIGHT: 2,
      SPACING: 4,
      WIDTH: "300px",
      ADJUST_BUDGET_BUTTON: {
        WIDTH: "200px",
        LOADING_ANIMATION_SIZE: 24,
        SPACING: 2,
      },
    },
    HOTEL_SELECTOR_DIALOG: {
      RATING_SPACING: 2,
      SPACING: 4,
      MOBILE_SPACING: 4,
      TITLE_HOTEL_TABS_SPACING: 2,
      HOTEL_TABS_MAX_WIDTH: "1100px",
      HOTEL_CONTENT: {
        SPACING: 4,
        IMAGE_CAROUSEL: {
          MOBILE_HEIGHT: "25vh",
          HEIGHT: "450px",
        },
        RATE_CLASS_TYPE: {
          SPACING: 1,
          TYPOGRAPHY_VARIANT: TypographyVariant.body1,
          JUSTIFY_CONTENT: "center",
          VALUE_SPACING: 2,
        },
        RATING_NUM_REVIEWS_LOCATION_RATING: {
          SPACING: 1,
          TYPOGRAPHY_VARIANT: TypographyVariant.body1,
          JUSTIFY_CONTENT: "center",
        },
        CHECK_IN_CHECK_OUT_TIMES_WEBSITE: {
          SPACING: 1,
          TYPOGRAPHY_VARIANT: TypographyVariant.body1,
          JUSTIFY_CONTENT: "center",
        },
        AMENITIES_LOCATION: {
          SPACING: 1,
          TYPOGRAPHY_VARIANT: TypographyVariant.body1,
          JUSTIFY_CONTENT: "center",
          AMENITIES_GRID: amenitiesGrid,
          LOCATION_GRID: 12 - amenitiesGrid,
          VALUES_SPACING: 2,
          MAP: {
            HEIGHT: "400px",
            WIDTH: "700px",
            BORDER_RADIUS: "20px",
          },
        },
      },
      LOADING_ANIMATION_SIZE: 24,
    },
    EVENT_DETAILS_DIALOG: {
      HEIGHT: 442,
      WIDTH: eventDetailsDialogWidth,
      CONTENT_MAX_WIDTH: eventDetailsDialogWidth - 80,
      SPACING: 2,
      PADDING: 2,
      TYPOGRAPHY_VARIANT: TypographyVariant.body1,
    },
    ADD_EVENT_DIALOG: {
      SPACING: 4,
      FIELD_SPACING: 2,
      LOADING_ANIMATION_SIZE: 24,
    },
    MODIFY_EVENT_DIALOG: {
      SPACING: 4,
      FIELD_SPACING: 2,
      LOADING_ANIMATION_SIZE: 24,
    },
  },
};
