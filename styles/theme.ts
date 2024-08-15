'use client';
import { Roboto, Roboto_Mono } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { getFontFamily } from '@/utils/getFontFamily';

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
});
export const robotoMono = Roboto_Mono({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
});
const defaultFontFamily = getFontFamily(robotoMono);

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
      contrastText: '#000000',
    },
    secondary: {
      main: '#000000',
      contrastText: '#ffffff',
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
      fontSize: 30
    },
    h4: {
      fontFamily: getFontFamily(robotoMono),
      fontSize: 15
    },
    h5: {
      fontFamily: getFontFamily(robotoMono),
      fontSize: 10
    },
    button: {
      textTransform: 'none'
    },
  },
});

export default theme;
