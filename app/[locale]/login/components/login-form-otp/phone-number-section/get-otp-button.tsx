import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { useLoginOtp } from "@/hooks/useLoginOtp";
import { Button } from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { useTranslations } from "next-intl";

const GetOtpButton = () => {
  const { trigger, countryCode, number, loginViaOtp } = useLoginOtp();

  const t = useTranslations("login.loginForm");

  const handleClick = async () => {
    // TODO: set up login with OTP in the future?

    const isNumberValid = await trigger("number");

    if (isNumberValid) {
      const phoneNumber = `${countryCode}${number}`;
      const data = {
        phoneNumber,
      };

      try {
        await loginViaOtp.mutateAsync(data);
      } catch (error) {
        if (error instanceof TRPCClientError) {
        }
      } finally {
      }
    }
  };

  return (
    <Button
      type="button"
      fullWidth
      variant="contained"
      sx={{ whiteSpace: "nowrap" }}
      color="secondary"
      onClick={handleClick}
    >
      <Text
        text={t("getOtp")}
        variant={TypographyVariant.button}
        bold={false}
      />
    </Button>
  );
};

export default GetOtpButton;
