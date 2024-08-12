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
  typography: {
    fontFamily: defaultFontFamily,
    h1: {
      fontFamily: getFontFamily(roboto)
    },
    h2: {
      fontFamily: getFontFamily(roboto)
    },
    h3: {
      fontFamily: getFontFamily(robotoMono)
    },
    h4: {
      fontFamily: getFontFamily(robotoMono)
    },
    h5: {
      fontFamily: getFontFamily(robotoMono)
    },
  },
});

export default theme;
