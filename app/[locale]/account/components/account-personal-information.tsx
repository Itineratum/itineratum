"use client";

import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import UserAvatar from "@/components/molecules/user-avatar";
import { AccountSetting } from "@/constants/enums/accountSetting";
import { AlertType } from "@/constants/enums/alertType";
import { AuthService } from "@/constants/enums/authService";
import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import { AccountPersonalInformationFormData } from "@/constants/types/accountPersonalInformationData";
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Collapse,
  Grid,
  InputLabel,
  Stack,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { TRPCClientError } from "@trpc/client";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ChangePasswordForm from "./change-password-form";
import DeleteAccountConfirmationDialog from "./delete-account-confirmation-dialog";
dayjs.extend(utc);

const AccountPersonalInformation = ({
  accountSetting,
  setAccountSetting,
}: {
  accountSetting: AccountSetting;
  setAccountSetting: Dispatch<SetStateAction<AccountSetting>>;
}) => {
  const t = useTranslations("account.personalInformation");
  const { data: session, update } = useSession();
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AccountPersonalInformationFormData>();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showConfirmDeleteDialog, setShowConformDeleteDialog] =
    useState<boolean>(false);
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);

  const columnSpacing: number = 7;
  const margin: number = 5;
  const formMargin: number = 2;
  const formFieldMargin: "dense" | "normal" | "none" | undefined = "normal";
  const fieldSpacing: number = 2;
  const columnSx: number = 12 / 2;
  const textFieldSx = {
    "& .MuiInputBase-input": {
      padding: "10px",
    },
  };

  const firstNameId = "firstName";
  const lastNameId = "lastName";
  const emailId = "email";
  const address1Id = "address1";
  const address2Id = "address2";
  const dateOfBirthId = "dateOfBirth";

  const firstName = watch(firstNameId);
  const lastName = watch(lastNameId);
  const email = watch(emailId);
  const address1 = watch(address1Id);
  const address2 = watch(address2Id);
  const dateOfBirth = watch(dateOfBirthId);

  const getUserAccountDetails = trpc.user.getUserAccountDetails.useQuery({
    email: session?.user.email!,
  });
  const deleteUserAccount = trpc.user.deleteUserAccount.useMutation();
  const updateUserAccount = trpc.user.updateUserAccount.useMutation({
    onSuccess: () => {
      // update the session
      update({ name: firstName });
    },
  });

  useEffect(() => {
    if (getUserAccountDetails.data) {
      const userDetails = getUserAccountDetails.data;

      setValue(firstNameId, userDetails.firstName);
      setValue(lastNameId, userDetails.lastName);
      setValue(emailId, userDetails.email);
      setValue(address1Id, userDetails.address1);
      setValue(address2Id, userDetails.address2);

      if (userDetails.dateOfBirth) {
        const utcDate = dayjs(userDetails.dateOfBirth).utc(true);
        setValue(dateOfBirthId, utcDate);
      }
    }
  }, [getUserAccountDetails.data]);

  const closeConfirmDeleteDialog = () => {
    setShowConformDeleteDialog(false);
  };
  const deleteAccount = async () => {
    const data = { email };
    await deleteUserAccount.mutateAsync(data);
    signOut({ callbackUrl: "/" });
  };

  const breadcrumbNavigator = () => {
    const accountButton = () => {
      const accountOnClickHandler = () => {
        // go back to account base page
        setAccountSetting(AccountSetting.base);
      };

      return (
        <Button
          sx={{
            color:
              accountSetting === AccountSetting.base
                ? colorsConst.breadcrumbNavigator.selected
                : colorsConst.breadcrumbNavigator.unselected,
          }}
          onClick={accountOnClickHandler}
        >
          <Text
            text={t("account")}
            variant={TypographyVariant.h5}
            bold={false}
          />
        </Button>
      );
    };
    const personalInformationButton = () => {
      return (
        <Button
          sx={{
            color:
              accountSetting === AccountSetting.personalInformation
                ? colorsConst.breadcrumbNavigator.selected
                : colorsConst.breadcrumbNavigator.unselected,
          }}
        >
          <Text
            text={t("personalInformation")}
            variant={TypographyVariant.h5}
            bold={false}
          />
        </Button>
      );
    };

    return (
      <Breadcrumbs separator=" > ">
        {accountButton()}
        {personalInformationButton()}
      </Breadcrumbs>
    );
  };
  const leftColumn = () => {
    const userAvatarField = () => {
      return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <UserAvatar editable={true} />
        </Box>
      );
    };
    const nameSection = () => {
      const firstNameField = () => {
        return (
          <Box width="100%">
            <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
              {t("firstName")}
            </InputLabel>
            <Controller
              key={firstNameId}
              name={firstNameId}
              control={control}
              defaultValue=""
              rules={{
                required: t("firstNameError"),
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="filled"
                  margin={formFieldMargin}
                  value={firstName}
                  sx={textFieldSx}
                  error={!!errors.firstName}
                  helperText={
                    errors.firstName ? (errors.firstName.message as string) : ""
                  }
                />
              )}
            />
          </Box>
        );
      };

      const lastNameField = () => {
        return (
          <Box width="100%">
            <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
              {t("lastName")}
            </InputLabel>
            <Controller
              key={lastNameId}
              name={lastNameId}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="filled"
                  margin={formFieldMargin}
                  value={lastName}
                  sx={textFieldSx}
                />
              )}
            />
          </Box>
        );
      };

      return (
        <Stack direction={"row"} spacing={fieldSpacing}>
          {firstNameField()}
          {lastNameField()}
        </Stack>
      );
    };
    const emailField = () => {
      return (
        <Box>
          <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
            {t("email")}
          </InputLabel>
          <Controller
            key={emailId}
            name={emailId}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                variant="filled"
                margin={formFieldMargin}
                value={email}
                sx={textFieldSx}
                disabled
              />
            )}
          />
        </Box>
      );
    };
    const changePasswordButton = () => {
      const buttonWidth: string = "50%";
      const transitionDuration: number = 500;

      const handleOnClick = () => {
        setIsChangePassword(true);
      };

      const button = () => {
        return (
          <Box display="flex" justifyContent="flex-end">
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{
                my: formMargin,
                maxWidth: buttonWidth,
                alignSelf: "center",
              }}
              color="primary"
              disabled={isUpdating}
              onClick={handleOnClick}
            >
              <Text
                text={t("changePasswordButton")}
                variant={TypographyVariant.button}
                bold={false}
              />
            </Button>
          </Box>
        );
      };

      return (
        <Box>
          <Collapse in={isChangePassword} timeout={transitionDuration}>
            <ChangePasswordForm
              setIsChangePassword={setIsChangePassword}
              setAccountPersonalInformationAlertText={setAlertText}
              setAccountPersonalInformationAlertType={setAlertType}
              setAccountPersonalInformationShowAlert={setShowAlert}
            />
          </Collapse>
          <Collapse in={!isChangePassword} timeout={transitionDuration}>
            {button()}
          </Collapse>
        </Box>
      );
    };

    return (
      <Grid item xs={columnSx}>
        <Stack spacing={fieldSpacing} useFlexGap>
          {userAvatarField()}
          {nameSection()}
          {emailField()}
          {session?.provider === AuthService.Credentials ? (
            changePasswordButton()
          ) : (
            <></>
          )}
        </Stack>
      </Grid>
    );
  };
  const rightColumn = () => {
    const addressSection = () => {
      const address1Field = () => {
        return (
          <Box>
            <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
              {t("address1")}
            </InputLabel>
            <Controller
              key={address1Id}
              name={address1Id}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="filled"
                  margin={formFieldMargin}
                  value={address1}
                  sx={textFieldSx}
                />
              )}
            />
          </Box>
        );
      };

      const address2Field = () => {
        return (
          <Box>
            <InputLabel sx={{ color: colorsConst.palette.text.primary }}>
              {t("address2")}
            </InputLabel>
            <Controller
              key={address2Id}
              name={address2Id}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="filled"
                  margin={formFieldMargin}
                  value={address2}
                  sx={textFieldSx}
                />
              )}
            />
          </Box>
        );
      };

      return (
        <Stack spacing={fieldSpacing}>
          {address1Field()}
          {address2Field()}
        </Stack>
      );
    };
    const dateOfBirthField = () => {
      const dateFormat: string = "DD/MM/YYYY";

      return (
        <Box>
          <InputLabel
            sx={{
              color: colorsConst.palette.text.primary,
              marginBottom: formMargin,
            }}
          >
            {t("dob")}
          </InputLabel>
          <Controller
            key={dateOfBirthId}
            name={dateOfBirthId}
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  {...field}
                  format={dateFormat}
                  sx={{ width: "100%" }}
                  value={dateOfBirth}
                  onChange={(date: Dayjs | null) => {
                    const utcDate = date
                      ? dayjs(date).utc(true).startOf("day")
                      : null;
                    field.onChange(utcDate);
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Box>
      );
    };
    const actionButtons = () => {
      const buttonWidth: string = "50%";
      const loadingAnimationSize: number = 24;

      const saveButton = () => {
        const handleOnClick = async () => {
          setIsUpdating(true);
          setAlertType(AlertType.success);
          setAlertText(t("accountUpdated"));
          setShowAlert(true);
          const data = {
            email,
            firstName,
            lastName,
            address1,
            address2,
            // this is to ensure that the MongoDB stores the date of birth as UTC, and this component will also display the date of birth as UTC
            dateOfBirth: dateOfBirth
              ? dateOfBirth.utc(true).startOf("day").toISOString()
              : undefined,
          };

          try {
            await updateUserAccount.mutateAsync(data);
          } catch (error) {
            if (error instanceof TRPCClientError) {
              setAlertType(AlertType.error);
              setAlertText(t("accountUpdateError"));
              setShowAlert(true);
            }
          } finally {
            setIsUpdating(false);
          }
        };

        return (
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ my: formMargin, maxWidth: buttonWidth, alignSelf: "center" }}
            color="secondary"
            disabled={isUpdating}
            onClick={handleOnClick}
          >
            {isUpdating ? (
              <CircularProgress size={loadingAnimationSize} />
            ) : (
              <Text
                text={t("saveAccount")}
                variant={TypographyVariant.button}
                bold={false}
              />
            )}
          </Button>
        );
      };

      const deleteAccountButton = () => {
        const handleOnClick = async () => {
          setShowConformDeleteDialog(true);
        };

        return (
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ my: formMargin, maxWidth: buttonWidth, alignSelf: "center" }}
            color="primary"
            disabled={isUpdating}
            onClick={handleOnClick}
          >
            <Text
              text={t("deleteAccount")}
              variant={TypographyVariant.button}
              bold={false}
            />
          </Button>
        );
      };

      return (
        <Stack direction={"row"} spacing={fieldSpacing} useFlexGap>
          {saveButton()}
          {deleteAccountButton()}
        </Stack>
      );
    };

    return (
      <Grid item xs={columnSx}>
        <Stack spacing={fieldSpacing} useFlexGap>
          {addressSection()}
          {dateOfBirthField()}
          {actionButtons()}
          <Alert
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            alertType={alertType}
            alertText={alertText}
          />
        </Stack>
      </Grid>
    );
  };

  return (
    <Box component="form" noValidate marginY={margin}>
      {breadcrumbNavigator()}
      <Grid container spacing={columnSpacing}>
        {leftColumn()}
        {rightColumn()}
      </Grid>
      <DeleteAccountConfirmationDialog
        open={showConfirmDeleteDialog}
        handleClose={closeConfirmDeleteDialog}
        deleteAccount={deleteAccount}
      />
    </Box>
  );
};

export default AccountPersonalInformation;
