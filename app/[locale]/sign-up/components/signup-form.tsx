"use client";

import { trpc } from "@/app/_trpc/client";
import { OrDivider } from "@/components/atoms/or-divider";
import { PrivacyPolicyLink } from "@/components/atoms/privacy-policy-link";
import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { ContinueWithGoogleButton } from "@/components/molecules/continue-with-google-button";
import { AlertType } from "@/constants/enums/alertType";
import { countryInfoList } from "@/constants/enums/country";
import { TypographyVariant } from "@/constants/enums/theme";
import { SignUpFormData } from "@/constants/types/signUpFormData";
import { isValidEmail, isValidPassword } from "@/utils/signUpFormValidation";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";

const SignUpForm = () => {
  const t = useTranslations("signUp.signUpForm");
  const router = useRouter();
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
    trigger,
  } = useForm<SignUpFormData>();

  const [stepNumber, setStepNumber] = useState<number>(1);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const formMargin: number = 2;
  const formFieldMargin: "dense" | "normal" | "none" | undefined = "normal";
  const pageTransitionDuration: number = 500;

  const countryId = "country";
  const countryCodeId = "countryCode";
  const numberId = "number";
  const emailId = "email";
  const passwordId = "password";
  const reEnterPasswordId = "reEnterPassword";
  const verificationCodeId = "verificationCode";

  const country = watch(countryId);
  const countryCode = watch(countryCodeId);
  const number = watch(numberId);
  const email = watch(emailId);
  const password = watch(passwordId);
  const reEnterPassword = watch(reEnterPasswordId);
  const verificationCode = watch(verificationCodeId);

  const generateVerificationCode =
    trpc.user.generateVerificationCode.useMutation({
      onSuccess: () => {
        setStepNumber(3);
        setAlertType(AlertType.info);
        setAlertText(t("emailVerification.codeSentToEmail"));
        setShowAlert(true);
        setIsSigningUp(false);
      },
    });
  const verifyVerificationCode = trpc.user.verifyVerificationCode.useMutation({
    onSuccess: async () => {
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes && signInRes.ok) {
        setAlertText("");
        setShowAlert(false);
        router.push("/"); // redirect to home page
      } else {
        setAlertText(t("signUpErrorAlert"));
        setAlertType(AlertType.error);
        setShowAlert(true);
      }
      setIsSigningUp(false);
      setIsVerifying(false);
    },
  });

  const step1 = () => {
    const countryField = () => {
      const dropdownHeight: number = 200;

      const handleCountryChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<SignUpFormData, "country">,
      ) => {
        field.onChange(event);
        const inputCountry = event.target.value;

        try {
          const callingCode =
            countryInfoList[inputCountry as CountryCode].callingCode;
          setValue(countryCodeId, callingCode);
          await trigger(countryId);

          if (number) await trigger(numberId);
        } catch (error) {
          setValue(countryCodeId, "");
        }
      };

      return (
        <Controller
          key={countryId}
          name={countryId}
          control={control}
          defaultValue=""
          rules={{ required: t("countryError") }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              required
              fullWidth
              variant="filled"
              margin={formFieldMargin}
              label={t("country")}
              value={country}
              error={!!errors.country}
              helperText={
                errors.country ? (errors.country.message as string) : ""
              }
              onChange={async (event) =>
                await handleCountryChange(event, field)
              }
              InputLabelProps={{ sx: { color: "text.primary" } }}
              SelectProps={{
                MenuProps: {
                  MenuListProps: {
                    sx: { maxHeight: dropdownHeight, overflowY: "auto" },
                  },
                },
              }}
            >
              {Object.values(countryInfoList).map((country) => (
                <MenuItem key={country.name} value={country.iso2}>
                  {`${country.name} ${country.flagEmoji}`}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      );
    };

    const phoneNumberSection = () => {
      const countryCodeWidth: number = 4;
      const numberWidth: number = 12 - countryCodeWidth;

      const countryCodeField = () => {
        const countryCode = getValues(countryCodeId);
        const countryCodeFilled = Boolean(countryCode);

        return (
          <Controller
            key={countryCodeId}
            name={countryCodeId}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                variant="filled"
                margin={formFieldMargin}
                label={t("countryCode")}
                value={countryCode}
                InputProps={{ readOnly: true }}
                InputLabelProps={{
                  sx: { color: "text.primary" },
                  shrink: countryCodeFilled,
                }}
              />
            )}
          />
        );
      };

      const numberField = () => {
        const numberValidation = (numberInput: string) => {
          const isValid = isValidPhoneNumber(
            numberInput,
            country as CountryCode,
          );
          return isValid ? true : t("numberError");
        };

        const handleNumberChange = async (
          event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          field: ControllerRenderProps<SignUpFormData, "number">,
        ) => {
          field.onChange(event.target.value);
          await trigger(numberId);
        };

        return (
          <Controller
            key={numberId}
            name={numberId}
            control={control}
            defaultValue=""
            rules={{
              validate: numberValidation,
              required: t("numberError"),
            }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                variant="filled"
                margin={formFieldMargin}
                label={t("number")}
                value={number}
                InputLabelProps={{
                  sx: { color: "text.primary" },
                }}
                error={!!errors.number}
                helperText={
                  errors.number ? (errors.number.message as string) : ""
                }
                onChange={async (event) =>
                  await handleNumberChange(event, field)
                }
              />
            )}
          />
        );
      };

      return (
        <Grid container spacing={2}>
          <Grid item xs={countryCodeWidth}>
            {countryCodeField()}
          </Grid>
          <Grid item xs={numberWidth}>
            {numberField()}
          </Grid>
        </Grid>
      );
    };

    const nextButton = () => {
      const buttonWidth: string = "30%";

      const handleClick = async () => {
        const isCountryValid = await trigger(countryId);
        const isNumberValid = await trigger(numberId);

        if (isCountryValid && isNumberValid) setStepNumber(2);
      };

      return (
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ my: formMargin, maxWidth: buttonWidth, ml: "auto" }}
          onClick={handleClick}
        >
          <Text
            text={t("next")}
            variant={TypographyVariant.button}
            bold={false}
          />
        </Button>
      );
    };

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {countryField()}
        {phoneNumberSection()}
        <PrivacyPolicyLink />
        {nextButton()}
      </Box>
    );
  };

  const step2 = () => {
    const emailField = () => {
      const emailValidation = (emailInput: string) => {
        const isValid = isValidEmail(emailInput);
        return isValid ? true : t("emailError");
      };

      const handleEmailChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<SignUpFormData, "email">,
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
              fullWidth
              variant="filled"
              margin={formFieldMargin}
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

    const passwordField = () => {
      const [showPassword, setShowPassword] = useState<boolean>(false);

      const handleClickShowPassword = () => setShowPassword(!showPassword);

      const passwordValidation = (passwordInput: string) => {
        const isValid = isValidPassword(passwordInput);
        return isValid ? true : t("passwordError");
      };

      const handlePasswordChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<SignUpFormData, "password">,
      ) => {
        field.onChange(event.target.value);
        await trigger(passwordId);

        if (reEnterPassword) await trigger(reEnterPasswordId);
      };

      return (
        <Controller
          key={passwordId}
          name={passwordId}
          control={control}
          defaultValue=""
          rules={{
            validate: passwordValidation,
            required: t("passwordError"),
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              variant="filled"
              margin={formFieldMargin}
              label={t("password")}
              value={password}
              InputLabelProps={{
                sx: { color: "text.primary" },
              }}
              error={!!errors.password}
              helperText={
                errors.password ? (errors.password.message as string) : ""
              }
              onChange={async (event) =>
                await handlePasswordChange(event, field)
              }
              FormHelperTextProps={{ sx: { whiteSpace: "pre-line" } }} // ensures that newline characters (\n) are rendered as actual line breaks
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      );
    };

    const reEnterPasswordField = () => {
      const [showReEnterPassword, setShowReEnterPassword] =
        useState<boolean>(false);

      const handleClickShowReEnterPassword = () =>
        setShowReEnterPassword(!showReEnterPassword);

      const reEnterPasswordValidation = (reEnterPasswordInput: string) => {
        const isValid =
          reEnterPasswordInput === password &&
          isValidPassword(reEnterPasswordInput);
        return isValid ? true : t("reEnterPasswordError");
      };

      const handleReEnterPasswordChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<SignUpFormData, "reEnterPassword">,
      ) => {
        field.onChange(event.target.value);
        await trigger(reEnterPasswordId);
      };

      return (
        <Controller
          key={reEnterPasswordId}
          name={reEnterPasswordId}
          control={control}
          defaultValue=""
          rules={{
            validate: reEnterPasswordValidation,
            required: t("reEnterPasswordError"),
          }}
          disabled={!isValidPassword(password)}
          render={({ field }) => (
            <TextField
              {...field}
              type={showReEnterPassword ? "text" : "password"}
              required
              fullWidth
              variant="filled"
              margin={formFieldMargin}
              label={t("reEnterPassword")}
              value={reEnterPassword}
              InputLabelProps={{
                sx: { color: "text.primary" },
              }}
              error={!!errors.reEnterPassword}
              helperText={
                errors.reEnterPassword
                  ? (errors.reEnterPassword.message as string)
                  : ""
              }
              onChange={async (event) =>
                await handleReEnterPasswordChange(event, field)
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowReEnterPassword}
                      edge="end"
                    >
                      {showReEnterPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      );
    };

    const backButton = () => {
      const buttonWidth: string = "30%";

      const handleClick = async () => {
        setStepNumber(1);
      };

      return (
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ my: formMargin, maxWidth: buttonWidth }}
          onClick={handleClick}
        >
          <Text
            text={t("back")}
            variant={TypographyVariant.button}
            bold={false}
          />
        </Button>
      );
    };

    const signUpButton = () => {
      const buttonWidth: string = "30%";
      const loadingAnimationSize: number = 24;

      const handleOnClick = async () => {
        const isEmailValid = await trigger(emailId);
        const isPasswordValid = await trigger(passwordId);
        const isReEnterPasswordValid = await trigger(reEnterPasswordId);

        if (!isEmailValid || !isPasswordValid || !isReEnterPasswordValid)
          return;

        setIsSigningUp(true);
        setAlertText("");
        setShowAlert(false);
        const data = {
          email,
        };

        try {
          await generateVerificationCode.mutateAsync(data);
        } catch (error) {
          if (error instanceof TRPCClientError) {
            setAlertText(error.message ?? t("signUpErrorAlert"));
            setAlertType(AlertType.error);
            setShowAlert(true);
          }
        } finally {
          setIsSigningUp(false);
        }
      };

      return (
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ my: formMargin, maxWidth: buttonWidth }}
          color="secondary"
          disabled={isSigningUp}
          onClick={handleOnClick}
        >
          {isSigningUp ? (
            <CircularProgress size={loadingAnimationSize} />
          ) : (
            <Text
              text={t("signUp")}
              variant={TypographyVariant.button}
              bold={false}
            />
          )}
        </Button>
      );
    };

    return (
      <Box>
        {emailField()}
        {passwordField()}
        {reEnterPasswordField()}
        <PrivacyPolicyLink />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {backButton()}
          {signUpButton()}
        </Box>
      </Box>
    );
  };

  const step3 = () => {
    const verificationCodeField = () => {
      return (
        <Controller
          key={verificationCodeId}
          name={verificationCodeId}
          control={control}
          defaultValue=""
          rules={{
            required: t(
              "emailVerification.emailVerificationForm.verificationCodeError",
            ),
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              fullWidth
              variant="filled"
              margin={formFieldMargin}
              label={t(
                "emailVerification.emailVerificationForm.verificationCode",
              )}
              value={verificationCode}
              InputLabelProps={{
                sx: { color: "text.primary" },
              }}
              error={!!errors.verificationCode}
              helperText={
                errors.verificationCode
                  ? (errors.verificationCode.message as string)
                  : ""
              }
            />
          )}
        />
      );
    };

    const verifyButton = () => {
      const buttonWidth: string = "30%";
      const loadingAnimationSize: number = 24;

      const handleClick = async () => {
        const isVerificationCodeValid = await trigger(verificationCodeId);

        if (!isVerificationCodeValid) return;

        setIsVerifying(true);
        setAlertText("");
        setShowAlert(false);
        const data = {
          country,
          countryCode,
          number,
          email,
          password,
          verificationCode,
        };

        try {
          await verifyVerificationCode.mutateAsync(data);
        } catch (error) {
          if (error instanceof TRPCClientError) {
            setAlertText(error.message ?? t("signUpErrorAlert"));
            setAlertType(AlertType.error);
            setShowAlert(true);
            setIsSigningUp(false);
          }
        } finally {
          setIsVerifying(false);
        }
      };

      return (
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ my: formMargin, maxWidth: buttonWidth, ml: "auto" }}
          color="primary"
          disabled={isVerifying}
          onClick={handleClick}
        >
          {isVerifying ? (
            <CircularProgress size={loadingAnimationSize} />
          ) : (
            <Text
              text={t("emailVerification.emailVerificationForm.verify")}
              variant={TypographyVariant.button}
              bold={false}
            />
          )}
        </Button>
      );
    };

    return (
      <Box>
        {verificationCodeField()}
        <Box display="flex" justifyContent="flex-end">
          {verifyButton()}
        </Box>
      </Box>
    );
  };

  return (
    <Box component="form" noValidate marginTop={formMargin}>
      <Collapse in={stepNumber === 1} timeout={pageTransitionDuration}>
        {step1()}
      </Collapse>
      <Collapse in={stepNumber === 2} timeout={pageTransitionDuration}>
        {step2()}
      </Collapse>
      <Collapse in={stepNumber === 3} timeout={pageTransitionDuration}>
        {step3()}
      </Collapse>
      <Alert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        alertType={alertType}
        alertText={alertText}
      />
      <OrDivider formMargin={formMargin} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ContinueWithGoogleButton formMargin={formMargin} />
      </Box>
    </Box>
  );
};

export default SignUpForm;
