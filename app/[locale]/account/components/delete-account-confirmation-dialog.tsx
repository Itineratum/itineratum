import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";

const DeleteAccountConfirmationDialog = ({
  open,
  handleClose,
  deleteAccount,
}: {
  open: boolean;
  handleClose: () => void;
  deleteAccount: () => void;
}) => {
  const t = useTranslations("account.personalInformation.deleteAccountDialog");

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const closeButton = () => {
    return (
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
    );
  };

  const cancelButton = () => {
    const handleOnClick = () => {
      handleClose();
    };

    return (
      <Button onClick={handleOnClick} variant="outlined">
        <Text
          text={t("cancelButton")}
          variant={TypographyVariant.button}
          bold={false}
        />
      </Button>
    );
  };

  const deleteButton = () => {
    const loadingAnimationSize: number = 24;

    const handleOnClick = () => {
      setIsDeleting(true);
      deleteAccount();
    };

    return (
      <Button onClick={handleOnClick} variant="contained" color="secondary">
        {isDeleting ? (
          <CircularProgress size={loadingAnimationSize} />
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

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {t("title")}
        {closeButton()}
      </DialogTitle>
      <DialogContent>{t("content")}</DialogContent>
      <DialogActions>
        {cancelButton()}
        {deleteButton()}
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountConfirmationDialog;
