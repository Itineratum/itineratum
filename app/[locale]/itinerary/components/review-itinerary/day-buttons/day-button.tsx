import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useReviewItinerary } from "@/hooks/useReviewItinerary";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

const DayButton = ({
  selected,
  dayNum,
}: {
  selected: boolean;
  dayNum: number;
}) => {
  const { setDayNum, isEditing } = useReviewItinerary();

  const t = useTranslations("itinerary");

  const color = selected
    ? colorsConst.palette.secondary.main
    : colorsConst.palette.text.grey;
  const width = 140;
  const mobileFactor = 0.7;

  const handleOnClick = () => {
    setDayNum(dayNum);
  };

  return (
    <Button
      onClick={handleOnClick}
      variant="outlined"
      sx={{
        borderRadius: "20px",
        borderColor: color,
        whiteSpace: "nowrap",
        minWidth: { xs: mobileFactor * width, md: width },
        maxWidth: { xs: mobileFactor * width, md: width },
      }}
      disabled={isEditing}
    >
      <Text
        text={`${t("dayCap")} ${dayNum}`}
        variant={TypographyVariant.h6}
        bold={false}
        color={color}
      />
    </Button>
  );
};

export default DayButton;
