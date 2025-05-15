import Text from "@/components/atoms/text";
import TextInputField from "@/components/molecules/text-input-field";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { useAddToDo } from "@/hooks/useAddToDo";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { SAVED_TRIPS_STYLES } from "../styles";

const ToDoField = () => {
  const { control, errors, name } = useAddToDo();

  const t = useTranslations("savedTrips.addToDoDialog");
  const styles = SAVED_TRIPS_STYLES.ADD_TO_DO_DIALOG;

  return (
    <Stack
      direction="row"
      display="flex"
      alignItems="center"
      spacing={styles.FIELD_SPACING}
    >
      <Text
        text={t("toDo") + ":"}
        variant={TypographyVariant.h6}
        bold={false}
        color={colorsConst.palette.text.primary}
      />
      <TextInputField
        name={"name"}
        label={t("toDoDescription")}
        control={control}
        errorMessage={t("toDoError")}
        errors={errors}
        value={name}
      />
    </Stack>
  );
};

export default ToDoField;
