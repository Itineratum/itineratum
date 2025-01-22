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
  EventTimeOfDay,
  GenerateItineraryJSON,
} from "@/lib/pythonBackend/types";
import { getEvents, getTimeOfDayOptions } from "@/lib/pythonBackend/utils";
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
  event,
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
  event: Event;
}) => {
  const t = useTranslations("itinerary.modifyEventDialog");
  const {
    control,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = useForm<ModifyEventFormData>();

  const [modifyingActivity, setModifyingActivity] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [hasModifications, setHasModifications] = useState<boolean>(false);

  const spacing = 4;

  const locationNameId = "locationName";
  const locationCityId = "locationCity";
  const timeOfDayId = "timeOfDay";
  const locationName = watch(locationNameId);
  const locationCity = watch(locationCityId);
  const timeOfDay = watch(timeOfDayId);

  useEffect(() => {
    if (event && dayPlan) {
      setValue(locationNameId, event.event_name);
      setValue(locationCityId, dayPlan.destination);
      setValue(timeOfDayId, event.time_of_day);
    }
  }, [event, dayPlan]);

  useEffect(() => {
    if (event && dayPlan) {
      setHasModifications(
        locationName !== event.event_name ||
          locationCity !== dayPlan.destination ||
          timeOfDay !== event.time_of_day,
      );
    }
  }, [locationName, locationCity, timeOfDay, event, dayPlan]);

  const handleOnClose = () => {
    if (!modifyingActivity) {
      setShowAlert(false);
      setOpen(false);
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

    const timeOfDayOptionItems = () => {
      return Object.values(EventTimeOfDay).map((timeOfDay) => (
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
                {timeOfDayOptionItems()}
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

  const modifyEventButton = () => {
    const loadingAnimationSize: number = 24;
    const spacing = 2;

    const handleOnClick = async () => {
      try {
        const locationNameValid = await trigger(locationNameId);
        const locationCityValid = await trigger(locationCityId);
        const timeOfDayValid = await trigger(timeOfDayId);

        if (
          locationNameValid &&
          locationCityValid &&
          timeOfDayValid &&
          hasModifications
        ) {
          setModifyingActivity(true);
          setShowAlert(false);
          const updatedEvents = [...events];
          updatedEvents[indexToModifyEventAt] = {
            ...updatedEvents[indexToModifyEventAt],
            event_name: `${locationName}, ${locationCity}`,
            time_of_day: timeOfDay,
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
          // const searchActivityRes = await searchActivity(searchActivityJson);
          const searchActivityRes = {
            location_name: "Yodobashi Camera Shopping",
            location_city: "Tokyo",
            location_address:
              "1-1 Kanda Hanaokachō, Chiyoda City, Tokyo 101-0028, Japan",
            display_name: {
              text: "Yodobashi Akiba",
              languageCode: "en",
            },
            rating: 4.2,
            website_uri: "https://www.yodobashi.com/ec/store/0018/",
            price_level: "N/A",
            price_range: "N/A",
            photos: [
              {
                name: "places/ChIJGU_M2aeOGGARdnOLcMYXuXs/photos/AWYs27ypHb4lfLPRdgs0thorQEZUlvo8d-9mzRmCzEzdvXFEY5_EFiLmdWog0CnZdzjtY3Oin0_sdP3AuL31KTlhrOakYwtTm4_qhyk4AEiAKY2xiLYp2PXj9NuKf7ezNwIBGe0NexVLAnw5bX0RO-qZtchhsCAMDMRU5Mck",
                widthPx: 4032,
                heightPx: 3024,
                authorAttributions: [
                  {
                    displayName: "AVATER LIFE",
                    uri: "https://maps.google.com/maps/contrib/110832632350741340550",
                    photoUri:
                      "https://lh3.googleusercontent.com/a-/ALV-UjVXsApxOvlIFyeo3c1CHC-XVYVI4lVRcWwvvekoSJzgMNCrK7nr6g=s100-p-k-no-mo",
                  },
                ],
                flagContentUri:
                  "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sAF1QipOcC3OTGL6q7gd0X5QQRNLhunh16CAPUG41A0Xs&hl=en-US",
                googleMapsUri:
                  "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sAF1QipOcC3OTGL6q7gd0X5QQRNLhunh16CAPUG41A0Xs!2e10!4m2!3m1!1s0x60188ea7d9cc4f19:0x7bb917c6708b7376",
              },
              {
                name: "places/ChIJGU_M2aeOGGARdnOLcMYXuXs/photos/AWYs27zP2zF-4-5_kBDBVLza_EPsdZa2aqj3F0XqKXCA0D3Vo6GeBYcVsDiBUuDNDz5HFWbq_ppJ4fk0Ly1cX0L_h4IRj3KmHV9I3-3ThOvEsSdq8QpIpT5-VpL9n6IG89ADI16HgZyMHM3lCyMjMBHtDaqJk0jUBUwbToRK",
                widthPx: 4800,
                heightPx: 3600,
                authorAttributions: [
                  {
                    displayName: "AJ J",
                    uri: "https://maps.google.com/maps/contrib/111815403752443800799",
                    photoUri:
                      "https://lh3.googleusercontent.com/a-/ALV-UjVzJ56KRsNCNPkX3QOiWJuRrux-9C_uuLJa77YmPAZk9LcHVGPUyQ=s100-p-k-no-mo",
                  },
                ],
                flagContentUri:
                  "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sAF1QipOsau-szA9OmEhsZvOj4qQlk0rmqNlG7pFtqUwT&hl=en-US",
                googleMapsUri:
                  "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sAF1QipOsau-szA9OmEhsZvOj4qQlk0rmqNlG7pFtqUwT!2e10!4m2!3m1!1s0x60188ea7d9cc4f19:0x7bb917c6708b7376",
              },
              {
                name: "places/ChIJGU_M2aeOGGARdnOLcMYXuXs/photos/AWYs27wHf1hHS4PG8O5x9Hbp0eMRFIjV3R7t9VM_sEKhjmMXAhTX58MgTF6kcmD3pIOMboQrtQjj3K5rma-kluatWv7eKd9quqdlmkDpVxcXPEkUig1F5BCQX5k1hFUuvkF_i1GBbUZcV0NlJO34XrOyTWFoY-qv6jQkzOI2",
                widthPx: 4032,
                heightPx: 3024,
                authorAttributions: [
                  {
                    displayName: "にゃんこゴールド",
                    uri: "https://maps.google.com/maps/contrib/115520386667645195751",
                    photoUri:
                      "https://lh3.googleusercontent.com/a-/ALV-UjW5crrbxzXkPyTRHOMxWsB7xIIkAm_CecwpZa3fZ6sjHyx8rHx3Yw=s100-p-k-no-mo",
                  },
                ],
                flagContentUri:
                  "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sAF1QipMJrwzKPoMnQ550SCsiwmCIjjfwF2NSLzymOENB&hl=en-US",
                googleMapsUri:
                  "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sAF1QipMJrwzKPoMnQ550SCsiwmCIjjfwF2NSLzymOENB!2e10!4m2!3m1!1s0x60188ea7d9cc4f19:0x7bb917c6708b7376",
              },
              {
                name: "places/ChIJGU_M2aeOGGARdnOLcMYXuXs/photos/AWYs27wBv1Ik9mX6Ow_DHqMEnt7yi2Kmc_zW5D8bN654w-BljYm602d7xrpXCHvtXqIGQRraExAX95Muatf8DB9I663R1dFBl_fgxvhFYTnmlQI9mmS1TBuNg0mKPtL_CrdoMwMO2cus_LHBuVQWWHvyVIUXy3A6UM5cR0fA",
                widthPx: 3264,
                heightPx: 2448,
                authorAttributions: [
                  {
                    displayName: "patdy lio",
                    uri: "https://maps.google.com/maps/contrib/112184771835297520760",
                    photoUri:
                      "https://lh3.googleusercontent.com/a-/ALV-UjU5xYDE_X8hBWvPfnZVyE9NHvNIXGqySR44_GjNU_z7BOYMz3YX=s100-p-k-no-mo",
                  },
                ],
                flagContentUri:
                  "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sAF1QipOuSQ-k19P8fmvikVuPqlf8Zl5yBVklUU6db3sA&hl=en-US",
                googleMapsUri:
                  "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sAF1QipOuSQ-k19P8fmvikVuPqlf8Zl5yBVklUU6db3sA!2e10!4m2!3m1!1s0x60188ea7d9cc4f19:0x7bb917c6708b7376",
              },
              {
                name: "places/ChIJGU_M2aeOGGARdnOLcMYXuXs/photos/AWYs27yjxZgj7eHvp8s0R6yeYapTLFkvWkCP1JCxOFvkVAvKcno1qwkawHmBDVFizzZHmpInRRDnK_Bf5Z-Altwx1psPRvwq3rk-e-hyq4Y0w287uUBzxTMMgyCF7g95AQAAj0lO1NvLaFovEvJdL2thnN7MeENxFUIv4vR5",
                widthPx: 2448,
                heightPx: 3264,
                authorAttributions: [
                  {
                    displayName: "Don Kelone",
                    uri: "https://maps.google.com/maps/contrib/104868239455081945750",
                    photoUri:
                      "https://lh3.googleusercontent.com/a-/ALV-UjWHYpPlIYOR72qjX0nbOFXqqf-y1_aeI80GshPHDb0mwsUwfGdofA=s100-p-k-no-mo",
                  },
                ],
                flagContentUri:
                  "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sAF1QipMeEuokHCSDOzEnzRGvtkMq5yK3u9Jq1w4P_oXA&hl=en-US",
                googleMapsUri:
                  "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sAF1QipMeEuokHCSDOzEnzRGvtkMq5yK3u9Jq1w4P_oXA!2e10!4m2!3m1!1s0x60188ea7d9cc4f19:0x7bb917c6708b7376",
              },
              {
                name: "places/ChIJGU_M2aeOGGARdnOLcMYXuXs/photos/AWYs27zlDD95gpKbL_ZWm58Z6DLQN2wz2NTp4Xj30xvu6xwEGk1zmJ0kVlgL9AwOD35HHC3rNb6Lgd5bwYCupSRaXQxd4nRxHVjRE637_trmbto1kem0Ygr1CqYU8D6z7QtemEuATdzfbPNjBhQKHdkrwN_ysuqFIs0zzy1O",
                widthPx: 2048,
                heightPx: 1536,
                authorAttributions: [
                  {
                    displayName: "平井翼",
                    uri: "https://maps.google.com/maps/contrib/116477480546178703064",
                    photoUri:
                      "https://lh3.googleusercontent.com/a-/ALV-UjUqlHI_FjKDpr6hoIxNLRJ9VBqPTD6bxFgb3ZZl4jqSifqrehg=s100-p-k-no-mo",
                  },
                ],
                flagContentUri:
                  "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sAF1QipOFLIg7npwSpMsrC4XOAKfmSKvUYRtgHT7npo1x&hl=en-US",
                googleMapsUri:
                  "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sAF1QipOFLIg7npwSpMsrC4XOAKfmSKvUYRtgHT7npo1x!2e10!4m2!3m1!1s0x60188ea7d9cc4f19:0x7bb917c6708b7376",
              },
              {
                name: "places/ChIJGU_M2aeOGGARdnOLcMYXuXs/photos/AWYs27zFD3CzFdJNuJt_CWoUt70SrSZLOHfZnhp5H-xeOce4kvwQd7caJ-E-sRVakOWT9zLfO6uH0IN9UKmQ3ekAa6cpahC7Oznya1ldZF5ObIURllgjUECgAhq2Yvri9DWUzuRKr47uFOHXvWVK7gM4RCYET--8hQCKm-XQ",
                widthPx: 3264,
                heightPx: 1840,
                authorAttributions: [
                  {
                    displayName: "Sheri Wong",
                    uri: "https://maps.google.com/maps/contrib/100379880351292828010",
                    photoUri:
                      "https://lh3.googleusercontent.com/a-/ALV-UjXPu2tQE-P_R9yhIt8W0FpzHOacT3FGoxkh4o-_B-Xt7PdT1hO7=s100-p-k-no-mo",
                  },
                ],
                flagContentUri:
                  "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sAF1QipPqqUj_um0fFdIsY8wTUKQa-inwI636i3qR-K0i&hl=en-US",
                googleMapsUri:
                  "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sAF1QipPqqUj_um0fFdIsY8wTUKQa-inwI636i3qR-K0i!2e10!4m2!3m1!1s0x60188ea7d9cc4f19:0x7bb917c6708b7376",
              },
              {
                name: "places/ChIJGU_M2aeOGGARdnOLcMYXuXs/photos/AWYs27xq2sE5nEMUQSIQCbTp-XrlX8UaBQyxjuEfqBCPYedXIlJMJsFHGbzYZ3kYe2XnQYL9T5t9jLlmUcSiyrHnDhuL3J8BFcTnaxwfMsEUxrCp3frNaiU9gaOD7kgT0V_--X2dAwy9VmUL4vQ9R6zkxvMeeaV4knimFXr5",
                widthPx: 2576,
                heightPx: 1932,
                authorAttributions: [
                  {
                    displayName: "reyes los",
                    uri: "https://maps.google.com/maps/contrib/107673378945405061051",
                    photoUri:
                      "https://lh3.googleusercontent.com/a/ACg8ocLe4GCb8QbnJi1PNUl3WoGALeNe31mFvVFbFb0XPfdORYIm-g=s100-p-k-no-mo",
                  },
                ],
                flagContentUri:
                  "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sAF1QipNyUZwTdjjuezlywE1jdGNL-Ar9s6ECGiq9C50B&hl=en-US",
                googleMapsUri:
                  "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sAF1QipNyUZwTdjjuezlywE1jdGNL-Ar9s6ECGiq9C50B!2e10!4m2!3m1!1s0x60188ea7d9cc4f19:0x7bb917c6708b7376",
              },
              {
                name: "places/ChIJGU_M2aeOGGARdnOLcMYXuXs/photos/AWYs27ymHBc-gmLEDH09qT8YxA9rH8iPCX3mV2XZJ4odX66eszE8WJ05l7Dh5ZCYP_q54mKSBEGNN2VINtr9oXxue2sLMOnGv1gEmLPQAV0uCYK3dh_8pTYD4Sdo_ukksdvAVJBp0v7LwwPYMHk7YEdAWOSagFPhYgK2plOb",
                widthPx: 3024,
                heightPx: 4032,
                authorAttributions: [
                  {
                    displayName: "YAMAHICO",
                    uri: "https://maps.google.com/maps/contrib/107506126831414558334",
                    photoUri:
                      "https://lh3.googleusercontent.com/a-/ALV-UjXbWu7ixyvpd3BAsRDWVdGRYQmHlceb6OMyfC7I-PgsD5MI5Rd8dg=s100-p-k-no-mo",
                  },
                ],
                flagContentUri:
                  "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sAF1QipPcxBKP__YPJHIJq8q1tkN7y2rB9v8fCmJUHueZ&hl=en-US",
                googleMapsUri:
                  "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sAF1QipPcxBKP__YPJHIJq8q1tkN7y2rB9v8fCmJUHueZ!2e10!4m2!3m1!1s0x60188ea7d9cc4f19:0x7bb917c6708b7376",
              },
              {
                name: "places/ChIJGU_M2aeOGGARdnOLcMYXuXs/photos/AWYs27yzt03H6KENNFHVMM9UrCUAFmb67odWmouGVhsI1iAAmS1E-n56SWrHvGwf8aHTwsB0EcctymgrNwNuty90jE5non2IohMUKiHrR28MuUt29iKkopiBwhsHtO7tR_Rj7zOooX-mXw4WShkHdocFw2QmUcwVGGpAIS_p",
                widthPx: 4032,
                heightPx: 3024,
                authorAttributions: [
                  {
                    displayName: "Nalleli P.M.",
                    uri: "https://maps.google.com/maps/contrib/105864950840020613452",
                    photoUri:
                      "https://lh3.googleusercontent.com/a-/ALV-UjXfOqwshdyMLVjo5qc5KCwwYZnApD9B-juwvnKZobdAEUBQV-GiMg=s100-p-k-no-mo",
                  },
                ],
                flagContentUri:
                  "https://www.google.com/local/imagery/report/?cb_client=maps_api_places.places_api&image_key=!1e10!2sAF1QipPocX-CKXVRVuMwT37TqAcCc_oTPU48mm-r9emj&hl=en-US",
                googleMapsUri:
                  "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sAF1QipPocX-CKXVRVuMwT37TqAcCc_oTPU48mm-r9emj!2e10!4m2!3m1!1s0x60188ea7d9cc4f19:0x7bb917c6708b7376",
              },
            ],
            opening_hours: {
              openNow: true,
              periods: [
                {
                  open: {
                    day: 0,
                    hour: 9,
                    minute: 30,
                    date: {
                      year: 2025,
                      month: 1,
                      day: 26,
                    },
                  },
                  close: {
                    day: 0,
                    hour: 22,
                    minute: 0,
                    date: {
                      year: 2025,
                      month: 1,
                      day: 26,
                    },
                  },
                },
                {
                  open: {
                    day: 1,
                    hour: 9,
                    minute: 30,
                    date: {
                      year: 2025,
                      month: 1,
                      day: 27,
                    },
                  },
                  close: {
                    day: 1,
                    hour: 22,
                    minute: 0,
                    date: {
                      year: 2025,
                      month: 1,
                      day: 27,
                    },
                  },
                },
                {
                  open: {
                    day: 2,
                    hour: 9,
                    minute: 30,
                    date: {
                      year: 2025,
                      month: 1,
                      day: 28,
                    },
                  },
                  close: {
                    day: 2,
                    hour: 22,
                    minute: 0,
                    date: {
                      year: 2025,
                      month: 1,
                      day: 28,
                    },
                  },
                },
                {
                  open: {
                    day: 3,
                    hour: 9,
                    minute: 30,
                    date: {
                      year: 2025,
                      month: 1,
                      day: 22,
                    },
                  },
                  close: {
                    day: 3,
                    hour: 22,
                    minute: 0,
                    date: {
                      year: 2025,
                      month: 1,
                      day: 22,
                    },
                  },
                },
                {
                  open: {
                    day: 4,
                    hour: 9,
                    minute: 30,
                    date: {
                      year: 2025,
                      month: 1,
                      day: 23,
                    },
                  },
                  close: {
                    day: 4,
                    hour: 22,
                    minute: 0,
                    date: {
                      year: 2025,
                      month: 1,
                      day: 23,
                    },
                  },
                },
                {
                  open: {
                    day: 5,
                    hour: 9,
                    minute: 30,
                    date: {
                      year: 2025,
                      month: 1,
                      day: 24,
                    },
                  },
                  close: {
                    day: 5,
                    hour: 22,
                    minute: 0,
                    date: {
                      year: 2025,
                      month: 1,
                      day: 24,
                    },
                  },
                },
                {
                  open: {
                    day: 6,
                    hour: 9,
                    minute: 30,
                    date: {
                      year: 2025,
                      month: 1,
                      day: 25,
                    },
                  },
                  close: {
                    day: 6,
                    hour: 22,
                    minute: 0,
                    date: {
                      year: 2025,
                      month: 1,
                      day: 25,
                    },
                  },
                },
              ],
              weekdayDescriptions: [
                "Monday: 9:30 AM – 10:00 PM",
                "Tuesday: 9:30 AM – 10:00 PM",
                "Wednesday: 9:30 AM – 10:00 PM",
                "Thursday: 9:30 AM – 10:00 PM",
                "Friday: 9:30 AM – 10:00 PM",
                "Saturday: 9:30 AM – 10:00 PM",
                "Sunday: 9:30 AM – 10:00 PM",
              ],
              nextCloseTime: "2025-01-22T13:00:00Z",
            },
            primary_type: "electronics_store",
          };

          // console.log(searchActivityRes);

          const modifiedEvents = await getEvents(
            [searchActivityRes],
            timeOfDay,
          );
          const newEdit: Partial<
            Record<ItineraryEditAction, ModifyEventInItineraryDetails>
          > = {
            [ItineraryEditAction.modify]: {
              indexToModifyEventAt,
              modifiedEvent: modifiedEvents[0],
              timeOfDayChange: timeOfDay !== event.time_of_day,
            },
          };
          setCurrentEdit(newEdit);
          setOpen(false);
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
          disabled={modifyingActivity || !hasModifications}
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
          {timeOfDayField()}
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
