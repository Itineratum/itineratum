"use client";

import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { NewsletterFormData } from "@/constants/types/formData/newsletterFormData";
import noodles from "@/public/noodles.png";
import leaningTowerOfPisa from "@/public/pisa.png";
import { isValidEmail } from "@/utils/signUpFormValidation";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { useInView } from "react-intersection-observer";

const NewsletterSignup = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const t = useTranslations("home.newsletterSignup");
  const {
    formState: { errors },
    watch,
    trigger,
    control,
  } = useForm<NewsletterFormData>();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasEmailInNewsletter, setHasEmailInNewsletter] =
    useState<boolean>(isLoggedIn);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const nameId = "name";
  const emailId = "email";
  const name = watch(nameId);
  const email = watch(emailId);

  const rollInAnimationDuration = 1.2; // in seconds

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

  const gridSpacing: number = 4;
  const userInputsSize: number = 6;
  const imageSize: number = (12 - userInputsSize) / 2;
  const height = "380px";

  const userInputs = () => {
    const spacing: number = 4;

    const nameTextInput = () => {
      return (
        <Controller
          key={nameId}
          name={nameId}
          control={control}
          defaultValue=""
          rules={{
            required: t("nameRequired"),
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              variant="filled"
              label={t("name")}
              value={name}
              InputLabelProps={{
                sx: { color: "text.primary" },
              }}
              error={!!errors.name}
              helperText={errors.name ? (errors.name.message as string) : ""}
            />
          )}
        />
      );
    };

    const emailTextInput = () => {
      const emailValidation = (emailInput: string) => {
        const isValid = isValidEmail(emailInput);
        return isValid ? true : t("emailError");
      };

      const handleEmailChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<NewsletterFormData, "email">,
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
              variant="filled"
              label={t("email")}
              value={email}
              InputLabelProps={{
                sx: { color: "text.primary" },
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
        !(email && isValidEmail(email) && name ? true : false);

      const handleOnClick = async () => {
        const isEmailValid = await trigger(emailId);

        if (!isEmailValid) return;

        setIsSubmitting(true);
        const data = { name, email };
        addEmailToNewsLetter.mutateAsync(data);
      };

      return (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
        </Box>
      );
    };

    return (
      <Stack direction="column" spacing={spacing} justifyContent={"center"}>
        <Box sx={{ display: "flex", textAlign: "center" }}>
          <Text
            text={t("header")}
            variant={TypographyVariant.h4}
            bold={false}
          />
        </Box>
        {nameTextInput()}
        {emailTextInput()}
        {letsGoButton()}
      </Stack>
    );
  };

  const leftImage = () => {
    return (
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={inView ? { x: "-25%", opacity: 1 } : {}}
        transition={{ duration: rollInAnimationDuration, ease: "easeOut" }}
      >
        <Box sx={{ position: "relative", top: "0%" }}>
          <Image src={leaningTowerOfPisa} alt={"The Leaning Tower of Pisa"} />
        </Box>
      </motion.div>
    );
  };

  const rightImage = () => {
    return (
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={inView ? { x: "0%", opacity: 1 } : {}}
        transition={{ duration: rollInAnimationDuration, ease: "easeOut" }}
      >
        <Box sx={{ position: "relative", top: "-17%" }}>
          <Image src={noodles} alt={"A bowl of noodles"} />
        </Box>
      </motion.div>
    );
  };

  const loadingIndicator = () => {
    return <Skeleton variant="rounded" height="100%" width="100%" />;
  };

  const signUpForm = () => {
    const signUpFormSx = {
      background: `linear-gradient(90deg, ${colorsConst.components.newsletterSignup.color1}, ${colorsConst.components.newsletterSignup.color2})`,
      padding: gridSpacing,
      borderRadius: 6,
      color: colorsConst.palette.text.secondary,
      overflow: "hidden",
      height,
      width: "100%",
    };

    return (
      <Box ref={ref} sx={signUpFormSx}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={imageSize}>
            {leftImage()}
          </Grid>
          <Grid item xs={userInputsSize}>
            <Stack spacing={gridSpacing - 1}>
              {userInputs()}
              <Alert
                showAlert={showAlert}
                setShowAlert={setShowAlert}
                alertType={alertType}
                alertText={alertText}
              />
            </Stack>
          </Grid>
          <Grid item xs={imageSize}>
            {rightImage()}
          </Grid>
        </Grid>
      </Box>
    );
  };

  return isLoggedIn && checkEmailInNewsletter.isLoading ? (
    loadingIndicator()
  ) : hasEmailInNewsletter ? (
    <div></div>
  ) : (
    signUpForm()
  );
};

export default NewsletterSignup;
