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
  DialogTitle,
  Stack,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const UserCalendarEventDialog = ({
  open,
  setOpen,
  calendarEvent,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  calendarEvent: CalendarEvent;
}) => {
  const t = useTranslations("savedTrips.userCalendarEventDialog");
  const {
    control,
    formState: { errors },
    watch,
    trigger,
    reset,
  } = useForm<AddCalendarEventFormData>({
    defaultValues: {
      name: calendarEvent.title,
      startDate: dayjs(calendarEvent.start),
      endDate: dayjs(calendarEvent.end),
    },
  });
  const { data: session } = useSession();

  const [modifyMode, setModifyMode] = useState<boolean>(false);
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [previousCalendarEvent, setPreviousCalendarEvent] =
    useState<CalendarEvent>(calendarEvent);
  const [hasModifications, setHasModifications] = useState<boolean>(false);

  const spacing = 2;
  const loadingAnimationSize = 24;

  const nameId = "name";
  const startDateId = "startDate";
  const endDateId = "endDate";
  const name = watch(nameId);
  const startDate = watch(startDateId);
  const endDate = watch(endDateId);

  const modifyUserCalendarEvent =
    trpc.user.modifyUserCalendarEvent.useMutation();
  const deleteUserCalendarEvent =
    trpc.user.deleteUserCalendarEvent.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    setHasModifications(
      name !== previousCalendarEvent.title ||
        !startDate.isSame(dayjs(previousCalendarEvent.start)) ||
        !endDate.isSame(dayjs(previousCalendarEvent.end)),
    );
  }, [name, startDate, endDate]);

  const handleOnClose = () => {
    setOpen(false);
    setHasModifications(false);
    setModifyMode(false);
    setShowAlert(false);
    reset({
      name: "",
      startDate: null as unknown as Dayjs,
      endDate: null as unknown as Dayjs,
    });
  };

  const title = () => {
    const valueDisplay = () => {
      return (
        <Text
          text={previousCalendarEvent.title}
          variant={TypographyVariant.h6}
          bold={false}
        />
      );
    };

    const textInputField = () => {
      return (
        <TextInputField
          name={nameId}
          label={t("nameDescription")}
          control={control}
          errorMessage={t("nameError")}
          errors={errors}
          value={name}
        />
      );
    };

    if (modifyMode)
      return (
        <DialogTitle>
          <Stack direction="row" spacing={spacing} alignItems="center">
            <Text
              text={t("name") + ":"}
              variant={TypographyVariant.h6}
              bold={true}
            />
            {modifyMode ? textInputField() : valueDisplay()}
          </Stack>
        </DialogTitle>
      );

    return <DialogTitle>{previousCalendarEvent.title}</DialogTitle>;
  };

  const startDateField = () => {
    const valueDisplay = () => {
      return (
        <Text
          text={dayjs(previousCalendarEvent.start).format(
            "dddd, D MMMM YYYY, h:mm A",
          )}
          variant={TypographyVariant.h6}
          bold={false}
        />
      );
    };

    const dateInputField = () => {
      return (
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
      );
    };

    return (
      <Stack direction="row" spacing={spacing} alignItems="center">
        <Text
          text={t("startDate") + ":"}
          variant={TypographyVariant.h6}
          bold={true}
        />
        {modifyMode ? dateInputField() : valueDisplay()}
      </Stack>
    );
  };

  const endDateField = () => {
    const valueDisplay = () => {
      return (
        <Text
          text={dayjs(previousCalendarEvent.end).format(
            "dddd, D MMMM YYYY, h:mm A",
          )}
          variant={TypographyVariant.h6}
          bold={false}
        />
      );
    };

    const dateInputField = () => {
      return (
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
      );
    };

    return (
      <Stack direction="row" spacing={spacing} alignItems="center">
        <Text
          text={t("endDate") + ":"}
          variant={TypographyVariant.h6}
          bold={true}
        />
        {modifyMode ? dateInputField() : valueDisplay()}
      </Stack>
    );
  };

  const modifyButton = () => {
    const handleOnClick = async () => {
      setShowAlert(false);

      // if it is in modify mode, validate the fields and then update the MongoDB if necessary
      if (modifyMode) {
        if (!hasModifications) {
          setModifyMode(false);
          return;
        }

        const nameValid = await trigger(nameId);
        const startDateValid = await trigger(startDateId);
        const endDateValid = await trigger(endDateId);

        if (!nameValid || !startDateValid || !endDateValid) return;

        setIsModifying(true);
        const modifiedCalendarEvent: CalendarEvent = {
          title: name,
          start: startDate.toDate(),
          end: endDate.toDate(),
          itineraryId: null,
          _id: calendarEvent._id,
        };
        setPreviousCalendarEvent(modifiedCalendarEvent);
        const data = {
          email: session?.user.email!,
          modifiedCalendarEvent,
        };
        await modifyUserCalendarEvent.mutateAsync(data);
        setIsModifying(false);
        setModifyMode(false);
        setHasModifications(false);
        setShowAlert(true);
        utils.user.invalidate();
      } else {
        setModifyMode(true);
      }
    };

    return (
      !isDeleting && (
        <Button
          variant="contained"
          onClick={handleOnClick}
          sx={{ width: "auto", minWidth: "unset" }}
          disabled={isModifying}
        >
          {isModifying ? (
            <Stack
              direction="row"
              spacing={spacing}
              display="flex"
              alignItems="center"
            >
              <CircularProgress size={loadingAnimationSize} />
              <Text
                text={t("modifying")}
                variant={TypographyVariant.button}
                bold={false}
              />
            </Stack>
          ) : (
            <Text
              text={
                modifyMode
                  ? hasModifications
                    ? t("save")
                    : t("stop")
                  : t("modify")
              }
              variant={TypographyVariant.button}
              bold={false}
            />
          )}
        </Button>
      )
    );
  };

  const deleteButton = () => {
    const handleOnClick = async () => {
      setIsDeleting(true);
      const data = {
        email: session?.user.email!,
        calendarEventId: calendarEvent._id,
      };
      await deleteUserCalendarEvent.mutateAsync(data);
      utils.user.invalidate();
      setIsDeleting(false);
      setOpen(false);
    };

    return (
      !modifyMode &&
      !isModifying && (
        <Button
          variant="contained"
          onClick={handleOnClick}
          sx={{
            width: "auto",
            minWidth: "unset",
            backgroundColor: colorsConst.components.button.deleteColor,
          }}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Stack
              direction="row"
              spacing={spacing}
              display="flex"
              alignItems="center"
            >
              <CircularProgress size={loadingAnimationSize} />
              <Text
                text={t("deleting")}
                variant={TypographyVariant.button}
                bold={false}
              />
            </Stack>
          ) : (
            <Text
              text={t("delete")}
              variant={TypographyVariant.button}
              bold={false}
            />
          )}
        </Button>
      )
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
          {startDateField()}
          {endDateField()}
          <Box display="flex" justifyContent="flex-end">
            <Stack direction="row" spacing={spacing}>
              {modifyButton()}
              {deleteButton()}
            </Stack>
          </Box>
          <Alert
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            alertText={t("calendarEventModified")}
            alertType={AlertType.success}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default UserCalendarEventDialog;
