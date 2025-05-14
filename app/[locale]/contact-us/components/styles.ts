const borderRadius = "8px";
const border = "1px solid grey";
const margin = 5;

export const CONTACT_US_STYLES = {
  MARGIN: margin,
  SECTION_SPACING: 5,
  BORDER_RADIUS: borderRadius,
  BORDER: border,
  ICON_BOX_STYLE: {
    borderRadius,
    padding: "10px",
    display: "flex",
    border,
    width: "fit-content",
  },
  CARD_SX: {
    display: "flex",
    width: { xs: "auto", md: "50%" },
    height: { xs: "auto", md: "35vh" },
    border,
    borderRadius,
  },
  CARD_CONTENT_SX: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    whiteSpace: "normal",
    wordBreak: "break-word",
    gap: margin,
  },
  HEADING_MARGIN_BOTTOM: 4,
  FEEDBACK_FORM: {
    SPACING: 4,
    FIELD_SPACING: 2,
    FILE_INPUT_SX: {
      border: "2px dashed gray",
      padding: "20px",
      textAlign: "center",
      cursor: "pointer",
    },
    SUBMIT_BUTTON: {
      LOADING_ANIMATION_SIZE: 24,
      SPACING: 2,
    },
  },
};
