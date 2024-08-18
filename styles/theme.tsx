"use client";
import { getFontFamily } from "@/utils/getFontFamily";
import { createTheme } from "@mui/material/styles";
import { Roboto, Roboto_Mono } from "next/font/google";
import colorsConst from "@/constants/pages/colors.json";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});
export const robotoMono = Roboto_Mono({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});
const defaultFontFamily = getFontFamily(robotoMono);

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colorsConst.palette.primary.main,
    },
    secondary: {
      main: colorsConst.palette.secondary.main,
    },
    text: {
      primary: colorsConst.palette.text.primary,
      secondary: colorsConst.palette.text.secondary,
    },
  },
  typography: {
    fontFamily: defaultFontFamily,
    h1: {
      fontFamily: getFontFamily(roboto),
      fontSize: 40,
    },
    h2: {
      fontFamily: getFontFamily(roboto),
      fontSize: 33,
    },
    h3: {
      fontFamily: getFontFamily(robotoMono),
      fontSize: 30,
    },
    h4: {
      fontFamily: getFontFamily(robotoMono),
      fontSize: 15,
    },
    h5: {
      fontFamily: getFontFamily(robotoMono),
      fontSize: 10,
    },
    button: {
      textTransform: "none",
    },
  },
});

export default theme;
