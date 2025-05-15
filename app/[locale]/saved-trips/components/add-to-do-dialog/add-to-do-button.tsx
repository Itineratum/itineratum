import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useAddToDo } from "@/hooks/useAddToDo";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { SAVED_TRIPS_STYLES } from "../styles";

const AddToDoButton = () => {
  const {
    trigger,
    name,
    session,
    isAddingToDo,
    setIsAddingToDo,
    setShowAlert,
    utils,
    addToUserToDoList,
  } = useAddToDo();

  const t = useTranslations("savedTrips.addToDoDialog");
  const styles = SAVED_TRIPS_STYLES.ADD_TO_DO_DIALOG;

  const handleOnClick = async () => {
    const toDoValid = await trigger("name");

    if (!toDoValid) return;

    setIsAddingToDo(true);
    const newToDo = {
      name: name,
      isComplete: false,
    };
    const data = {
      email: session?.user.email!,
      toDo: newToDo,
    };
    await addToUserToDoList.mutateAsync(data);
    setIsAddingToDo(false);
    setShowAlert(true);
    utils.user.invalidate();
  };

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        variant="contained"
        onClick={handleOnClick}
        sx={{ width: "auto", minWidth: "unset" }}
        disabled={isAddingToDo}
      >
        {isAddingToDo ? (
          <Stack
            direction="row"
            spacing={styles.FIELD_SPACING}
            display="flex"
            alignItems="center"
          >
            <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
            <Text
              text={t("addingToDo")}
              variant={TypographyVariant.button}
              bold={false}
            />
          </Stack>
        ) : (
          <Text
            text={t("addToDo")}
            variant={TypographyVariant.button}
            bold={false}
          />
        )}
      </Button>
    </Box>
  );
};

export default AddToDoButton;
