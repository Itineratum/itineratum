import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import { Typography } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";

const Text = ({
  text,
  variant,
  bold,
  textDecoration = TypographyTextDecoration.none,
}: {
  text: string;
  variant: TypographyVariant;
  bold: boolean;
  textDecoration?: TypographyTextDecoration;
}) => {
  return (
    <Typography
      variant={variant as Variant}
      sx={{
        textDecoration: textDecoration,
      }}
    >
      {bold ? <strong>{text}</strong> : text}
    </Typography>
  );
};

export default Text;
