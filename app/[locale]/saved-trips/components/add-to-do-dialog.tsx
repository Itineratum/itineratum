import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import TextInputField from "@/components/molecules/text-input-field";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { AddToDoFormData } from "@/constants/types/formData/addToDoFormData";
import { ToDo } from "@/constants/types/toDo";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";

const AddToDoDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations("savedTrips.addToDoDialog");
  const { data: session } = useSession();
  const {
    control,
    formState: { errors },
    watch,
    trigger,
    reset,
  } = useForm<AddToDoFormData>();

  const [isAddingToDo, setIsAddingToDo] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const spacing = 4;

  const nameId = "name";
  const name = watch(nameId);

  const addToUserToDoList = trpc.user.addToUserToDoList.useMutation();
  const utils = trpc.useUtils();

  const handleOnClose = () => {
    if (!isAddingToDo) {
      setOpen(false);
      setShowAlert(false);
      reset({
        name: "",
      });
    }
  };

  const title = () => {
    return (
      <DialogTitle>
        <Text text={t("title")} variant={TypographyVariant.h4} bold={false} />
      </DialogTitle>
    );
  };

  const description = () => {
    return (
      <DialogContentText>
        <Text
          text={t("description")}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
      </DialogContentText>
    );
  };

  const toDoField = () => {
    const spacing = 2;

    return (
      <Stack
        direction="row"
        display="flex"
        alignItems="center"
        spacing={spacing}
      >
        <Text
          text={t("toDo") + ":"}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
        <TextInputField
          name={nameId}
          label={t("toDoDescription")}
          control={control}
          errorMessage={t("toDoError")}
          errors={errors}
          value={name}
        />
      </Stack>
    );
  };

  const addToDoButton = () => {
    const loadingAnimationSize: number = 24;
    const spacing = 2;

    const handleOnClick = async () => {
      const toDoValid = await trigger(nameId);

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
              spacing={spacing}
              display="flex"
              alignItems="center"
            >
              <CircularProgress size={loadingAnimationSize} />
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

  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
      fullScreen={false}
      fullWidth={true}
    >
      {title()}
      <DialogContent>
        <Stack direction="column" spacing={spacing}>
          {description()}
          {toDoField()}
          {addToDoButton()}
          <Alert
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            alertText={t("toDoAdded")}
            alertType={AlertType.success}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddToDoDialog;
