import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { Box, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { SAVED_TRIPS_STYLES } from "../../styles";
import AddButton from "./add-button";
import ToDoItems from "./todo-items";

const ToDoList = ({}: {}) => {
  const t = useTranslations("savedTrips");
  const styles = SAVED_TRIPS_STYLES.CALENDAR_TODO_SECTION.TODO_LIST;

  return (
    <Stack direction="column" spacing={styles.SPACING}>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Text
          text={t("toDo") + ":"}
          variant={TypographyVariant.h5}
          bold={true}
        />
        <AddButton />
      </Box>
      <ToDoItems />
    </Stack>
  );
};

export default ToDoList;
