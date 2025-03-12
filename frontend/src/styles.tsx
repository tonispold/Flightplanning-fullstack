export const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    fontWeight: "bold",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",
        borderWidth: "2px",
      },
    },
    "&:hover:not(.Mui-focused)": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "white",
      },
    },
  },
  "& .MuiInputLabel-outlined": {
    color: "white",
    fontWeight: "bold",
    "&.Mui-focused": {
      color: "white",
      fontWeight: "bold",
    },
  },
};

export const numberFieldStyles = {
  "& input[type='number']::-webkit-outer-spin-button, & input[type='number']::-webkit-inner-spin-button":
    {
      WebkitAppearance: "none",
      margin: 0,
    },
  "& input[type='number']": {
    MozAppearance: "textfield",
  },
};
