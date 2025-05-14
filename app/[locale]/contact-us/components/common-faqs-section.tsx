import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { IFAQ } from "@/constants/types/faq";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import FAQ from "./faq";
import { CONTACT_US_STYLES } from "./styles";

const CommonFaqsSection = ({ faqs }: { faqs: IFAQ[] }) => {
  const t = useTranslations("contactUs");
  const styles = CONTACT_US_STYLES;

  const heading = () => {
    return (
      <Box marginBottom={styles.HEADING_MARGIN_BOTTOM}>
        <Text
          text={t("commonFaqs")}
          variant={TypographyVariant.h3}
          bold={false}
        />
      </Box>
    );
  };

  return (
    <Box>
      {heading()}
      {faqs.map((faq) => {
        const question = faq.question;
        const answer = faq.answer;
        return (
          <FAQ key={question} questionString={question} answerString={answer} />
        );
      })}
    </Box>
  );
};

export default CommonFaqsSection;
