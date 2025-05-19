import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useAddEvent } from "@/hooks/useAddEvent";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { IconButton, Stack, Switch, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";

const HotelEventSwitch = () => {
  const { setValue, isHotelEvent, addingActivity } = useAddEvent();

  const t = useTranslations("itinerary.addEventDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.ADD_EVENT_DIALOG;

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue("isHotelEvent", event.target.checked);
  };

  const tooltipIcon = () => {
    return (
      <Tooltip arrow title={t("hotelActivityTooltip")}>
        <IconButton>
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Stack
      direction="row"
      display="flex"
      alignItems="center"
      spacing={styles.SPACING}
    >
      <Stack direction="row" display="flex" alignItems="center">
        <Text
          text={t("isHotelActivity")}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
        {tooltipIcon()}
        <Text
          text={":"}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
      </Stack>
      <Switch
        checked={isHotelEvent}
        onChange={handleOnChange}
        disabled={addingActivity}
      />
    </Stack>
  );
};

export default HotelEventSwitch;
