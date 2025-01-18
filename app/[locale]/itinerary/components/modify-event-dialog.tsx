import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import TextInputField from "@/components/molecules/text-input-field";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { ModifyEventFormData } from "@/constants/types/formData/modifyEventFormData";
import {
  generateSearchActivityJson,
  generateValidateEditJson,
  searchActivity,
  validateEdit,
} from "@/lib/pythonBackend/pythonBackend";
import {
  DayPlan,
  Event,
  GenerateItineraryJSON,
} from "@/lib/pythonBackend/types";
import { getEvents } from "@/lib/pythonBackend/utils";
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
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ItineraryEditAction,
  ItineraryEditDetails,
  ModifyEventInItineraryDetails,
} from "./review-itinerary";

const ModifyEventDialog = ({
  open,
  setOpen,
  itineraryRequest,
  events,
  indexToModifyEventAt,
  dayPlan,
  setCurrentEdit,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  itineraryRequest: GenerateItineraryJSON;
  events: Event[];
  indexToModifyEventAt: number;
  dayPlan: DayPlan;
  setCurrentEdit: Dispatch<
    SetStateAction<Partial<
      Record<ItineraryEditAction, ItineraryEditDetails>
    > | null>
  >;
}) => {
  const t = useTranslations("itinerary.modifyEventDialog");
  const {
    control,
    formState: { errors },
    watch,
    trigger,
    reset,
  } = useForm<ModifyEventFormData>();

  const [modifyingActivity, setModifyingActivity] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);

  const spacing = 4;

  const locationNameId = "locationName";
  const locationCityId = "locationCity";
  const locationName = watch(locationNameId);
  const locationCity = watch(locationCityId);

  const handleOnClose = () => {
    if (!modifyingActivity) {
      setShowAlert(false);
      setOpen(false);
      reset({
        locationName: "",
        locationCity: "",
      });
    }
  };

  const title = () => {
    return (
      <DialogTitle>
        <Text
          text={t("existingActivity")}
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

  const modifyEventButton = () => {
    const loadingAnimationSize: number = 24;
    const spacing = 2;

    const handleOnClick = async () => {
      try {
        const locationNameValid = await trigger(locationNameId);
        const locationCityValid = await trigger(locationCityId);

        if (locationNameValid && locationCityValid) {
          setModifyingActivity(true);
          setShowAlert(false);
          const updatedEvents = [...events];
          updatedEvents[indexToModifyEventAt] = {
            ...updatedEvents[indexToModifyEventAt],
            event_name: `${locationName}, ${locationCity}`,
          };
          const validateEditJson = generateValidateEditJson(
            itineraryRequest,
            updatedEvents,
            dayPlan,
          );
          const validateEditRes = await validateEdit(validateEditJson);

          if (!validateEditRes.success) {
            setAlertText(validateEditRes.reason);
            setAlertType(AlertType.error);
            setShowAlert(true);
            return;
          }

          const searchActivityJson = generateSearchActivityJson(
            locationName,
            locationCity,
          );
          const searchActivityRes = await searchActivity(searchActivityJson);
          const modifiedEventTimeOfDay =
            events[indexToModifyEventAt].time_of_day;
          const modifiedEvents = await getEvents(
            [searchActivityRes],
            modifiedEventTimeOfDay,
          );
          const newEdit: Partial<
            Record<ItineraryEditAction, ModifyEventInItineraryDetails>
          > = {
            [ItineraryEditAction.modify]: {
              indexToModifyEventAt,
              modifiedEvent: modifiedEvents[0],
            },
          };
          setCurrentEdit(newEdit);
          setOpen(false);
          reset({
            locationName: "",
            locationCity: "",
          });
        }
      } catch (error: any) {
        setAlertText(error.message);
        setAlertType(AlertType.error);
        setShowAlert(true);
      } finally {
        setModifyingActivity(false);
      }
    };

    return (
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleOnClick}
          sx={{ width: "auto", minWidth: "unset" }}
          disabled={modifyingActivity}
        >
          {modifyingActivity ? (
            <Stack
              direction="row"
              spacing={spacing}
              display="flex"
              alignItems="center"
            >
              <CircularProgress size={loadingAnimationSize} />
              <Text
                text={t("modifyingActivity")}
                variant={TypographyVariant.button}
                bold={false}
              />
            </Stack>
          ) : (
            <Text
              text={t("modifyActivity")}
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
          {modifyEventButton()}
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

export default ModifyEventDialog;
