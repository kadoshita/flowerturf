import { ThemeOptions } from '@mui/material';
import { green, blue, grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#8a8989',
    },
    secondary: {
      main: '#009688',
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
