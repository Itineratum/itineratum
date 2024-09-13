import { TypographyVariant } from "@/constants/enums/theme";
import { Box, Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import Text from "./text";

export const OrDivider = ({ formMargin }: { formMargin: number }) => {
  const t = useTranslations("signUp.signUpForm");

  const gapBetweenLines: number = 4;
  const lineThickness: number = 3;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        my: formMargin,
      }}
    >
      <Divider
        sx={{
          flexGrow: 1,
          borderBottomWidth: lineThickness,
          borderBottomColor: "text.primary",
        }}
      />
      <Box
        sx={{
          mx: gapBetweenLines,
          color: "text.primary",
          fontWeight: "bold",
        }}
      >
        <Text
          text={t("or")}
          variant={TypographyVariant.h3}
          bold={true}
        />
      </Box>
      <Divider
        sx={{
          flexGrow: 1,
          borderBottomWidth: lineThickness,
          borderBottomColor: "text.primary",
        }}
      />
    </Box>
  );
};
