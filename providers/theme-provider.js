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
        color: "#f5f5f5 !important",
        fontFamily: "inherit !important",
        textTransform: "initial !important",
        fontSize: "15px !important",
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
