import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useAccount } from "@/hooks/useAccount";

const UserName = () => {
  const { name } = useAccount();

  return name ? (
    <Text text={name} variant={TypographyVariant.h4} bold={false} />
  ) : (
    <></>
  );
};

export default UserName;
