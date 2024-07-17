/* eslint-disable  */
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
import { useEffect, useState } from "react";
import Axios from "../../../Config/axios";
import showAlert from "../../../Utils/showAlert";

const Add_DOC_Form = ({ formData, setFormData, onSubmit }) => {
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredprocedurs, setFilteredprocedurs] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const formik = useFormik({
    initialValues: {
      BranchID: "",
      name: "",
      age: "",
      Gender: "",
      specialization: "",
      email: "",
      address: "",
      DepartmentID: "",
      phone: "",
      ProcedureIds: [],
    },
    validate: (values) => {
      const errors = {};

      if (!values.BranchID) {
        errors.BranchID = "Required";
      }
      if (!values.name) {
        errors.name = "Required";
      }
      if (!values.specialization) {
        errors.specialization = "Required";
      }
      if (!values.address) {
        errors.address = "Required";
      }

      // Validate age (required and must be a number)
      if (!values.age) {
        errors.age = "Required";
      } else if (isNaN(values.age)) {
        errors.age = "Age must be a number";
      } else if (values.age < 1 || values.age > 120) {
        errors.age = "Age must be between 1 and 120";
      }

      // Validate Gender (required)
      if (!values.Gender) {
        errors.Gender = "Required";
      }

      if (values.Gender !== "") {
        if (!values.email) {
          errors.email = "Required";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = "Invalid email address";
        }
      }

      if (!values.phone) {
        errors.phone = "Required";
      } else if (!/^[0-9]{10}$/i.test(values.phone)) {
        errors.phone = "Invalid phone number, must be 10 digits";
      }

      if (!values.DepartmentID) {
        errors.DepartmentID = "Required";
      }
      return errors;
    },

    onSubmit: (values) => { 
      Axios.post("/admin/add-doctor", values)
        .then((resp) => {
          showAlert("Doctor", resp?.data?.message, "success");
          formik.resetForm();
          setSelectedIds([]);
        })
        .catch((err) => {
          showAlert("Doctor", err.response.data.error, "warning");
        });
    },
  });

  const maxwidth = formData?.fields?.length === 1 ? "sm" : "md";

  useEffect(() => {
    const departmentField = formData?.fields?.find(
      (field) => field.name === "DepartmentID"
    );
    if (departmentField) {
      setFilteredDepartments(departmentField.options);
    }

    const procedureField = formData?.fields?.find(
      (field) => field.name === "ProcedureIds"
    );
    if (procedureField) {
      setFilteredprocedurs(procedureField.options);
    }
  }, [formData]);

  const handleBranchChange = (e) => {
    const selectedBranch = e.target.value;
    formik.handleChange(e);

    // Filter departments based on the selected branch
    const departmentField = formData?.fields?.find(
      (field) => field.name === "DepartmentID"
    );

    if (departmentField) {
      const filteredOptions = departmentField.options.filter(
        (option) => option.BranchID === selectedBranch
      );
      setFilteredDepartments(filteredOptions);
    }

    const procedureField = formData?.fields?.find(
      (field) => field.name === "ProcedureIds"
    );

    if (procedureField) {
      const filteredProcedureOptions = procedureField.options.filter(
        (option) => option.BranchID === selectedBranch
      );
      setFilteredprocedurs(filteredProcedureOptions);
    }
    setSelectedIds([]);
    formik.setFieldValue("DepartmentID", "");
    formik.setFieldValue("ProcedureIds", "");
  };

  const handleChange = (event) => {
    setSelectedIds(event.target.value);
    formik.handleChange(event);
  };

  return (
    <div className="m-auto w-auto flex bg-white items-center justify-center">
      <div className="p-4 w-auto min-h-[90vh]">
        <Container
          maxWidth={maxwidth}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 5,
            border: "1px",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            className="uppercase font-semibold text-center w-full"
            gutterBottom
          >
            ADD DOCTOR
          </Typography>
          <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            <Grid container spacing={2} justifyContent="center">
              {formData?.fields?.map((field, index) => {
                const gridItemSize = formData.fields.length === 1 ? 12 : 6;
                return (
                  <Grid item xs={gridItemSize} key={field.name}>
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
                          formik.touched[field.name] &&
                          formik.errors[field.name]
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
                          formik.touched[field.name] &&
                          formik.errors[field.name]
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
                          field.name === "BranchID"
                            ? handleBranchChange
                            : formik.handleChange
                        }
                        error={
                          formik.touched[field.name] &&
                          Boolean(formik.errors[field.name])
                        }
                        helperText={
                          formik.touched[field.name] &&
                          formik.errors[field.name]
                        }
                      >
                        {(field.name === "DepartmentID"
                          ? filteredDepartments
                          : field.options
                        ).map((option, optionIndex) => (
                          <MenuItem key={optionIndex+option.id} value={option.id}>
                            <div>
                              <p>{option?.option}</p>{" "}
                              <p
                                title={"Choose the window user works"}
                                className="text-slate-400"
                              >
                                {option?.subOption}
                              </p>{" "}
                            </div>
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                    {field.type === "MultiCheckBox" && (
                      <FormControl fullWidth margin="normal">
                        <InputLabel id="demo-multiple-checkbox-label">
                          procedures
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          fullWidth
                          value={selectedIds}
                          name={field.name}
                          onChange={handleChange}
                          input={<OutlinedInput label={field.name} />}
                          renderValue={(selected) =>
                            selected
                              .map(
                                (id) =>
                                  filteredprocedurs &&
                                  filteredprocedurs?.find(
                                    (name) => name.id === id
                                  )?.option
                              )
                              .join(", ")
                          }
                        >
                          {filteredprocedurs &&
                            filteredprocedurs?.map((option,i) => (
                              <MenuItem key={option?.id+i} value={option?.id}>
                                <Checkbox
                                  checked={
                                    selectedIds?.indexOf(option?.id) > -1
                                  }
                                />
                                <div>
                                  <p>{option?.option}</p>
                                  <p className="text-slate-400">
                                    {option?.subOption}{" "}
                                  </p>
                                </div>
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                );
              })}
            </Grid>
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
                onClick={() => formik.resetForm()}
                sx={{ bgcolor: "grey.500" ,width:"150px", height:"50px"}}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary"
              sx={{width:"150px", height:"50px"}}>
                Submit
              </Button>
            </div>
          </form>
        </Container>
      </div>
    </div>
  );
};

export default Add_DOC_Form;