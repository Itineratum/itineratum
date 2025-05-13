import { Breadcrumbs } from "@mui/material";
import AccountButton from "./account-button";
import PersonalInformationButton from "./personal-information-button";

const BreadcrumbNavigator = () => {
  return (
    <Breadcrumbs separator=" > ">
      <AccountButton />
      <PersonalInformationButton />
    </Breadcrumbs>
  );
};

export default BreadcrumbNavigator;
