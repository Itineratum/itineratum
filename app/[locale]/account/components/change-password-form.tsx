"use client";

import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { ChangePasswordFormData } from "@/constants/types/accountPersonalInformationData";
import { isValidPassword } from "@/utils/signUpFormValidation";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
} from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";

const ChangePasswordForm = ({
  setIsChangePassword,
  setAccountPersonalInformationAlertText,
  setAccountPersonalInformationAlertType,
  setAccountPersonalInformationShowAlert,
}: {
  setIsChangePassword: Dispatch<SetStateAction<boolean>>;
  setAccountPersonalInformationAlertText: Dispatch<SetStateAction<string>>;
  setAccountPersonalInformationAlertType: Dispatch<SetStateAction<AlertType>>;
  setAccountPersonalInformationShowAlert: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations("account.personalInformation.changePassword");
  const router = useRouter();
  const { data: session } = useSession();
  const {
    control,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useForm<ChangePasswordFormData>();

  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);

  const formMargin: number = 2;
  const formFieldMargin: "dense" | "normal" | "none" | undefined = "normal";
  const fieldSpacing: number = 2;
  const textFieldSx = {
    "& .MuiInputBase-input": {
      padding: "10px",
    },
  };

  const currentPasswordId = "currentPassword";
  const newPasswordId = "newPassword";
  const reEnterNewPasswordId = "reEnterNewPassword";

  const currentPassword = watch(currentPasswordId);
  const newPassword = watch(newPasswordId);
  const reEnterNewPassword = watch(reEnterNewPasswordId);

  const cancelChangePassword = () => {
    setValue(currentPasswordId, "");
    setValue(newPasswordId, "");
    setValue(reEnterNewPasswordId, "");
    setIsChangePassword(false); // hide the change password form
  };

  const changeUserPassword = trpc.user.changeUserPassword.useMutation({
    onSuccess: () => {
      cancelChangePassword();
      setAccountPersonalInformationAlertText(t("passwordChangeSuccess"));
      setAccountPersonalInformationAlertType(AlertType.success);
      setAccountPersonalInformationShowAlert(true);
    },
    onError: (error) => {
      if (error.message === "UNAUTHORIZED") router.push("/protected");
    },
  });

  const title = () => {
    return (
      <Text
        text={t("changePassword")}
        variant={TypographyVariant.h5}
        bold={false}
      />
    );
  };

  const fields = () => {
    const fieldSpacing: number = 2;

    const CurrentPasswordField = () => {
      const [showCurrentPassword, setShowCurrentPassword] =
        useState<boolean>(false);

      const handleClickShowCurrentPassword = () =>
        setShowCurrentPassword(!showCurrentPassword);

      const handleCurrentPasswordChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<ChangePasswordFormData, "currentPassword">,
      ) => {
        field.onChange(event.target.value);
        await trigger(currentPasswordId);
      };

      return (
        <Box>
          <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
            {t("currentPassword")}
          </InputLabel>
          <Controller
            key={currentPasswordId}
            name={currentPasswordId}
            control={control}
            defaultValue=""
            rules={{ required: t("currentPasswordError") }}
            render={({ field }) => (
              <TextField
                {...field}
                type={showCurrentPassword ? "text" : "password"}
                required
                fullWidth
                variant="filled"
                margin={formFieldMargin}
                value={currentPassword}
                sx={textFieldSx}
                error={!!errors.currentPassword}
                helperText={
                  errors.currentPassword
                    ? (errors.currentPassword.message as string)
                    : ""
                }
                onChange={async (event) =>
                  await handleCurrentPasswordChange(event, field)
                }
                FormHelperTextProps={{ sx: { whiteSpace: "pre-line" } }} // ensures that newline characters (\n) are rendered as actual line breaks
                InputLabelProps={{
                  sx: { color: "text.primary" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowCurrentPassword}
                        edge="end"
                      >
                        {showCurrentPassword ? (
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
        </Box>
      );
    };

    const NewPasswordField = () => {
      const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

      const handleClickShowNewPassword = () =>
        setShowNewPassword(!showNewPassword);

      const newPasswordValidation = (newPasswordInput: string) => {
        const isValid = isValidPassword(newPasswordInput);
        return isValid ? true : t("newPasswordError");
      };

      const handleNewPasswordChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<ChangePasswordFormData, "newPassword">,
      ) => {
        field.onChange(event.target.value);
        await trigger(newPasswordId);

        if (reEnterNewPassword) await trigger(reEnterNewPasswordId);
      };

      return (
        <Box>
          <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
            {t("newPassword")}
          </InputLabel>
          <Controller
            key={newPasswordId}
            name={newPasswordId}
            control={control}
            defaultValue=""
            rules={{
              validate: newPasswordValidation,
              required: t("newPasswordError"),
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type={showNewPassword ? "text" : "password"}
                required
                fullWidth
                variant="filled"
                margin={formFieldMargin}
                value={newPassword}
                sx={textFieldSx}
                error={!!errors.newPassword}
                helperText={
                  errors.newPassword
                    ? (errors.newPassword.message as string)
                    : ""
                }
                onChange={async (event) =>
                  await handleNewPasswordChange(event, field)
                }
                FormHelperTextProps={{ sx: { whiteSpace: "pre-line" } }} // ensures that newline characters (\n) are rendered as actual line breaks
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowNewPassword}
                        edge="end"
                      >
                        {showNewPassword ? (
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
        </Box>
      );
    };

    const ReEnterNewPasswordField = () => {
      const [showReEnterNewPassword, setShowReEnterNewPassword] =
        useState<boolean>(false);

      const handleClickShowReEnterNewPassword = () =>
        setShowReEnterNewPassword(!showReEnterNewPassword);

      const reEnterNewPasswordValidation = (
        reEnterNewPasswordInput: string,
      ) => {
        const isValid =
          reEnterNewPasswordInput === newPassword &&
          isValidPassword(reEnterNewPasswordInput);
        return isValid ? true : t("reEnterNewPasswordError");
      };

      const handleReEnterNewPasswordChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: ControllerRenderProps<
          ChangePasswordFormData,
          "reEnterNewPassword"
        >,
      ) => {
        field.onChange(event.target.value);
        await trigger(reEnterNewPasswordId);
      };

      return (
        <Box>
          <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
            {t("reEnterNewPassword")}
          </InputLabel>
          <Controller
            key={reEnterNewPasswordId}
            name={reEnterNewPasswordId}
            control={control}
            defaultValue=""
            rules={{
              validate: reEnterNewPasswordValidation,
              required: t("reEnterNewPasswordError"),
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type={showReEnterNewPassword ? "text" : "password"}
                required
                fullWidth
                variant="filled"
                margin={formFieldMargin}
                value={reEnterNewPassword}
                sx={textFieldSx}
                error={!!errors.reEnterNewPassword}
                helperText={
                  errors.reEnterNewPassword
                    ? (errors.reEnterNewPassword.message as string)
                    : ""
                }
                onChange={async (event) =>
                  await handleReEnterNewPasswordChange(event, field)
                }
                FormHelperTextProps={{ sx: { whiteSpace: "pre-line" } }} // ensures that newline characters (\n) are rendered as actual line breaks
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowReEnterNewPassword}
                        edge="end"
                      >
                        {showReEnterNewPassword ? (
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
        </Box>
      );
    };

    return (
      <Stack spacing={fieldSpacing}>
        {CurrentPasswordField()}
        {NewPasswordField()}
        {ReEnterNewPasswordField()}
      </Stack>
    );
  };

  const actionButtons = () => {
    const buttonSpacing: number = 2;
    const buttonWidth: string = "100%";

    const cancelButton = () => {
      const handleOnClick = () => {
        cancelChangePassword();
      };

      return (
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ my: formMargin, maxWidth: buttonWidth }}
          color="primary"
          disabled={isChangingPassword}
          onClick={handleOnClick}
        >
          <Text
            text={t("cancel")}
            variant={TypographyVariant.button}
            bold={false}
          />
        </Button>
      );
    };

    const updateButton = () => {
      const loadingAnimationSize: number = 24;

      const handleOnClick = async () => {
        const isCurrentPasswordValid = await trigger(currentPasswordId);
        const isNewPasswordValid = await trigger(newPasswordId);
        const isReEnterNewPasswordValid = await trigger(reEnterNewPasswordId);

        if (
          !isCurrentPasswordValid ||
          !isNewPasswordValid ||
          !isReEnterNewPasswordValid
        )
          return;

        if (currentPassword === newPassword) {
          setAlertText(t("samePasswordError"));
          setAlertType(AlertType.error);
          setShowAlert(true);
          return;
        }

        setIsChangingPassword(true);
        setAlertText("");
        setShowAlert(false);
        const email = session?.user.email!;
        const data = {
          email,
          currentPassword,
          newPassword,
        };

        try {
          await changeUserPassword.mutateAsync(data);
        } catch (error) {
          if (error instanceof TRPCClientError) {
            setAlertType(AlertType.error);
            setAlertText(error.message);
            setShowAlert(true);
          }
        } finally {
          setIsChangingPassword(false);
        }
      };

      return (
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ my: formMargin, maxWidth: buttonWidth }}
          color="secondary"
          disabled={isChangingPassword}
          onClick={handleOnClick}
        >
          {isChangingPassword ? (
            <CircularProgress size={loadingAnimationSize} />
          ) : (
            <Text
              text={t("update")}
              variant={TypographyVariant.button}
              bold={false}
            />
          )}
        </Button>
      );
    };

    return (
      <Box display="flex" justifyContent="flex-end">
        <Stack direction="row" spacing={buttonSpacing}>
          {cancelButton()}
          {updateButton()}
        </Stack>
      </Box>
    );
  };

  return (
    <Box component="form" noValidate>
      <Stack spacing={fieldSpacing}>
        {title()}
        {fields()}
        {actionButtons()}
        <Alert
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          alertType={alertType}
          alertText={alertText}
        />
      </Stack>
    </Box>
  );
};

export default ChangePasswordForm;
