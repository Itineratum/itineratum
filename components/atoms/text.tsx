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
  color = "inherit",
  link = undefined,
}: {
  text: string;
  variant: TypographyVariant;
  bold: boolean;
  textDecoration?: TypographyTextDecoration;
  color?: string;
  link?: string | undefined;
}) => {
  const textElement = link ? (
    <a href={link} style={{ color: color }}>
      {text}
    </a>
  ) : (
    text.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </span>
    ))
  );

  return (
    <Typography
      variant={variant as Variant}
      color={color}
      sx={{
        textDecoration: textDecoration,
      }}
    >
      {bold ? <strong>{textElement}</strong> : textElement}
    </Typography>
  );
};

export default Text;
