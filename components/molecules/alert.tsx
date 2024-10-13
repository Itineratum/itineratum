import { SetStateAction } from "react";
import { Alert as MaterialAlert } from "@mui/material";
import { AlertType } from "@/constants/enums/alertType";

const Alert = ({
  showAlert,
  setShowAlert,
  alertType = AlertType.info,
  alertText,
}: {
  showAlert: boolean;
  setShowAlert: (value: SetStateAction<boolean>) => void;
  alertType?: AlertType;
  alertText: string;
}) => {
  const handleOnClose = () => {
    setShowAlert(false);
  };

  return showAlert ? (
    <MaterialAlert severity={alertType} onClose={handleOnClose}>
      {alertText}
    </MaterialAlert>
  ) : (
    <></>
  );
};

export default Alert;
