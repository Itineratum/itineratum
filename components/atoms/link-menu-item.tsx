import { TypographyVariant } from "@/constants/enums/theme";
import { useRouter } from "@/navigation";
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
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    handleClose();
    const newPath =
      locale === "en" ? buildLocaleEndpoint(locale, item) : `/${item}`;
    router.push(newPath);
  };

  return (
    <MenuItem key={item} onClick={handleClick}>
      <Link href={buildLocaleEndpoint(locale, item)}>
        <Box color="black">
          <Text text={text} variant={TypographyVariant.h4} bold={false} />
        </Box>
      </Link>
    </MenuItem>
  );
};

export default LinkMenuItem;
