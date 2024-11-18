"use client";

import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { Controller } from "react-hook-form";

const TextInputField = ({
  name,
  label,
  control,
  errorMessage,
  errors,
  value,
  validate,
  isPasswordInputField = false,
  formFieldMargin = "normal",
  onChange,
}: {
  name: string;
  label: string;
  control: any;
  errorMessage: string;
  errors: any;
  value: string;
  validate?: any;
  isPasswordInputField?: boolean;
  formFieldMargin?: "dense" | "normal" | "none" | undefined;
  onChange?: any;
}) => {
  const [showPassword, setShowPassword] = isPasswordInputField
    ? useState<boolean>(false)
    : [false, () => {}];

  const handleClickShowPassword = isPasswordInputField
    ? () => setShowPassword(!showPassword)
    : () => {};

  return (
    <Controller
      key={name}
      name={name}
      control={control}
      defaultValue=""
      rules={{
        validate: validate,
        required: errorMessage,
      }}
      render={({ field }) => (
        <TextField
          {...field}
          type={
            isPasswordInputField ? (showPassword ? "text" : "password") : "text"
          }
          required
          fullWidth
          variant="filled"
          margin={formFieldMargin}
          label={label}
          value={value}
          InputLabelProps={{
            sx: { color: "text.primary" },
          }}
          error={!!errors[name]}
          helperText={errors[name] ? (errors[name].message as string) : ""}
          onChange={async (event) => {
            field.onChange(event);

            if (onChange) {
              await onChange(event, field);
            }
          }}
          FormHelperTextProps={{ sx: { whiteSpace: "pre-line" } }} // ensures that newline characters (\n) are rendered as actual line breaks
          InputProps={
            isPasswordInputField
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : undefined
          }
        />
      )}
    />
  );
};

export default TextInputField;
