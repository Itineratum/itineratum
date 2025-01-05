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
}: {
  dayNum: number;
  setDayNum: Dispatch<SetStateAction<number>>;
  selected: boolean;
}) => {
  const t = useTranslations("itinerary");

  const color = selected
    ? colorsConst.palette.secondary.main
    : colorsConst.palette.text.grey;
  const width: string = "140px";

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
        minWidth: width,
        maxWidth: width,
      }}
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
