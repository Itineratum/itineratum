"use client";

import { trpc } from "@/app/_trpc/client";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import { StayConnectedFormData } from "@/constants/types/formData/stayConnectedFormData";
import paperPlane from "@/public/paper_plane.svg";
import { isValidEmail } from "@/utils/signUpFormValidation";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import Text from "../atoms/text";
import Alert from "./alert";

const StayConnectedColumn = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const t = useTranslations("footer");
  const {
    formState: { errors },
    watch,
    register,
    trigger,
    control,
  } = useForm<StayConnectedFormData>();

  const [above18checked, setAbove18checked] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasEmailInNewsletter, setHasEmailInNewsletter] =
    useState<boolean>(isLoggedIn);

  const spacing: number = 3;

  const emailId = "email";
  const above18id = "above18";

  const email = watch(emailId);

  const addEmailToNewsLetter =
    trpc.newsletterEmail.addEmailToNewsletter.useMutation({
      onSuccess: (response) => {
        setAlertType(response ? AlertType.success : AlertType.error);
        setAlertText(response ? t("emailSuccess") : t("emailExists"));
        setShowAlert(true);
        setIsSubmitting(false);

        if (isLoggedIn) setHasEmailInNewsletter(true);
      },
    });
  const checkEmailInNewsletter =
    trpc.newsletterEmail.checkEmailInNewsletter.useQuery(
      { email: session?.user.email! },
      { retry: false, enabled: isLoggedIn },
    );

  useEffect(() => {
    if (checkEmailInNewsletter.isFetched) {
      setHasEmailInNewsletter(checkEmailInNewsletter.data ?? false);
    }
  }, [checkEmailInNewsletter.isFetched]);

  const stayConnectedText = () => {
    return (
      <Text
        text={t("stayConnected")}
        variant={TypographyVariant.subtitle1}
        bold={false}
      />
    );
  };

  const emailRow = () => {
    const rowSpacing: number = 2;

    const emailTextInput = () => {
      const style = {
        backgroundColor: "transparent",
        input: { color: "white" },
        "& .MuiInput-underline:before": { borderBottomColor: "#FFFFFF" },
        "& .MuiInput-underline:hover:before": {
          borderBottomColor: "#FFFFFF",
        },
        "& .MuiInput-underline:after": { borderBottomColor: "#FFFFFF" },
      };

      const emailValidation = (emailInput: string) => {
        const isValid = isValidEmail(emailInput);
        return isValid ? true : t("emailError");
      };

      const handleEmailChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<StayConnectedFormData, "email">,
      ) => {
        field.onChange(event.target.value);
        await trigger(emailId);
      };

      return (
        <Controller
          key={emailId}
          name={emailId}
          control={control}
          defaultValue=""
          rules={{
            validate: emailValidation,
            required: t("emailError"),
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              variant="standard"
              sx={style}
              label={t("email")}
              value={email}
              InputLabelProps={{
                sx: { color: "text.secondary" },
              }}
              error={!!errors.email}
              helperText={errors.email ? (errors.email.message as string) : ""}
              onChange={async (event) => await handleEmailChange(event, field)}
            />
          )}
        />
      );
    };

    const letsGoButton = () => {
      const loadingAnimationSize: number = 24;
      const canSubmit = () =>
        !(email ? (above18checked ? true : false) : false);

      const handleOnClick = async () => {
        const isEmailValid = await trigger(emailId);

        if (!isEmailValid) return;

        setIsSubmitting(true);
        const data = { email };
        addEmailToNewsLetter.mutateAsync(data);
      };

      return (
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          disabled={canSubmit()}
          onClick={handleOnClick}
        >
          {isSubmitting ? (
            <CircularProgress size={loadingAnimationSize} />
          ) : (
            <Text
              text={t("letsGo")}
              variant={TypographyVariant.subtitle1}
              bold={false}
              color="text.secondary"
            />
          )}
        </Button>
      );
    };

    const above18checkbox = () => {
      const handleOnClick = () => {
        setAbove18checked(!above18checked);
      };

      return (
        <FormControlLabel
          control={
            <Checkbox
              {...register(above18id, { required: true })}
              onClick={handleOnClick}
              checked={above18checked}
              color="default"
            />
          }
          label={
            <Text
              text={t("above18")}
              variant={TypographyVariant.subtitle2}
              bold={false}
            />
          }
        />
      );
    };

    return (
      <Stack>
        <Stack direction="row" spacing={rowSpacing} alignItems="center">
          {emailTextInput()}
          {letsGoButton()}
        </Stack>
        {above18checkbox()}
      </Stack>
    );
  };

  const loadingIndicator = () => {
    return <Skeleton variant="rounded" height="100%" width="100%" />;
  };

  const planeImage = () => {
    return <Image src={paperPlane} alt={"paper plane"} />;
  };

  const stayConnectedForm = () => {
    return (
      <Stack spacing={spacing}>
        {stayConnectedText()}
        {emailRow()}
      </Stack>
    );
  };

  const itineratumRow = () => {
    return (
      <Text
        text={`© ${new Date().getFullYear()} ${t("itineratumPteLtd")}`}
        variant={TypographyVariant.subtitle2}
        bold={false}
      />
    );
  };

  return (
    <Stack spacing={spacing}>
      <Box sx={{ height: "130px", width: "100%" }}>
        {isLoggedIn && checkEmailInNewsletter.isLoading
          ? loadingIndicator()
          : hasEmailInNewsletter
            ? planeImage()
            : stayConnectedForm()}
      </Box>
      <Alert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        alertType={alertType}
        alertText={alertText}
      />
      {itineratumRow()}
    </Stack>
  );
};

export default StayConnectedColumn;
