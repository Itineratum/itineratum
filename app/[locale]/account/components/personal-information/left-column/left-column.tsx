import { AuthService } from "@/constants/enums/authService";
import { Grid, Stack } from "@mui/material";
import { ACCOUNT_PERFONAL_INFORMATION_STYLES } from "../styles";
import { useAccount } from "@/hooks/useAccount";
import UserAvatarField from "./user-avatar-field";
import NameSection from "./name-section";
import EmailField from "./email-field";
import ChangePasswordButton from "./change-password-button";

const LeftColumn = () => {
  const { session } = useAccount();

  const styles = ACCOUNT_PERFONAL_INFORMATION_STYLES;

  return (
    <Grid item xs={12} md={6}>
      <Stack spacing={styles.FIELD_SPACING} useFlexGap>
        <UserAvatarField />
        <NameSection />
        <EmailField />
        {session?.provider === AuthService.Credentials ? (
          <ChangePasswordButton />
        ) : null}
      </Stack>
    </Grid>
  );
};

export default LeftColumn;
