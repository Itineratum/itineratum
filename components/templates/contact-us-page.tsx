import CommonFaqsSection from "@/app/[locale]/contact-us/components/common-faqs-section";
import ContactOptionsSection from "@/app/[locale]/contact-us/components/contact-options-section/contact-options-section";
import FeedbackForm from "@/app/[locale]/contact-us/components/feedback-form/feedback-form";
import { CONTACT_US_STYLES } from "@/app/[locale]/contact-us/components/styles";
import { TypographyVariant } from "@/constants/enums/theme";
import { IFAQ } from "@/constants/types/faq";
import { FeedbackFormProvider } from "@/contexts/feedbackFormContext";
import { Container, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import Text from "../atoms/text";

const ContactUsPage = ({ faqs }: { faqs: IFAQ[] }) => {
  const t = useTranslations("contactUs");
  const styles = CONTACT_US_STYLES;

  return (
    <Container maxWidth="md">
      <Stack
        sx={{
          marginTop: styles.MARGIN,
          marginBottom: styles.MARGIN,
          display: "flex",
          flexDirection: "column",
        }}
        spacing={styles.SECTION_SPACING}
      >
        <Text
          text={t("contactUs")}
          variant={TypographyVariant.h2}
          bold={true}
        />
        <ContactOptionsSection />
        <CommonFaqsSection faqs={faqs} />
        <FeedbackFormProvider>
          <FeedbackForm />
        </FeedbackFormProvider>
      </Stack>
    </Container>
  );
};

export default ContactUsPage;
