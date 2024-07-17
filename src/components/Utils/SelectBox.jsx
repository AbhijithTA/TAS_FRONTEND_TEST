/* eslint-disable react/prop-types */
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SelectBox = ({ id, label, options, fullWidth, onChange, value, ...props }) => {
  const handleInputChange = (event, newValue) => {
    // Use newValue directly if it's a string or set it to null if it's an object
    const selectedValue = typeof newValue === 'string' ? newValue : null;
    onChange(selectedValue);
  };

  return (
    <Autocomplete
      disablePortal
      id={id}
      getOptionLabel={(option) => (typeof option === 'object' ? option.type : option)}
      options={Array.isArray(options) ? options.map((item) => (typeof item === 'object' ? item.type : item)) : []}
      renderInput={(params) => (
        <TextField
          margin="normal"
          fullWidth={fullWidth}
          {...props}
          {...params}
          label={label}
          
        />
      )}
      onChange={handleInputChange}
      value={value}
      isOptionEqualToValue={(option, value) =>{ 
        return value ? option === value : true
      } }
    />
  );
};

export default SelectBox;
