import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import { Box, Button, Collapse } from "@mui/material";
import { useTranslations } from "next-intl";
import { ACCOUNT_PERFONAL_INFORMATION_STYLES } from "../styles";
import ChangePasswordForm from "./change-password-form/change-password-form";
import { ChangePasswordProvider } from "@/contexts/changePasswordContext";

const ChangePasswordButton = () => {
  const { setIsChangePassword, isChangePassword, isUpdating } =
    usePersonalInformation();
  const t = useTranslations("account.personalInformation");

  const styles = ACCOUNT_PERFONAL_INFORMATION_STYLES;

  const handleOnClick = () => {
    setIsChangePassword(true);
  };

  return (
    <Box>
      <Collapse
        in={isChangePassword}
        timeout={styles.CHANGE_PASSWORD_BUTTON.TRANSITION_DURATION}
      >
        <ChangePasswordProvider>
          <ChangePasswordForm />
        </ChangePasswordProvider>
      </Collapse>
      <Collapse
        in={!isChangePassword}
        timeout={styles.CHANGE_PASSWORD_BUTTON.TRANSITION_DURATION}
      >
        <Box display="flex" justifyContent="flex-end">
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{
              my: styles.FORM_MARGIN,
              maxWidth: styles.CHANGE_PASSWORD_BUTTON.BUTTON_WIDTH,
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
      </Collapse>
    </Box>
  );
};

export default ChangePasswordButton;
