/* eslint-disable react/prop-types */
// /* eslint-disable  */
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
} from "@mui/material";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
const DynamicForm = ({ formFields, onSubmit, value }) => {
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredMainDepartments, setFilteredMainDepartments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => { 
    const departmentField = formFields?.fields?.find(
      (field) => field.name === "DepartmentID"
    ); 
    if (departmentField) {
      setFilteredDepartments(departmentField.options);
    }
  }, [formFields]);

  useEffect(() => { 
    const Main_departmentField = formFields?.fields?.find(
      (field) => field.name === "MainDepartmentID"
    ); 
    if (Main_departmentField) {
      setFilteredMainDepartments(Main_departmentField.options);
    }
  }, [formFields]);


  const handleBranchChange = (e) => {
    const selectedBranch = e.target.value;
    formik.handleChange(e);   
    // Filter departments based on the selected branch
    const departmentField = formFields?.fields?.find(
      (field) => field.name === "DepartmentID"
      ); 
      
    if (departmentField) {
      const filteredOptions = departmentField.options.filter(
        (option) => option.BranchID === selectedBranch
      );
      setFilteredDepartments(filteredOptions);
    }

    const Main_DepartmentField = formFields?.fields?.find(
      (field) => field.name === "MainDepartmentID"
      ); 
      
    if (Main_DepartmentField) {
      const filtered_Main_Options = Main_DepartmentField.options.filter(
        (option) => option.BranchID === selectedBranch
      );
      setFilteredMainDepartments(filtered_Main_Options);
    }



  };

  const formik = useFormik({
    initialValues: Object.fromEntries(
      formFields?.fields?.map((field) => [field.name, ""])
    ),
    validate: (values) => {
      const errors = {};

      formFields?.fields?.forEach((field) => {
        const fieldName = field.name;
        const fieldValue = values[fieldName];

        if (fieldName === "GST" && values.gstOption !== "non-exception") {
          return; // Skip validation for GST field
        }
        // Check if the field is required and not empty
        if (
          (field.type === "text" ||
            field.type === "dropdown" ||
            field.type === "number" ||
            field.type === "date") &&
          !fieldValue
        ) {
          errors[fieldName] = `${field.label} is required`;
        }
        if (values.gstOption === "non-exception") {
          // Your GST specific validation logic here
          if (!values.GST) {
            errors.GST = "GST is required";
          }
          if (isNaN(values.GST)) {
            errors.GST = "GST must be a number";
          } else if (values.GST < 1 || values.GST > 100) {
            errors.GST = "GST must be between 1 and 100";
          }
          // Additional GST specific validations can be added here
        }
        // Check if the field starts with a space
        if (fieldValue && /^\s/.test(fieldValue)) {
          errors[fieldName] = `${field.label} should not start with a space`;
        }
        if (fieldName === "age") {
          if (isNaN(fieldValue)) {
            errors.age = "Age must be a number";
          } else if (fieldValue < 1 || fieldValue > 120) {
            errors.age = "Age must be between 1 and 120";
          }
        }

        if (formFields.headText === "Alert") {
          // Validation for start and end dates
          const startDate = values["startDate"];
          const endDate = values["endDate"];
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Check if start date is provided and is today or a future date
          if (startDate) {
            const startDateObj = new Date(startDate);
            startDateObj.setHours(0, 0, 0, 0);

            if (startDateObj < today) {
              errors["startDate"] = "Start date must be today or a future date";
            }
          } else {
            errors["startDate"] = "Start date is required";
          }

          // Check if end date is provided
          if (!endDate) {
            errors["endDate"] = "End date is required";
          }

          // Check if end date is after the start date
          if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            errors["endDate"] = "End date must be after start date";
          }
        }

        // Specific field validations
        switch (fieldName) {
          case "password":
          case "loginId":
            if (fieldValue && fieldValue.length < 6) {
              errors[
                fieldName
              ] = `${field.label} must have at least 6 characters`;
            }
            break;
          case "branchName":
          case "name":
          case "Name":
          case "age":
          case "city":
          case "state":
          case "country":
          case "type":
          case "Method":
          case "DepartmentName":
          case "patientType":
            if (fieldValue && fieldValue.length > 50) {
              errors[
                fieldName
              ] = `${field.label} must have less than 50 letters`;
            }
            break;
          case "address":
          case "procedure":
          case "description":
            if (fieldValue && fieldValue.length > 200) {
              errors[
                fieldName
              ] = `${field.label} must have less than 200 characters`;
            }
            break;
          case "pincode":
            if (fieldValue && !/^\d{6,}$/.test(fieldValue)) {
              errors[fieldName] =
                "Pin code must have at least 6 digits and contain only numbers";
            }
            break;
          case "phone":
            if (fieldValue && !/^\d{10}$/.test(fieldValue)) {
              errors[fieldName] =
                "Phone must have 10 digits and contain only numbers";
            }
            break;
          case "email":
            if (
              fieldValue &&
              !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
                fieldValue
              )
            ) {
              errors[fieldName] = "Invalid email address";
            }
            break;
          case "Cost":
            if (
              fieldValue &&
              (isNaN(parseFloat(fieldValue)) ||
                parseFloat(fieldValue) <= 0 ||
                parseFloat(fieldValue) >= 100000000)
            ) {
              errors[fieldName] =
                "Cost must be a positive number and less than 100,000,000";
            }
            break;
          // Add more cases for specific fields if needed
        }
      });

      return errors;
    },
    onSubmit: (values) => {
      onSubmit(values); 
      setSelectedIds([])
    },
  });

  // Use useEffect to update initialValues when formFields change
  useEffect(() => {
    const newInitialValues = Object.fromEntries(
      formFields?.fields?.map((field) => [field.name, ""])
    );
    // Reset the form with the new initial values
    formik.resetForm({ values: newInitialValues });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formFields]);

  const handleReset = () => {    
    formik.resetForm()
    setSelectedIds([])
  }; 
  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setSelectedIds(value);  
      formik.setFieldValue(name, value);
    },
    [formik]
  );
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 2,
        p: 4,
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        className="uppercase font-semibold"
        gutterBottom
      >
        Add details of {value?.name}
      </Typography>
      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <Grid container spacing={2} justifyContent="center">
          {formFields?.fields?.map((field, index) => {
            const gridItemSize = formFields.fields.length === 1 ? 12 : 4;
            if (
              field.name === "GST" &&
              formik.values.gstOption !== "non-exception"
            ) {
              return null;
            }
            return (
              <Grid item xs={gridItemSize} key={index}>
                {field.type === "text" && (
                  <TextField
                    id={field.name}
                    name={field.name}
                    label={field.label}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formik.values[field.name] || ""}
                    onChange={formik.handleChange}
                    error={
                      formik.touched[field.name] &&
                      Boolean(formik.errors[field.name])
                    }
                    helperText={
                      formik.touched[field.name] && formik.errors[field.name]
                    }
                  />
                )}
                {field.type === "number" && (
                  <TextField
                    id={field.name}
                    name={field.name}
                    label={field.label}
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formik.values[field.name] || ""}
                    onChange={formik.handleChange}
                    error={
                      formik.touched[field.name] &&
                      Boolean(formik.errors[field.name])
                    }
                    helperText={
                      formik.touched[field.name] && formik.errors[field.name]
                    }
                  />
                )}


                {field.type === "dropdown" && (
                  <TextField
                    id={field.name}
                    name={field.name}
                    select
                    label={field.label}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formik.values[field.name] || ""}
                    onChange={
                      (formFields.headText === "Procedure" || formFields.headText === 'Department' ) &&
                      field.name === "BranchID"
                        ? handleBranchChange
                        : formik.handleChange
                    }
                    
                    error={
                      formik.touched[field.name] &&
                      Boolean(formik.errors[field.name])
                    }
                    helperText={
                      formik.touched[field.name] && formik.errors[field.name]
                    }>
 
                    {(formFields.headText === "Procedure" &&
                    field.name === "DepartmentID"
                      ? filteredDepartments
                      : (formFields.headText === "Department" &&
                      field.name === "MainDepartmentID")
                        ? filteredMainDepartments : field.options
                    ).map((option, optionIndex) => (
                      <MenuItem key={optionIndex} value={option.id}>
                        <div>
                          <p>{option.option}</p>{" "}
                          <p
                            title={"Choose the window user works"}
                            className="text-slate-400"
                          >
                            {option.subOption}
                          </p>{" "}
                        </div>
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                {field.type === "MultiCheckBox" && (
                  <FormControl fullWidth margin="normal">
                  <InputLabel id="demo-multiple-checkbox-label">
                    Departments
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    fullWidth
                    value={selectedIds || " "}
                    name={field.name}
                    onChange={handleChange}
                    input={<OutlinedInput label={field.name} />}
                    renderValue={(selected) =>
                      selected
                        ?.map(
                          (id) =>
                          filteredDepartments &&
                          filteredDepartments?.find((name) => name.id === id)?.option
                        )
                        .join(", ")
                    }
                  >
                   
                    { filteredDepartments?.map((option) => (
                        <MenuItem key={option?.id} value={option?.id}>
                          <Checkbox checked={selectedIds?.indexOf(option?.id) > -1} />
                          <div>
                            <p>{option?.option}</p>
                            <p className="text-slate-400">{option?.subOption} </p>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                )} 


                {field.type === "date" && (
                  <TextField
                    id={field.name}
                    name={field.name}
                    label={field.label}
                    type="date"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true, // This ensures the label doesn't overlap with the date value
                    }}
                    value={formik.values[field.name] || ""}
                    onChange={formik.handleChange}
                    error={
                      formik.touched[field.name] &&
                      Boolean(formik.errors[field.name])
                    }
                    helperText={
                      formik.touched[field.name] && formik.errors[field.name]
                    }
                  />
                )}
              </Grid>
            );
          })}
        </Grid>
        <div></div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
            gap: "1rem",
          }}
        >
          <Button
            variant="contained"
            onClick={handleReset}
            sx={{ bgcolor: "grey.500" }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default DynamicForm;


