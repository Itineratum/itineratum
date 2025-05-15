import Text from "@/components/atoms/text";
import TextInputField from "@/components/molecules/text-input-field";
import { TypographyVariant } from "@/constants/enums/theme";
import { useUserCalendarEvent } from "@/hooks/useUserCalendarEvent";
import { DialogTitle, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { SAVED_TRIPS_STYLES } from "../../../styles";

const Title = () => {
  const { previousCalendarEvent, control, errors, modifyMode, name } =
    useUserCalendarEvent();

  const t = useTranslations("savedTrips.userCalendarEventDialog");
  const styles =
    SAVED_TRIPS_STYLES.CALENDAR_TODO_SECTION.ITINERARY_CALENDAR
      .USER_CALENDAR_EVENT_DIALOG;

  if (modifyMode)
    return (
      <DialogTitle>
        <Stack direction="row" spacing={styles.SPACING} alignItems="center">
          <Text
            text={t("name") + ":"}
            variant={TypographyVariant.h6}
            bold={true}
          />
          {modifyMode ? (
            // text input field
            <TextInputField
              name={"name"}
              label={t("nameDescription")}
              control={control}
              errorMessage={t("nameError")}
              errors={errors}
              value={name}
            />
          ) : (
            // value display
            <Text
              text={previousCalendarEvent.title}
              variant={TypographyVariant.h6}
              bold={false}
            />
          )}
        </Stack>
      </DialogTitle>
    );

  return <DialogTitle>{previousCalendarEvent.title}</DialogTitle>;
};

export default Title;
