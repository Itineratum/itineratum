"use client";

import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import { Box, Grid } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect } from "react";
import DeleteAccountConfirmationDialog from "../delete-account-confirmation-dialog/delete-account-confirmation-dialog";
import BreadcrumbNavigator from "./breadcrumb-navigator/breadcrumb-navigator";
import LeftColumn from "./left-column/left-column";
import RightColumn from "./right-column/right-column";
import { ACCOUNT_PERSONAL_INFORMATION_STYLES } from "./styles";
dayjs.extend(utc);

const PersonalInformation = ({}: {}) => {
  const styles = ACCOUNT_PERSONAL_INFORMATION_STYLES;

  const { getUserAccountDetails, setValue } = usePersonalInformation();

  useEffect(() => {
    if (getUserAccountDetails.data) {
      const userDetails = getUserAccountDetails.data;

      setValue("firstName", userDetails.firstName);
      setValue("lastName", userDetails.lastName);
      setValue("email", userDetails.email);
      setValue("address1", userDetails.address1);
      setValue("address2", userDetails.address2);

      if (userDetails.dateOfBirth) {
        const utcDate = dayjs(userDetails.dateOfBirth).utc(true);
        setValue("dateOfBirth", utcDate);
      }
    }
  }, [getUserAccountDetails.data]);

  return (
    <Box component="form" noValidate marginY={styles.MARGIN}>
      <BreadcrumbNavigator />
      <Grid container spacing={styles.COLUMN_SPACING}>
        <LeftColumn />
        <RightColumn />
      </Grid>
      <DeleteAccountConfirmationDialog />
    </Box>
  );
};

export default PersonalInformation;
