import { ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';

export const themeColor = '#009688';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#8a8989',
    },
    secondary: {
      main: themeColor,
    },
    background: {
      default: '#333333',
      paper: '#040404'
    }
  }
};

export const theme = createTheme(themeOptions);
