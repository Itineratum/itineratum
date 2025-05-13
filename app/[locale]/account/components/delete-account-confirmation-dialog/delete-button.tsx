import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import { Button, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ACCOUNT_PERSONAL_INFORMATION_STYLES } from "../personal-information/styles";

const DeleteButton = () => {
  const { deleteAccount } = usePersonalInformation();

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const t = useTranslations("account.personalInformation.deleteAccountDialog");
  const styles = ACCOUNT_PERSONAL_INFORMATION_STYLES.DELETE_ACCOUNT_DIALOG;

  const handleOnClick = () => {
    setIsDeleting(true);
    deleteAccount();
  };

  return (
    <Button onClick={handleOnClick} variant="contained" color="secondary">
      {isDeleting ? (
        <CircularProgress size={styles.LOADING_ANIMATION_SIZE} />
      ) : (
        <Text
          text={t("deleteButton")}
          variant={TypographyVariant.button}
          bold={false}
        />
      )}
    </Button>
  );
};

export default DeleteButton;
