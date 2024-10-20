"use client";

import FAQ from "@/app/[locale]/contact-us/components/faq";
import { trpc } from "@/app/_trpc/client";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import { IFAQ } from "@/constants/types/faq";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import { Box, Card, CardContent, Container, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Text from "../atoms/text";
import { emailParser, phoneParser } from "@/utils/stringParsers";

const ContactUsPage = () => {
  const t = useTranslations("contactUs");
  const [faqs, setFaqs] = useState<IFAQ[]>([]);

  const margin: number = 5;
  const sectionSpacing: number = 5;
  const borderRadius: string = "8px";
  const border: string = "1px solid grey";
  const iconBoxStyle = {
    borderRadius,
    padding: "10px",
    display: "flex",
    border,
    width: "fit-content",
  };
  const cardStyle = {
    display: "flex",
    width: "50%",
    height: "35vh",
    border,
    borderRadius,
  };
  const cardContentStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const getAllFAQs = trpc.faq.getAllFAQs.useQuery();

  // TODO: look into using static side generation for getting all the FAQs from MongoDB
  useEffect(() => {
    if (getAllFAQs.data) {
      const faqs = getAllFAQs.data;
      setFaqs(faqs);
    }
  }, [getAllFAQs.data]);

  const contactUsText = () => {
    return (
      <Text text={t("contactUs")} variant={TypographyVariant.h2} bold={true} />
    );
  };
  const contactOptionsSection = () => {
    const emailBlock = () => {
      const icon = () => {
        return (
          <Box sx={{ ...iconBoxStyle }}>
            <ChatBubbleOutlineOutlinedIcon />
          </Box>
        );
      };

      const description = () => {
        return (
          <Text
            text={t("emailDescription")}
            variant={TypographyVariant.h5}
            bold={true}
          />
        );
      };

      const email = () => {
        return (
          <Text
            text={t("email")}
            variant={TypographyVariant.h5}
            bold={true}
            textDecoration={TypographyTextDecoration.underline}
            link={emailParser(t("email"))}
          />
        );
      };

      return (
        <Card style={cardStyle}>
          <CardContent sx={cardContentStyle}>
            {icon()}
            {description()}
            {email()}
          </CardContent>
        </Card>
      );
    };

    const phoneBlock = () => {
      const icon = () => {
        return (
          <Box sx={{ ...iconBoxStyle }}>
            <HeadsetMicOutlinedIcon />
          </Box>
        );
      };

      const description = () => {
        return (
          <Text
            text={t("phoneDescription")}
            variant={TypographyVariant.h5}
            bold={true}
          />
        );
      };

      const phone = () => {
        return (
          <Text
            text={t("phone")}
            variant={TypographyVariant.h5}
            bold={true}
            textDecoration={TypographyTextDecoration.underline}
            link={phoneParser(t("phone"))}
          />
        );
      };

      return (
        <Card style={cardStyle}>
          <CardContent sx={cardContentStyle}>
            {icon()}
            {description()}
            {phone()}
          </CardContent>
        </Card>
      );
    };

    return (
      <Stack direction={"row"} spacing={margin}>
        {emailBlock()}
        {phoneBlock()}
      </Stack>
    );
  };
  const commonFaqsSection = () => {
    const heading = () => {
      const marginBottom: number = 4;

      return (
        <Box marginBottom={marginBottom}>
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
          return <FAQ questionString={question} answerString={answer} />;
        })}
      </Box>
    );
  };

  return (
    <Container maxWidth="md">
      <Stack
        sx={{
          marginTop: margin,
          marginBottom: margin,
          display: "flex",
          flexDirection: "column",
        }}
        spacing={sectionSpacing}
      >
        {contactUsText()}
        {contactOptionsSection()}
        {commonFaqsSection()}
      </Stack>
    </Container>
  );
};

export default ContactUsPage;
