import { ThemeOptions } from '@mui/material';
import { green, blue, grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const themeColor = '#009688';

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#8a8989',
    },
    secondary: {
      main: themeColor,
    },
    background: {
      default: grey[900]
    },
    text: {
      primary: grey[100],
      secondary: grey[900]
    }
  }
};

export const theme = createTheme(themeOptions);
