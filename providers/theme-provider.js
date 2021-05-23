import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
  typography: {
    fontFamily: "inherit",
  },
  overrides: {
    MuiTypography: {
      root: {
        width: "100% ",
      },
    },

    MuiButtonBase: {
      root: {
        color: "#f5f5f5",
        fontFamily: "inherit",
        textTransform: "initial !important",
        fontSize: "15px",
      },
    },
    MuiSvgIcon: {
      root: {
        height: "30px",
        width: "30px",
      },
    },
  },
});
export default function ThemeProvider({ children }) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
