import colorsConst from "@/constants/pages/colors.json";
import { Box } from "@mui/material";
import { ITINERARY_STYLES } from "../../../styles";

const LeftAvatar = ({ color }: { color: string }) => {
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EVENT_CARD.LEFT_AVATAR;

  return (
    <Box sx={{ position: "relative", marginRight: 2 }}>
      <Box
        sx={{
          borderRadius: "50%",
          width: { xs: styles.SIZE * styles.MOBILE_FACTOR, md: styles.SIZE },
          height: { xs: styles.SIZE * styles.MOBILE_FACTOR, md: styles.SIZE },
          backgroundColor: colorsConst.components.eventCard.background,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: {
            xs: styles.CIRCLE_SIZE * styles.MOBILE_FACTOR,
            md: styles.CIRCLE_SIZE,
          },
          height: {
            xs: styles.CIRCLE_SIZE * styles.MOBILE_FACTOR,
            md: styles.CIRCLE_SIZE,
          },
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />
    </Box>
  );
};

export default LeftAvatar;
