/* eslint-disable react/prop-types */
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import Axios from "../../Config/axios"

const Select_Branch_ID = ({ onChange, value, ...props }) => {
    const [options,setOptions]=useState([]) 
    useEffect(() => {
        Axios.get('/admin/Get-Branches')
            .then((resp) => {
                const branches = resp?.data?.Branches?.map(branch => ({
                    id: branch?._id,
                    type: branch?.branchName
                }));
                setOptions(branches); 
                handleInputChange("",branches[0])
            })
            .catch(error => {
                console.error('Error fetching branches:', error);
                // handle error appropriately
            });
    }, []);

    const handleInputChange = (event, newValue) => { 
         
        onChange(newValue);
    };

  return (
   <> 
    <Autocomplete
      disablePortal 
      fullWidth
      options={options}
      getOptionLabel={(option) => option.type || ''}
      renderInput={(params) => <TextField 
     {...params} {...props} label="Branch" margin="normal" />}
      onChange={handleInputChange}
      value={options.find(option => option.id === value)}
      isOptionEqualToValue={(option, val) => option.id === val.id}
    />
   </>
  );
};

export default Select_Branch_ID;
