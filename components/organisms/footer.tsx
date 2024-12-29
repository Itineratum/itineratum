import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import contactsConst from "@/constants/pages/contacts.json";
import endpointsConst from "@/constants/pages/endpoints.json";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import { emailParser } from "@/utils/stringParsers";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Box, Divider, Grid, IconButton, Stack } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Text from "../atoms/text";
import TikTokIcon from "../atoms/tiktok-icon";
import StayConnectedColumn from "../molecules/footer-stay-connected-column";

const Footer = () => {
  const t = useTranslations("footer");
  const locale = useLocale();

  const footerMarginTop: string = "20px";
  const footerPaddingX: string = "40px";
  const footerPaddingY: string = "40px";
  const gridMarginBottom: string = "20px";
  const spacing: number = 0;
  const stayConnectedColumnWidth: number = 5;
  const pageLinksColumnWidth: number = 2;
  const contactUsColumnWidth: number = 2;
  const socialMediaLinksColumnWidth: number = 3;

  const stayConnectedColumn = () => {
    return (
      <Grid
        item
        xs={stayConnectedColumnWidth}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <StayConnectedColumn />
      </Grid>
    );
  };

  const pageLinksColumn = () => {
    const spacing: number = 3;
    const typographyVariant: TypographyVariant = TypographyVariant.subtitle1;

    const homeLink = () => {
      return (
        <Link
          href={buildLocaleEndpoint(locale, endpointsConst.home.endpoint)}
          style={{ textDecoration: "none" }}
        >
          <Text
            text={t("home")}
            variant={typographyVariant}
            bold={false}
            color={"text.secondary"}
          />
        </Link>
      );
    };

    const savedTripsLink = () => {
      return (
        <Link
          href={buildLocaleEndpoint(locale, endpointsConst.savedTrips.endpoint)}
          style={{ textDecoration: "none" }}
        >
          <Text
            text={t("savedTrips")}
            variant={typographyVariant}
            bold={false}
            color={"text.secondary"}
          />
        </Link>
      );
    };

    const aboutUsLink = () => {
      return (
        <Link
          href={buildLocaleEndpoint(locale, endpointsConst.aboutUs.endpoint)}
          style={{ textDecoration: "none" }}
        >
          <Text
            text={t("aboutUs")}
            variant={typographyVariant}
            bold={false}
            color={"text.secondary"}
          />
        </Link>
      );
    };

    return (
      <Grid item xs={pageLinksColumnWidth}>
        <Stack spacing={spacing} sx={{ display: "flex", alignItems: "center" }}>
          {homeLink()}
          {savedTripsLink()}
          {aboutUsLink()}
        </Stack>
      </Grid>
    );
  };

  const contactUsColumn = () => {
    const spacing: number = 2;

    const contactUsHeading = () => {
      return (
        <Text
          text={t("contactUs")}
          variant={TypographyVariant.subtitle1}
          bold={false}
        />
      );
    };

    const contactDetails = () => {
      const email = () => {
        return (
          <Text
            text={contactsConst.email}
            variant={TypographyVariant.subtitle2}
            bold={false}
            link={emailParser(contactsConst.email)}
            textDecoration={TypographyTextDecoration.none}
          />
        );
      };

      const phone = () => {
        return (
          <Text
            text={contactsConst.phone}
            variant={TypographyVariant.subtitle2}
            bold={false}
            link={emailParser(contactsConst.email)}
          />
        );
      };

      return (
        <Stack sx={{ display: "flex", alignItems: "center" }}>
          {email()}
          {phone()}
        </Stack>
      );
    };

    return (
      <Grid item xs={contactUsColumnWidth}>
        <Stack spacing={spacing} sx={{ display: "flex", alignItems: "center" }}>
          {contactUsHeading()}
          {contactDetails()}
        </Stack>
      </Grid>
    );
  };

  const socialMediaIconsColumn = () => {
    const spacing: number = 3;

    return (
      <Grid item xs={socialMediaLinksColumnWidth}>
        <Stack
          direction="row"
          spacing={spacing}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <IconButton aria-label="facebook" color="inherit">
            <FacebookIcon />
          </IconButton>
          <IconButton aria-label="telegram" color="inherit">
            <TelegramIcon />
          </IconButton>
          <IconButton aria-label="instagram" color="inherit">
            <InstagramIcon />
          </IconButton>
          <IconButton aria-label="tiktok" color="inherit">
            <TikTokIcon color={colorsConst.palette.text.secondary} />
          </IconButton>
          <IconButton aria-label="linkedin" color="inherit">
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Grid>
    );
  };

  const divider = () => {
    const lineThickness: number = 1;
    const marginTop: string = "20px";

    return (
      <Divider
        sx={{
          flexGrow: 1,
          borderBottomWidth: lineThickness,
          borderBottomColor: "text.secondary",
          marginTop: marginTop,
        }}
      />
    );
  };

  const linksRow = () => {
    // TODO: insert links here
    const links: Record<string, string> = {
      [t("termsAndConditions")]: "",
      [t("privacyPolicy")]: "",
      [t("cookiePolicy")]: "",
      [t("copyrightNotification")]: "",
      [t("cookieSettings")]: "",
    };

    const spacing: number = 2;

    const divider = () => {
      return (
        <Text text={"|"} variant={TypographyVariant.subtitle2} bold={false} />
      );
    };

    return (
      <Stack
        direction="row"
        spacing={spacing}
        justifyContent="center"
        sx={{ marginTop: "20px" }}
      >
        {Object.keys(links).map((text, index) => (
          <Stack spacing={spacing} direction="row">
            <Link
              href={links[text]}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Text
                text={text}
                variant={TypographyVariant.subtitle2}
                bold={false}
              />
            </Link>
            {index < Object.keys(links).length - 1 ? divider() : <></>}
          </Stack>
        ))}
      </Stack>
    );
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: colorsConst.palette.primary.main,
        color: colorsConst.palette.text.secondary,
        paddingX: footerPaddingX,
        paddingY: footerPaddingY,
        marginTop: footerMarginTop,
      }}
    >
      <Stack direction="column" sx={{ width: "100%" }}>
        <Grid
          container
          spacing={spacing}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: gridMarginBottom,
          }}
        >
          {stayConnectedColumn()}
          {pageLinksColumn()}
          {contactUsColumn()}
          {socialMediaIconsColumn()}
        </Grid>
        {divider()}
        {linksRow()}
      </Stack>
    </Box>
  );
};

export default Footer;
