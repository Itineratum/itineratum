import { Stack } from "@mui/material";
import { ACCOUNT_BASE_STYLES } from "../styles";
import Header from "./header";
import PersonalInformation from "./personal-information";
import Accessibility from "./accessibility";
import Notifications from "./notifications";

const SettingsSection = () => {
  const style = ACCOUNT_BASE_STYLES;

  return (
    <Stack
      spacing={style.SPACING}
      sx={{
        textAlign: "center",
        marginTop: style.SECTION_MARTGIN,
      }}
    >
      <Header />
      <PersonalInformation />
      <Accessibility />
      <Notifications />
    </Stack>
  );
};

export default SettingsSection;
