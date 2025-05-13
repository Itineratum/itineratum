import { Breadcrumbs } from "@mui/material";
import AccountButton from "./account-button";
import NotificationsButton from "./notifications-button";

const BreadcrumbNavigator = () => {
  return (
    <Breadcrumbs separator=" > ">
      <AccountButton />
      <NotificationsButton />
    </Breadcrumbs>
  );
};

export default BreadcrumbNavigator;
