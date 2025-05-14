import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import contactsConst from "@/constants/pages/contacts.json";
import { phoneParser } from "@/utils/stringParsers";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import { Box, Card, CardContent } from "@mui/material";
import { useTranslations } from "next-intl";
import { CONTACT_US_STYLES } from "../styles";

const PhoneBlock = () => {
  const t = useTranslations("contactUs");
  const styles = CONTACT_US_STYLES;

  return (
    <Card sx={styles.CARD_SX}>
      <CardContent sx={styles.CARD_CONTENT_SX}>
        <Box sx={{ ...styles.ICON_BOX_STYLE }}>
          <HeadsetMicOutlinedIcon />
        </Box>
        <Text
          text={t("phoneDescription")}
          variant={TypographyVariant.h5}
          bold={true}
        />
        <Text
          text={contactsConst.phone}
          variant={TypographyVariant.h5}
          bold={true}
          textDecoration={TypographyTextDecoration.underline}
          link={phoneParser(contactsConst.phone)}
        />
      </CardContent>
    </Card>
  );
};

export default PhoneBlock;
