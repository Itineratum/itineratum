import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

const DayButton = ({
  dayNum,
  setDayNum,
  selected,
  disabled,
}: {
  dayNum: number;
  setDayNum: Dispatch<SetStateAction<number>>;
  selected: boolean;
  disabled: boolean;
}) => {
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
      disabled={disabled}
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
