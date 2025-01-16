import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import TextInputField from "@/components/molecules/text-input-field";
import {
  AddEventToItineraryDetails,
  ItineraryEditAction,
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
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
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
      Record<ItineraryEditAction, number | AddEventToItineraryDetails>
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
  } = useForm<AddNewEventFormData>();

  const [addingActivity, setAddingActivity] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);

  const spacing = 4;

  const locationNameId = "locationName";
  const locationCityId = "locationCity";
  const timeOfDayId = "timeOfDay";
  const locationName = watch(locationNameId);
  const locationCity = watch(locationCityId);
  const timeOfDay = watch(timeOfDayId);

  const handleOnClose = () => {
    if (!addingActivity) {
      setShowAlert(false);
      setOpen(false);
      reset({
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
          text={t("locationName") + ":"}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
        <TextInputField
          name={locationNameId}
          label={t("locationNameDescription")}
          control={control}
          errorMessage={t("locationNameErrorMessage")}
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
          text={t("locationCity") + ":"}
          variant={TypographyVariant.h6}
          bold={false}
          color={colorsConst.palette.text.primary}
        />
        <TextInputField
          name={locationCityId}
          label={t("locationCityDescription")}
          control={control}
          errorMessage={t("locationCityErrorMessage")}
          errors={errors}
          value={locationCity}
        />
      </Stack>
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
    const width = "40%";
    const loadingAnimationSize: number = 24;
    const spacing = 2;

    const handleOnClick = async () => {
      try {
        const locationNameValid = await trigger(locationNameId);
        const locationCityValid = await trigger(locationCityId);
        const timeOfDayValid = await trigger(timeOfDayId);

        if (locationNameValid && locationCityValid && timeOfDayValid) {
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
          const newEvent = await getEvents([searchActivityRes], timeOfDay);
          const newEdit: Partial<
            Record<ItineraryEditAction, AddEventToItineraryDetails>
          > = {
            [ItineraryEditAction.add]: {
              indexToAddEventTo,
              newEvent: newEvent[0],
            },
          };
          setCurrentEdit(newEdit);
          setOpen(false);
          reset({
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
          sx={{ width }}
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
                text={t("addingActivity")}
                variant={TypographyVariant.button}
                bold={false}
              />
            </Stack>
          ) : (
            <Text
              text={t("addActivity")}
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
          {locationNameField()}
          {locationCityField()}
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
