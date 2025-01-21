import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import TextInputField from "@/components/molecules/text-input-field";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { CalendarEvent } from "@/constants/types/calendarEvent";
import { AddCalendarEventFormData } from "@/constants/types/formData/addCalendarEventFormData";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const AddCalendarEventDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations("savedTrips.addCalendarEventDialog");
  const { data: session } = useSession();
  const {
    control,
    formState: { errors },
    watch,
    trigger,
    reset,
  } = useForm<AddCalendarEventFormData>();

  const [isAddingCalendarEvent, setIsAddingCalendarEvent] =
    useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const spacing = 4;

  const nameId = "name";
  const startDateId = "startDate";
  const endDateId = "endDate";
  const name = watch(nameId);
  const startDate = watch(startDateId);
  const endDate = watch(endDateId);

  const addUserCalendarEvent = trpc.user.addUserCalendarEvent.useMutation();
  const utils = trpc.useUtils();

  const handleOnClose = () => {
    if (!isAddingCalendarEvent) {
      setOpen(false);
      setShowAlert(false);
      reset({
        name: "",
        startDate: null as unknown as Dayjs,
        endDate: null as unknown as Dayjs,
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

  const nameField = () => {
    const spacing = 2;

    return (
      <Stack
        direction="row"
        display="flex"
        alignItems="center"
        spacing={spacing}
      >
        <Text
          text={t("name") + ":"}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
        <TextInputField
          name={nameId}
          label={t("nameDescription")}
          control={control}
          errorMessage={t("nameError")}
          errors={errors}
          value={name}
        />
      </Stack>
    );
  };

  const startDateField = () => {
    const spacing = 2;

    return (
      <Stack
        direction="row"
        display="flex"
        alignItems="center"
        spacing={spacing}
      >
        <Text
          text={t("startDate") + ":"}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name={startDateId}
            control={control}
            rules={{
              required: t("startDateError"),
            }}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                value={startDate}
                slotProps={{
                  textField: {
                    error: !!errors.startDate,
                    helperText: errors.startDate
                      ? (errors.startDate.message as string)
                      : "",
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Stack>
    );
  };

  const endDateField = () => {
    const spacing = 2;

    return (
      <Stack
        direction="row"
        display="flex"
        alignItems="center"
        spacing={spacing}
      >
        <Text
          text={t("endDate") + ":"}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name={endDateId}
            control={control}
            rules={{
              required: t("endDateError"),
              validate: (value) =>
                !startDate || value.isAfter(startDate)
                  ? true
                  : t("endDateValidationError"),
            }}
            disabled={!startDate}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                value={endDate}
                minDateTime={startDate}
                closeOnSelect={false}
                slotProps={{
                  textField: {
                    error: !!errors.endDate,
                    helperText: errors.endDate
                      ? (errors.endDate.message as string)
                      : "",
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Stack>
    );
  };

  const addEventButton = () => {
    const loadingAnimationSize: number = 24;
    const spacing = 2;

    const handleOnClick = async () => {
      const nameValid = await trigger(nameId);
      const startDateValid = await trigger(startDateId);
      const endDateValid = await trigger(endDateId);

      if (!nameValid || !startDateValid || !endDateValid) return;

      setIsAddingCalendarEvent(true);
      const newCalendarEvent: CalendarEvent = {
        title: name,
        start: startDate.toDate(),
        end: endDate.toDate(),
        itineraryId: null,
      };

      const data = {
        email: session?.user.email!,
        calendarEvent: newCalendarEvent,
      };
      await addUserCalendarEvent.mutateAsync(data);
      setIsAddingCalendarEvent(false);
      setShowAlert(true);
      utils.user.invalidate();
    };

    return (
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleOnClick}
          sx={{ width: "auto", minWidth: "unset" }}
          disabled={isAddingCalendarEvent}
        >
          {isAddingCalendarEvent ? (
            <Stack
              direction="row"
              spacing={spacing}
              display="flex"
              alignItems="center"
            >
              <CircularProgress size={loadingAnimationSize} />
              <Text
                text={t("addingCalendarEvent")}
                variant={TypographyVariant.button}
                bold={false}
              />
            </Stack>
          ) : (
            <Text
              text={t("addCalendarEvent")}
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
          {nameField()}
          {startDateField()}
          {endDateField()}
          {addEventButton()}
          <Alert
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            alertText={t("calendarEventAdded")}
            alertType={AlertType.success}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddCalendarEventDialog;
