import { TypographyVariant } from "@/constants/enums/theme";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import { Box, Link, MenuItem } from "@mui/material";
import Text from "../atoms/text";

const LinkMenuItem = ({
  item,
  text,
  locale,
  handleClose,
}: {
  item: string;
  text: string;
  locale: string;
  handleClose: () => void;
}) => {
  console.log(`result: ${buildLocaleEndpoint(locale, item)}`);

  return (
    <MenuItem key={item} onClick={handleClose}>
      <Link href={buildLocaleEndpoint(locale, item)}>
        <Box color="black">
          <Text text={text} variant={TypographyVariant.h4} bold={false} />
        </Box>
      </Link>
    </MenuItem>
  );
};

export default LinkMenuItem;
