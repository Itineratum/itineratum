import colorsConst from "@/constants/pages/colors.json";

const newsletterSignupGridSpacing = 4;
const newsletterSignupHeight = "380px";
const itineraryGeneratorStep1LocationFieldsInputLabelWidth = "75%";
const destinationItemBoxSx = {
  SPACING: 2,
  BOX_SX: {
    border: `1px solid ${colorsConst.palette.primary.main}`,
    borderRadius: "8px",
    padding: "8px",
    marginBottom: "8px",
  },
};
const itineratyGeneratorStep5LeftSection = 7;

export const HOME_STYLES = {
  SECTION_WIDTH: "50%",
  PADDING_BOTTOM: "20px",
  NEWSLETTER_SIGNUP: {
    ROLL_IN_ANIMATION_DURATION: 1.2,
    GRID_SPACING: newsletterSignupGridSpacing,
    USER_INPUT_SIZE: 6,
    HEIGHT: newsletterSignupHeight,
    SPACING: 4,
    LOADING_ANIMATION_SIZE: 24,
    SIGN_UP_FORM_SX: {
      background: `linear-gradient(90deg, ${colorsConst.components.newsletterSignup.color1}, ${colorsConst.components.newsletterSignup.color2})`,
      padding: newsletterSignupGridSpacing,
      borderRadius: 6,
      color: colorsConst.palette.text.secondary,
      overflow: "hidden",
      height: newsletterSignupHeight,
      width: {
        xs: "85%",
        md: "100%",
      },
      position: "relative",
    },
  },
  ITINERARY_GENERATOR: {
    BORDER: `2px solid ${colorsConst.palette.secondary.main}`,
    BORDER_RADIUS: "16px",
    PADDING: "20px",
    MARGIN_TOP: "20px",
    SPACING: 3,
    VARIANTS: {
      enter: (direction: "left" | "right") => ({
        x: direction === "left" ? 1000 : -1000,
        opacity: 0,
      }),
      center: {
        x: 0,
        opacity: 1,
      },
      exit: (direction: "left" | "right") => ({
        x: direction === "left" ? -1000 : 1000,
        opacity: 0,
      }),
    },
    FORM_FIELDS: {
      TRANSITION_DURATION: 0.3,
      MARGIN_TOP: "10px",
    },
    NAVIGATION_BUTTONS: {
      LOADING_ANIMATION_SIZE: 24,
    },
    STEP_1: {
      SPACING: 4,
      TEXT_LABEL_MARGIN_RIGHT: 2,
      MOBILE_SPACING: 1,
      LOCATION_FIELDS: {
        INPUT_LABEL_WIDTH: itineraryGeneratorStep1LocationFieldsInputLabelWidth,
        INPUT_LABEL_PROPS: {
          style: {
            color: colorsConst.palette.text.grey,
            fontSize: "12px",
            width: itineraryGeneratorStep1LocationFieldsInputLabelWidth,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
          shrink: undefined,
        },
      },
      DESTINATION_ITEM: destinationItemBoxSx,
    },
    STEP_2: {
      SPACING: 4,
      MOBILE_SPACING: 2,
      TEXT_LABEL_MARGIN_RIGHT: 2,
      BUDGET_FIELD_WIDTH: "45%",
      TOTAL_HOTEL_ROOMS_FIELD_WIDTH: "55%",
    },
    STEP_3: {
      SPACING: 4,
      TEXT_LABEL_MARGIN_LEFT: 2,
      FOCUS_SECTION_DROPDOWN_WIDTH: "70px",
    },
    STEP_4: {
      SPACING: 4,
    },
    STEP_5: {
      DESTINATION_ITEM: {
        SPACING: 2,
        BOX_SX: destinationItemBoxSx,
      },
      LEFT_SECTION: itineratyGeneratorStep5LeftSection,
      RIGHT_SECTION: 12 - itineratyGeneratorStep5LeftSection,
      NUMBERING_RIGHT_MARGIN: 2,
      SPACING: 4,
    },
    STEP_6: {
      SPACING: 4,
    },
    GENERATION_STEPS: {
      VERTICAL_MARGIN: 2,
      SPACING: 4,
      INTERVAL_DURATION: 3000,
    },
  },
};
