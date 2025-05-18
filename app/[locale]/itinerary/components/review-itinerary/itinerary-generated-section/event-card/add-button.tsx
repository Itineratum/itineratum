import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IconButton, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../../styles";

const AddButton = ({ indexToAddEventTo }: { indexToAddEventTo: number }) => {
  const { setIndexToAddEventTo, setAddEventDialogOpen } = useReviewItinerary();

  const t = useTranslations("itinerary");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.EVENT_CARD;

  const handleOnClick = () => {
    setIndexToAddEventTo(indexToAddEventTo);
    setAddEventDialogOpen(true);
  };

  return (
    <IconButton onClick={handleOnClick}>
      <Stack
        direction="row"
        spacing={styles.SPACING}
        display="flex"
        alignItems="center"
      >
        <AddCircleOutlineIcon
          sx={{
            color: colorsConst.palette.text.primary,
            height: styles.ICON_SIZE,
            width: styles.ICON_SIZE,
          }}
        />
        <Text
          text={t("addActivity")}
          variant={TypographyVariant.body1}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
      </Stack>
    </IconButton>
  );
};

export default AddButton;
