import { TypographyVariant } from "@/constants/enums/theme";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { ClientUploadedFileData } from "uploadthing/types";
import Text from "../atoms/text";

const TakeAPhotoDialog = ({
  open,
  handleClose,
  webcamStreamRef,
  canvasRef,
  imageFileType,
  imageName,
  startUpload,
  setIsTakingPhoto,
}: TakeAPhotoDialogType) => {
  const t = useTranslations("account.personalInformation.takePhotoDialog");

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
  const webcamStream = () => {
    const size = "100%";

    return <video ref={webcamStreamRef} width={size} height={size} />;
  };
  const capturePhotoButton = () => {
    const handleOnClick = () => {
      if (webcamStreamRef.current && canvasRef.current) {
        // context is needed for drawing an image from the webcam stream onto the canvas
        const context = canvasRef.current.getContext("2d");

        if (context) {
          context.drawImage(
            webcamStreamRef.current,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
          );

          // after capturing the image from the webcam stream, stop the webcam stream and releases the webcam so it is no longer active
          (webcamStreamRef.current.srcObject as MediaStream)
            .getTracks()
            .forEach((track) => track.stop());

          const imageDataUrl = canvasRef.current.toDataURL(imageFileType);

          // convert imageDataUrl, which is currently a Blob object, to a file
          fetch(imageDataUrl)
            .then((res) => res.blob())
            .then((blob) => {
              const file = new File([blob], imageName, {
                type: imageFileType,
              });
              startUpload([file]);
            });
          setIsTakingPhoto(false);
        }
      }
    };

    return (
      <Button variant="contained" color="secondary" onClick={handleOnClick}>
        <Text
          text={t("capturePhotoButton")}
          variant={TypographyVariant.button}
          bold={false}
        />
      </Button>
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

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {t("title")}
        {closeButton()}
      </DialogTitle>
      <DialogContent>{webcamStream()}</DialogContent>
      <DialogActions>
        {cancelButton()}
        {capturePhotoButton()}
      </DialogActions>
    </Dialog>
  );
};

interface TakeAPhotoDialogType {
  open: boolean;
  handleClose: () => void;
  webcamStreamRef: MutableRefObject<HTMLVideoElement | null>;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  imageFileType: string;
  imageName: string;
  startUpload: (
    files: File[],
    input?: undefined,
  ) => Promise<
    | ClientUploadedFileData<{
        image: string;
      }>[]
    | undefined
  >;
  setIsTakingPhoto: Dispatch<SetStateAction<boolean>>;
}

export default TakeAPhotoDialog;
