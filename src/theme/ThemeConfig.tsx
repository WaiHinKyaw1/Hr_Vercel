import { createTheme, PaletteMode } from "@mui/material/styles";
import { Raleway } from "next/font/google";

// When using TypeScript 4.x and above

const Font = Raleway({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const normalFontWeight = 400;
const fontSize = "1rem";

// TypeScript extensions for custom palette
declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      border: string;
      placeHolder: string;
      disabled: string;
      warning: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      border?: string;
      placeHolder?: string;
      disabled?: string;
      warning?: string;
    };
  }
}

// Create a theme instance.

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#008080",
      },
      secondary: {
        main: "#87CEEB",
      },
      custom: {
        border: "#CBD0D7",
        placeHolder: "#A0AEC0",
        disabled: "#F0F0F0",
        warning: "#C41E3A",
      },
    },
    typography: {
      fontFamily: [
        Font.style.fontFamily,
        "Poppins",
        "Ubuntu",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            color: "white",
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: "small",
          variant: "outlined",
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            width: "100%",
          },
        },
      },
      MuiOutlinedInput: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontSize: fontSize,
            fontWeight: normalFontWeight,
            "& .Mui-disabled": {
              backgroundColor: "#f5f5f5",
              borderRadius: 10,
            },
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
              {
                display: "none",
              },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          },
          notchedOutline: {
            borderRadius: 10,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontSize: fontSize,
            fontWeight: normalFontWeight,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontSize: fontSize, // base font size in px
            fontWeight: normalFontWeight,
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontSize: "0.9rem",
            color: theme.palette.custom.placeHolder,
            fontWeight: normalFontWeight,
          }),
        },
      },
      MuiTab: {
        styleOverrides: {
          root: ({}) => ({
            // indicatorColor:"red",
            textTransform: "none",
            paddingLeft: 30,
            paddingRight: 30,
            fontSize: fontSize,
            // backgroundColor: ownerState.selected
            //   ? Color.appColorTabActiveBgColor
            //   : Color.appColorTabInActiveBgColor,
          }),
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            "&:hover": {
              background: "#f0f1f3",
              borderRadius: "5px",
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              background: "none",
            },
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            // borderLeft: `0.5px solid  #444444`,
            // borderRight: `0.5px solid  #444444`,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            borderTop: `1px solid rgba(224, 224, 224, 1)`, // Orange border color
            position: "sticky",
            top: -1,
            backgroundColor: "#fff",
            // boxShadow: `2px 2px 3px -1px ${Color.primary}`,
            zIndex: 2,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            verticalAlign: "baseline",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: ({ ownerState }) => {
            const TableCell_No_Style: object =
              ownerState.className == "TableCell_No"
                ? {
                    width: 45,
                    textAlign: "right",
                  }
                : {};
            return {
              padding: 10, //Table Cell Padding
              fontSize: fontSize,
              fontWeight: normalFontWeight,
              ...TableCell_No_Style,
            };
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            "& label": {
              fontSize: fontSize,
            },
          },
          input: {
            fontSize: fontSize,
            fontWeight: normalFontWeight,
          },
          listbox: {
            fontSize: fontSize,
            fontWeight: normalFontWeight,
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {},
        },
      },
    },
  });
