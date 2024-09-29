import Image from "next/image";
import defaultUserImage from "@/public/user_profile.svg";

const UserAvatar = ({
  image,
  editable,
}: {
  image: string | undefined | null;
  editable: boolean;
}) => {
  const imageSize: number = 200;
  const topMargin: number = 40;
  const bottomMargin = topMargin;

  return (
    <Image
      src={image ? image : defaultUserImage}
      width={imageSize}
      height={imageSize}
      alt="User Profile Picture"
      style={{
        objectFit: "cover",
        borderRadius: imageSize / 2,
        marginTop: topMargin,
        marginBottom: bottomMargin,
      }}
    />
  );
};

export default UserAvatar;
