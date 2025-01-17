import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import TextInputField from "@/components/molecules/text-input-field";
import {
  AddEventToItineraryDetails,
  ItineraryEditAction,
  ItineraryEditDetails,
} from "@/components/templates/itinerary-page";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { AddNewEventFormData } from "@/constants/types/formData/addNewEventFormData";
import {
  generateSearchActivityJson,
  generateValidateNewJson,
  searchActivity,
  validateNew,
} from "@/lib/pythonBackend/pythonBackend";
import {
  DayPlan,
  Event,
  EventTimeOfDay,
  GenerateItineraryJSON,
} from "@/lib/pythonBackend/types";
import {
  getEvents,
  getTimesOfDayAfter,
  getTimesOfDayBefore,
  getTimesOfDayBetween,
} from "@/lib/pythonBackend/utils";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Tooltip,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const AddEventDialog = ({
  open,
  setOpen,
  itineraryRequest,
  events,
  indexToAddEventTo,
  dayPlan,
  setCurrentEdit,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  itineraryRequest: GenerateItineraryJSON;
  events: Event[];
  indexToAddEventTo: number;
  dayPlan: DayPlan;
  setCurrentEdit: Dispatch<
    SetStateAction<Partial<
      Record<ItineraryEditAction, ItineraryEditDetails>
    > | null>
  >;
}) => {
  const t = useTranslations("itinerary.addEventDialog");
  const {
    control,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<AddNewEventFormData>({
    defaultValues: {
      isHotelEvent: false,
    },
  });

  const [addingActivity, setAddingActivity] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);

  const spacing = 4;

  const isHotelEventId = "isHotelEvent";
  const locationNameId = "locationName";
  const locationCityId = "locationCity";
  const timeOfDayId = "timeOfDay";
  const checkInTimeId = "checkInTime";
  const checkOutTimeId = "checkOutTime";
  const isHotelEvent = watch(isHotelEventId);
  const locationName = watch(locationNameId);
  const locationCity = watch(locationCityId);
  const timeOfDay = watch(timeOfDayId);
  const checkInTime = watch(checkInTimeId);
  const checkOutTime = watch(checkOutTimeId);

  const handleOnClose = () => {
    if (!addingActivity) {
      setShowAlert(false);
      setOpen(false);
      reset({
        isHotelEvent: false,
        locationName: "",
        locationCity: "",
        timeOfDay: null as unknown as EventTimeOfDay,
      });
    }
  };

  const title = () => {
    return (
      <DialogTitle>
        <Text
          text={t("newActivity")}
          variant={TypographyVariant.h4}
          bold={false}
        />
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

  const hotelEventSwitch = () => {
    const spacing = 2;

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(isHotelEventId, event.target.checked);
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
        spacing={spacing}
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

  const locationNameField = () => {
    const spacing = 2;

    return (
      <Stack
        direction="row"
        display="flex"
        alignItems="center"
        spacing={spacing}
      >
        <Text
          text={`${isHotelEvent ? t("hotelName") : t("locationName")}:`}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
        <TextInputField
          name={locationNameId}
          label={
            isHotelEvent
              ? t("hotelNameDescription")
              : t("locationNameDescription")
          }
          control={control}
          errorMessage={
            isHotelEvent
              ? t("hotelNameErrorMessage")
              : t("locationNameErrorMessage")
          }
          errors={errors}
          value={locationName}
        />
      </Stack>
    );
  };

  const locationCityField = () => {
    const spacing = 2;

    return (
      <Stack
        direction="row"
        display="flex"
        alignItems="center"
        spacing={spacing}
      >
        <Text
          text={`${isHotelEvent ? t("hotelCity") : t("locationCity")}:`}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
        <TextInputField
          name={locationCityId}
          label={
            isHotelEvent
              ? t("hotelCityDescription")
              : t("locationCityDescription")
          }
          control={control}
          errorMessage={
            isHotelEvent
              ? t("hotelCityErrorMessage")
              : t("cityNameErrorMessage")
          }
          errors={errors}
          value={locationCity}
        />
      </Stack>
    );
  };

  const checkInTimeField = () => {
    const spacing = 2;

    return (
      isHotelEvent && (
        <Stack
          direction="row"
          display="flex"
          alignItems="center"
          spacing={spacing}
        >
          <Text
            text={t("checkInTime") + ":"}
            variant={TypographyVariant.h6}
            bold={false}
            color={colorsConst.palette.text.primary}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name={checkInTimeId}
              control={control}
              rules={{
                required: t("checkInTimeErrorMessage"),
              }}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  value={checkInTime}
                  slotProps={{
                    textField: {
                      error: !!errors.checkInTime,
                      helperText: errors.checkInTime
                        ? (errors.checkInTime.message as string)
                        : "",
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Stack>
      )
    );
  };

  const checkOutTimeField = () => {
    const spacing = 2;

    return (
      isHotelEvent && (
        <Stack
          direction="row"
          display="flex"
          alignItems="center"
          spacing={spacing}
        >
          <Text
            text={t("checkOutTime") + ":"}
            variant={TypographyVariant.h6}
            bold={false}
            color={colorsConst.palette.text.primary}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name={checkOutTimeId}
              control={control}
              rules={{
                required: t("checkOutTimeErrorMessage"),
              }}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  value={checkOutTime}
                  slotProps={{
                    textField: {
                      error: !!errors.checkOutTime,
                      helperText: errors.checkOutTime
                        ? (errors.checkOutTime.message as string)
                        : "",
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Stack>
      )
    );
  };

  const timeOfDayField = () => {
    const spacing = 2;

    const label = () => {
      return (
        <Text
          text={t("timeOfDay") + ":"}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
      );
    };

    const handleOnChange = (event: SelectChangeEvent<string>) => {
      const selectedTimeOfDay = event.target.value;
      setValue(timeOfDayId, selectedTimeOfDay as EventTimeOfDay, {
        shouldValidate: true,
      });
    };

    const hint = () => {
      return (
        <MenuItem value="" disabled>
          {t("timeOfDayDescription")}
        </MenuItem>
      );
    };

    const getPreviousEvent = (): Event | null => {
      if (indexToAddEventTo === 0) return null;

      return events[indexToAddEventTo - 1];
    };

    const getNextEvent = (): Event | null => {
      if (indexToAddEventTo === events.length) return null;

      return events[indexToAddEventTo];
    };

    const timeOfDayOptions = () => {
      const previousEvent: Event | null = getPreviousEvent();
      const nextEvent: Event | null = getNextEvent();
      let options: EventTimeOfDay[] = [];
      let previousEventTimeOfDay: EventTimeOfDay;
      let nextEventTimeOfDay: EventTimeOfDay;

      if (!previousEvent && nextEvent) {
        // if no previous event, means this new event will be the first one in the updated itineray. allow any time of day before and during the same time of day as the next event
        nextEventTimeOfDay = nextEvent.time_of_day;
        options = getTimesOfDayBefore(nextEventTimeOfDay);
      } else if (previousEvent && !nextEvent) {
        // if no next event, means this new event will be the last one in the updated itinerary. allow any time of day during and after the same time of day as the previous event
        previousEventTimeOfDay = previousEvent.time_of_day;
        options = getTimesOfDayAfter(previousEventTimeOfDay);
      } else if (!previousEvent && !nextEvent) {
        // if no previous and next events, means this new event will be the only one in the updated itinerary. allow any time of day
        options = Object.values(EventTimeOfDay);
      } else {
        // if there are both previous and next events, means this event will be sandwiched between existing events. allow any time of day during and after the previous time of day as the previous event, and during and before the time of day as the next event
        previousEventTimeOfDay = previousEvent?.time_of_day!;
        nextEventTimeOfDay = nextEvent?.time_of_day!;
        options = getTimesOfDayBetween(
          previousEventTimeOfDay,
          nextEventTimeOfDay,
        );
      }

      return options.map((timeOfDay) => (
        <MenuItem key={timeOfDay} value={timeOfDay}>
          {timeOfDay}
        </MenuItem>
      ));
    };

    return (
      <Stack
        direction="row"
        display="flex"
        alignItems="center"
        spacing={spacing}
      >
        {label()}
        <FormControl fullWidth>
          <Controller
            name={timeOfDayId}
            control={control}
            rules={{ required: t("timeOfDayErrorMessage") }}
            render={({ field }) => (
              <Select
                value={timeOfDay || ""}
                defaultValue={""}
                onChange={handleOnChange}
                fullWidth={true}
                required
                displayEmpty
              >
                {hint()}
                {timeOfDayOptions()}
              </Select>
            )}
          />
          <FormHelperText error={!!errors.timeOfDay}>
            {errors.timeOfDay?.message}
          </FormHelperText>
        </FormControl>
      </Stack>
    );
  };

  const addEventButton = () => {
    const loadingAnimationSize: number = 24;
    const spacing = 2;

    const handleOnClick = async () => {
      try {
        const locationNameValid = await trigger(locationNameId);
        const locationCityValid = await trigger(locationCityId);
        const timeOfDayValid = await trigger(timeOfDayId);
        let checkInTimeValid;
        let checkOutTimeValid;

        if (isHotelEvent) {
          checkInTimeValid = await trigger(checkInTimeId);
          checkOutTimeValid = await trigger(checkOutTimeId);
        }

        if (locationNameValid && locationCityValid && timeOfDayValid) {
          if (isHotelEvent) {
            if (!checkInTimeValid || !checkOutTimeValid) return;
          }

          setAddingActivity(true);
          setShowAlert(false);
          const validateNewJson = generateValidateNewJson(
            itineraryRequest,
            events,
            dayPlan,
            timeOfDay,
            locationName,
            locationCity,
          );
          const validateNewRes = await validateNew(validateNewJson);

          if (!validateNewRes.success) {
            setAlertText(validateNewRes.reason);
            setAlertType(AlertType.error);
            setShowAlert(true);
            return;
          }

          const searchActivityJson = generateSearchActivityJson(
            locationName,
            locationCity,
          );
          const searchActivityRes = await searchActivity(searchActivityJson);
          const newEvents = await getEvents([searchActivityRes], timeOfDay);

          if (isHotelEvent) {
            newEvents[0].is_hotel = true;
            newEvents[0].checkInTime = checkInTime?.format("h:mm A")!;
            newEvents[0].checkOutTime = checkOutTime?.format("h:mm A")!;
          }

          const newEdit: Partial<
            Record<ItineraryEditAction, AddEventToItineraryDetails>
          > = {
            [ItineraryEditAction.add]: {
              indexToAddEventTo,
              newEvent: newEvents[0],
            },
          };
          setCurrentEdit(newEdit);
          setOpen(false);
          reset({
            isHotelEvent: false,
            locationName: "",
            locationCity: "",
            timeOfDay: null as unknown as EventTimeOfDay,
          });
        }
      } catch (error: any) {
        setAlertText(error.message);
        setAlertType(AlertType.error);
        setShowAlert(true);
      } finally {
        setAddingActivity(false);
      }
    };

    return (
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleOnClick}
          sx={{ width: "auto", minWidth: "unset" }}
          disabled={addingActivity}
        >
          {addingActivity ? (
            <Stack
              direction="row"
              spacing={spacing}
              display="flex"
              alignItems="center"
            >
              <CircularProgress size={loadingAnimationSize} />
              <Text
                text={
                  isHotelEvent ? t("addingHotelActivity") : t("addingActivity")
                }
                variant={TypographyVariant.button}
                bold={false}
              />
            </Stack>
          ) : (
            <Text
              text={isHotelEvent ? t("addHotelActivity") : t("addActivity")}
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
          {hotelEventSwitch()}
          {locationNameField()}
          {locationCityField()}
          {checkInTimeField()}
          {checkOutTimeField()}
          {timeOfDayField()}
          {addEventButton()}
          <Alert
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            alertText={alertText}
            alertType={alertType}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;
