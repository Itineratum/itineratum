import Text from "@/components/atoms/text";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import contactsConst from "@/constants/pages/contacts.json";
import { emailParser } from "@/utils/stringParsers";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Box, Card, CardContent } from "@mui/material";
import { useTranslations } from "next-intl";
import { CONTACT_US_STYLES } from "../styles";

const EmailBlock = () => {
  const t = useTranslations("contactUs");
  const styles = CONTACT_US_STYLES;

  return (
    <Card sx={styles.CARD_SX}>
      <CardContent sx={styles.CARD_CONTENT_SX}>
        <Box sx={{ ...styles.ICON_BOX_STYLE }}>
          <ChatBubbleOutlineOutlinedIcon />
        </Box>
        <Text
          text={t("emailDescription")}
          variant={TypographyVariant.h5}
          bold={true}
        />
        <Text
          text={contactsConst.email}
          variant={TypographyVariant.h5}
          bold={true}
          textDecoration={TypographyTextDecoration.underline}
          link={emailParser(contactsConst.email)}
        />
      </CardContent>
    </Card>
  );
};

export default EmailBlock;
