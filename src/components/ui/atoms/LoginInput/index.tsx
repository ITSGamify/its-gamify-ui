// src/components/ui/TextField.tsx
import React from "react";
import { TextField as MuiTextField, TextFieldProps } from "@mui/material";

const LoginInput: React.FC<TextFieldProps> = (props) => {
  return (
    <MuiTextField
      fullWidth
      variant="outlined"
      margin="normal"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          "&.Mui-focused fieldset": {
            borderColor: "#4361ee",
          },
        },
      }}
      {...props}
    />
  );
};

export default LoginInput;
