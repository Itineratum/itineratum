import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useTranslations } from "next-intl";
import CancelButton from "./cancel-button";
import CloseButton from "./close-button";
import DeleteButton from "./delete-button";

const DeleteAccountConfirmationDialog = ({}: {}) => {
  const { showConfirmDeleteDialog, closeConfirmDeleteDialog } =
    usePersonalInformation();

  const t = useTranslations("account.personalInformation.deleteAccountDialog");

  return (
    <Dialog open={showConfirmDeleteDialog} onClose={closeConfirmDeleteDialog}>
      <DialogTitle>
        {t("title")}
        <CloseButton />
      </DialogTitle>
      <DialogContent>{t("content")}</DialogContent>
      <DialogActions>
        <CancelButton />
        <DeleteButton />
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountConfirmationDialog;
