"use client";
import colorsConst from "@/constants/pages/colors.json";
import { getFontFamily } from "@/utils/getFontFamily";
import { createTheme } from "@mui/material/styles";
import { Roboto, Roboto_Mono } from "next/font/google";

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
      fontSize: 72,
      fontWeight: 500, // semi bold
    },
    h2: {
      fontFamily: getFontFamily(roboto),
      fontSize: 50,
    },
    h3: {
      fontFamily: getFontFamily(roboto),
      fontSize: 33,
    },
    h4: {
      fontFamily: getFontFamily(robotoMono),
      fontSize: 30,
    },
    h5: {
      fontFamily: getFontFamily(robotoMono),
      fontSize: 25,
    },
    h6: {
      fontFamily: getFontFamily(robotoMono),
      fontSize: 20,
    },
    subtitle1: {
      fontFamily: getFontFamily(robotoMono),
      fontSize: 15,
    },
    subtitle2: {
      fontFamily: getFontFamily(robotoMono),
      fontSize: 13,
    },
    body1: {
      // also the typography used in TextField
      fontFamily: getFontFamily(robotoMono),
      fontSize: 16,
    },
    body2: {
      fontFamily: getFontFamily(robotoMono),
      fontSize: 10,
    },
    overline: {
      // footer
      fontFamily: getFontFamily(robotoMono),
      fontSize: 7,
    },
    button: {
      fontFamily: getFontFamily(robotoMono),
      fontSize: 15,
      textTransform: "none",
    },
  },
  components: {
    MuiAlert: {
      // Alert
      styleOverrides: {
        message: {
          fontSize: 15,
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          color: colorsConst.breadcrumbNavigator.selected,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: colorsConst.components.textField.backgroundColor,
          borderRadius: 10,
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "&:before, &:after": {
            borderBottom: "none",
          },
        },
      },
    },
    MuiInputBase: {
      // TextField input text
      styleOverrides: {
        input: {
          fontSize: 16,
        },
      },
    },
  },
});

export default theme;
