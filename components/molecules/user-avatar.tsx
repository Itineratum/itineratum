import { OurFileRouter } from "@/app/api/uploadthing/core";
import { AlertType } from "@/constants/enums/alertType";
import { TypographyVariant } from "@/constants/enums/theme";
import defaultUserImage from "@/public/user_profile.svg";
import { Box, CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import { generateReactHelpers } from "@uploadthing/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";
import Text from "../atoms/text";
import Alert from "./alert";
import TakeAPhotoDialog from "./take-a-photo-dialog";

const UserAvatar = ({ editable }: { editable: boolean }) => {
  const t = useTranslations("account.personalInformation");
  const { data: session, update } = useSession();

  const [isHovered, setIsHovered] = useState(false);
  const webcamStreamRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [alertText, setAlertText] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [image, setImage] = useState<string | null | undefined>(
    session?.user.image,
  );

  const email = session?.user.email;
  const fileType = "jpg";
  const imageFileType = `image/${fileType}`;
  const imageName = `${email}.${fileType}`;

  const imageSize: number = 250;
  const topMargin: number = 3;
  const bottomMargin = topMargin;
  const fileInputId = "fileInput";

  const { useUploadThing } = generateReactHelpers<OurFileRouter>();
  const { startUpload } = useUploadThing("imageUploader", {
    onBeforeUploadBegin: (files) => {
      setShowAlert(false);
      setIsUploading(true);

      // rename the image before uploading it
      return files.map(
        (file) => new File([file], imageName, { type: imageFileType }),
      );
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    onClientUploadComplete: (res) => {
      // update the session
      const newImage = res[0].url;
      update({ image: newImage });

      setImage(newImage);
      setAlertType(AlertType.success);
      setAlertText(t("profilePictureChangeSuccess"));
      setShowAlert(true);
      setIsUploading(false);
    },
    onUploadError: () => {
      setAlertType(AlertType.error);
      setAlertText(t("profilePictureChangeError"));
      setShowAlert(true);
      setIsUploading(false);
    },
  });
  const closeTakeAPhotoDialog = () => {
    if (webcamStreamRef.current && canvasRef.current) {
      (webcamStreamRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }

    setIsTakingPhoto(false);
  };

  const userImage = () => {
    const loadingAnimation = () => {
      return (
        <Box
          width={imageSize}
          height={imageSize}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress variant="determinate" value={uploadProgress} />
        </Box>
      );
    };
    return isUploading ? (
      loadingAnimation()
    ) : (
      <Image
        src={image ? image : defaultUserImage}
        width={imageSize}
        height={imageSize}
        alt="User Profile Picture"
        style={{
          objectFit: "cover",
          borderRadius: imageSize / 2,
        }}
      />
    );
  };
  const chooseFromLibraryButton = () => {
    const handleOnClick = () => {
      setShowAlert(false);
      setIsHovered(false);

      // Trigger file selection and upload
      document.getElementById(fileInputId)?.click();
    };

    return (
      <Button variant="contained" color="secondary" onClick={handleOnClick}>
        <Text
          text={t("chooseFromLibrary")}
          variant={TypographyVariant.subtitle2}
          bold={false}
        />
      </Button>
    );
  };
  const takeAPhotoButton = () => {
    const handleOnClick = async () => {
      setShowAlert(false);
      setIsHovered(false);
      setIsTakingPhoto(true);

      // checks for webcam support
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // tries to access the user's webcam stream
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });

          if (webcamStreamRef.current) {
            webcamStreamRef.current.srcObject = stream;
            webcamStreamRef.current.play();
          }
        } catch (error) {
          alert("Error accessing webcam");
          setIsTakingPhoto(false);
        }
      }
    };

    return (
      <Button variant="contained" color="secondary" onClick={handleOnClick}>
        <Text
          text={t("takePhoto")}
          variant={TypographyVariant.subtitle2}
          bold={false}
        />
      </Button>
    );
  };
  const hoverMenu = () => {
    const gapBetweenButtons = "10px";
    const backgroundColor = "rgba(0, 0, 0, 0.6)";

    return (
      isHovered &&
      editable &&
      !isTakingPhoto && (
        <Box
          position="absolute"
          bottom="0"
          // left="0"
          width={imageSize}
          height="50%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={gapBetweenButtons}
          bgcolor={backgroundColor}
          sx={{
            borderBottomLeftRadius: imageSize / 2,
            borderBottomRightRadius: imageSize / 2,
          }}
        >
          {chooseFromLibraryButton()}
          {takeAPhotoButton()}
        </Box>
      )
    );
  };
  const fileInput = () => {
    return (
      <input
        type="file"
        id={fileInputId}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files) {
            startUpload(Array.from(e.target.files));
          }
        }}
      />
    );
  };
  const canvas = () => {
    return (
      <canvas
        ref={canvasRef}
        width={imageSize}
        height={imageSize}
        style={{ display: "none" }}
      />
    );
  };

  return (
    <Box>
      <Box
        position="relative"
        display="flex"
        overflow="hidden"
        borderRadius="100%"
        justifyContent="center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsHovered((prev) => !prev)}
        sx={{
          marginTop: topMargin,
          marginBottom: bottomMargin,
        }}
      >
        {userImage()}
        {hoverMenu()}
        {fileInput()}
        {canvas()}
      </Box>
      <TakeAPhotoDialog
        open={isTakingPhoto}
        handleClose={closeTakeAPhotoDialog}
        webcamStreamRef={webcamStreamRef}
        canvasRef={canvasRef}
        imageFileType={imageFileType}
        imageName={imageName}
        startUpload={startUpload}
        setIsTakingPhoto={setIsTakingPhoto}
      />
      <Alert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        alertType={alertType}
        alertText={alertText}
      />
    </Box>
  );
};

export default UserAvatar;
