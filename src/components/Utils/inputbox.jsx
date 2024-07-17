/* eslint-disable react/prop-types */
import TextField from '@mui/material/TextField';

const TextFieldInput = ({ label, name, fullWidth, ...props }) => {
  return (
    <TextField
      label={label}
      name={name}
      margin="normal"   
      fullWidth={fullWidth}
      {...props}
    />
  );
};

export default TextFieldInput;
