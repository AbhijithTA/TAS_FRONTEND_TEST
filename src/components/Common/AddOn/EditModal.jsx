/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
} from "@mui/material";
import Axios from "../../../Config/axios";
import { useFormik } from "formik";
import showAlert from "../../../Utils/showAlert";
import { useCallback } from "react";

// Modal style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
};

const formOptions = [
  // Employees
  {
    name: "Employees",
    edit: "/admin/Employee/edit",
    fields: [
      { name: "firstName", label: "First Name", type: "text" },
      { name: "lastName", label: "Last Name", type: "text" },
      { name: "age", label: "Age", type: "number", required: true },
      {
        name: "Gender",
        label: "Gender",
        required: true,
        type: "dropdown",
        options: [
          { option: "Male", id: "Male" },
          { option: "Female", id: "Female" },
        ],
      },
      { name: "address", label: "Address", type: "text", required: true },
      { name: "email", label: "email", type: "text" },
      { name: "phone", label: "phone", type: "text" },
      { name: "designation", label: "Designation", type: "text" },
      { name: "role", label: "Role", type: "dropdown", options: [] },
      { name: "_id" },
    ],
  },
  // Branches
  {
    name: "Branches",
    edit: "/admin/Branch/edit",
    fields: [
      { name: "branchName", label: "Branch Name", type: "text" },
      { name: "address", label: "Address", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "state", label: "State", type: "text" },
      { name: "country", label: "Country", type: "text" },
      { name: "pincode", label: "Pincode", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "_id" },
    ],
  },
  // Departments
  {
    name: "Departments",
    edit: "/admin/Department/edit",
    fields: [
      { name: "Name", label: "Department Name", type: "text" },
      {
        name: "BranchName",
        label: "Branch",
        type: "text",
        options: [],
        disabled: true,
      },
      {
        name: "MainDepartmentID",
        label: "Main Department ",
        type: "dropdown",
        options: [], 
      },
      { name: "_id" },
      { name: "BranchID" },
    ],
  },
  // Procedures
  {
    name: "Procedures",
    edit: "/admin/Procedure/edit",
    fields: [
      { name: "procedure", label: "Procedure", type: "text" },
      { name: "description", label: "Description", type: "text" },

      {
        name: "gstOption",
        label: "GST Option",
        required: true,
        type: "dropdown",
        options: [
          { option: "Exception", id: "exception" },
          { option: "Non-exception", id: "non-exception" },
        ],
      },
      { name: "HSNCode", label: "HSN Code", type: "text" },
      { name: "GST", label: "GST", type: "number" },
      {
        name: "BranchName",
        label: "Branch",
        type: "text",
        options: [],
        disabled: true,
      },
      {
        name: "DepartmentName",
        label: "Department",
        type: "text",
        options: [],
        disabled: true,
      },
      { name: "_id" },
    ],
  },
  // Patient Types
  {
    name: "Patient Types",
    edit: "/admin/PatientType/edit",
    fields: [
      { name: "type", label: "Patient Type", type: "text" },
      { name: "description", label: "Description", type: "text" },
      { name: "_id" },
    ],
  },
  // Visitor Types
  {
    name: "Visitor Types",
    edit: "/admin/VisitorType/edit",
    fields: [
      { name: "type", label: "Patient Type", type: "text" },
      { name: "description", label: "Description", type: "text" },
      { name: "_id" },
    ],
  },
  // Payment Methods
  {
    name: "Payment Methods",
    edit: "/admin/PaymentMethod/edit",
    fields: [
      { name: "Method", label: "Payment Method", type: "text" },
      { name: "_id" },
    ],
  },
  // Alerts
  {
    name: "Alerts",
    edit: "/admin/Alert/edit",
    fields: [
      { name: "msg", label: "Message", type: "text" },
      {
        name: "type",
        label: "Alert Type",
        type: "dropdown",
        options: [
          { option: "Success", id: "Success" },
          { option: "Info", id: "Info" },
          { option: "Warning", id: "Warning" },
          { option: "Error", id: "Error" },
        ],
      },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      {
        name: "BranchName",
        label: "Branch",
        type: "text",
        options: [],
        disabled: true,
      },
      { name: "_id" },
    ],
  },
  // Doctors
  {
    name: "Doctors",
    edit: "/admin/Doctor/edit",
    fields: [
      { name: "name", label: "Doctor Name", type: "text", required: true },
      { name: "age", label: "Age", type: "number", required: true },
      { name: "Gender", label: "Gender", required: true, type: "dropdown", options: 
      [ { option: "Male", id: "Male" },{ option: "Female", id: "Female" } ] },
      { name: "specialization", label: "Specialization", required: true, type: "text" },
      { name: "email", label: "email", type: "text" },
      { name: "address", label: "Address", type: "text", required: true },
      { name: "phone", label: "Contact Number", type: "text", required: true },
      { name: "BranchID", label: "Branch", type: "dropdown", options: [], required: true },
      { name: "DepartmentID", label: "Department", type: "dropdown", options: [], required: true },
      { name: "procedureIds", label: "Procedure", type: "MultiCheckBox", options: [], required: true },
      { name: "_id" }, 
    ],
  },
  // Main Department
  {
    name: "Main Department",
    edit: "/admin/MainDepartment/edit",
    fields: [
      { name: "Name", label: "Department Name", type: "text", required: true },
      {
        name: "BranchID",
        label: "Branch",
        type: "dropdown",
        options: [],
        required: true,
      },
      { name: "_id" },
    ],
  },
];

const DynamicEditModal = ({
  open,
  onClose,
  initialData,
  selectedOptionName,
  refresh,
  setRefresh,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      formik.setValues("id", initialData._id);
      Axios.put(selectedOption.edit, values)
        .then((resp) => {
          showAlert(selectedOption.name, resp?.data?.message, "success");
          setRefresh(!refresh);
        })
        .catch((err) => {
          if (err)
            showAlert(
              selectedOption?.name,
              err?.response?.data?.error,
              "warning"
            );

          if (err.response) {
            if (err)
              showAlert(
                selectedOption?.name,
                Object.entries(err?.response?.data?.errors)?.map(
                  ([key, value]) => `${key}  ${value}`
                ),
                "warning"
              );
            setBackendError(err?.response?.data?.errors);
          } else if (err?.request) {
            setBackendError("No response was received from the server");
          } else {
            setBackendError("Error in setting up the request");
          }
          console.log(err);
        });
      if (!backendError) onClose();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (selectedOptionName === "Doctors") {
      const initialSelectedIds = initialData?.procedureIds?.map(
        (obj) => obj.id
      );
      setSelectedIds(initialSelectedIds);
    }
  }, [initialData?.procedureIds, selectedOptionName]);

  /// Doctors
  useEffect(() => {
    if (selectedOptionName === "Doctors") {
      Axios.get("/admin/edit-addOns")
        .then((resp) => {
          const branchOptions = resp?.data?.Branches?.map((branch) => ({
            option: branch?.branchName,
            id: branch?._id,
          }));
 
          const departmentOptions = resp?.data?.Departments?.map((dept) => ({
            option: dept.Name,
            id: dept._id,
            subOption: dept?.BranchID?.branchName,
          }));

          const procedureOptions = resp?.data?.Procedures?.map((proc) => ({
            option: proc?.procedure,
            id: proc?._id,
            subOption: proc?.BranchID?.branchName,
            BranchID:proc?.BranchID?._id
          }));

          // Update form options for BranchID and DepartmentID with fetched data
          const updatedFormOptions = formOptions?.map((option) => {
            if (option.name === "Doctors") {
              const updatedFields = option?.fields?.map((field) => {
                if (field.name === "BranchID") {
                  return { ...field, options: branchOptions };
                } else if (field.name === "DepartmentID") {
                  return { ...field, options: departmentOptions };
                } else if (field.name === "procedureIds") {
                  const updatedProcedureOptions = procedureOptions?.map(
                    (proc) => {
                      return {
                        ...proc,
                        selected: initialData?.procedureIds?.includes(proc.id),
                      };
                    }
                  );
                  return { ...field, options: updatedProcedureOptions };
                }
                return field;
              });
              return { ...option, fields: updatedFields };
            }
            return option;
          });

          setSelectedOption(
            updatedFormOptions.find(
              (option) => option.name === selectedOptionName
            )
          );
        })
        .catch((err) => console.log(err));
    } else if (selectedOptionName === "Main Department") {
      Axios.get("/admin/edit-addOns")
        .then((resp) => {
          const branchOptions = resp?.data?.Branches?.map((branch) => ({
            option: branch?.branchName,
            id: branch?._id,
          }));

          // Update form options for BranchID and DepartmentID with fetched data
          const updatedFormOptions = formOptions?.map((option) => {
            if (option.name === "Main Department") {
              const updatedFields = option?.fields?.map((field) => {
                if (field.name === "BranchID") {
                  return { ...field, options: branchOptions };
                }
                return field;
              });
              return { ...option, fields: updatedFields };
            }
            return option;
          });

          setSelectedOption(
            updatedFormOptions.find(
              (option) => option.name === selectedOptionName
            )
          );
        })
        .catch((err) => console.log(err));
    } else if (selectedOptionName === "Departments") {
      Axios.get("/admin/edit-addOns")
        .then((resp) => {
          // const branchOptions = resp?.data?.Branches?.map((branch) => ({
          //   option: branch?.branchName,
          //   id: branch?._id,
          // }));
          const Main_Departments = resp?.data?.MainDepartments?.map((Main) => ({
            option: Main?.Name,
            id: Main?._id,
            subOption: Main?.BranchID?.branchName,
            BranchID: Main?.BranchID?._id,
          }));

          // Update form options for BranchID and DepartmentID with fetched data
          const updatedFormOptions = formOptions?.map((option) => {
            if (option.name === "Departments") {
              const updatedFields = option?.fields?.map((field) => {
                if (field.name === "MainDepartmentID") {
                  return { ...field, options: Main_Departments };
                }
                return field;
              });
              return { ...option, fields: updatedFields };
            }
            return option;
          });

          setSelectedOption(
            updatedFormOptions.find(
              (option) => option.name === selectedOptionName
            )
          );
        })
        .catch((err) => console.log(err));
    } else if (selectedOptionName === "Employees") {
      Axios.get("/admin/edit-addOns")
        .then((resp) => {
          const RolesOptions = resp?.data?.Roles?.map((Role) => ({
            option: Role?.name,
            id: Role?._id,
          }));
          const updatedFormOptions = formOptions?.map((option) => {
            if (option.name === "Employees") {
              const updatedFields = option?.fields?.map((field) => {
                if (field.name === "role") {
                  return { ...field, options: RolesOptions };
                }
                return field;
              });
              return { ...option, fields: updatedFields };
            }
            return option;
          });

          setSelectedOption(
            updatedFormOptions.find(
              (option) => option.name === selectedOptionName
            )
          );
        })
        .catch((err) => console.log(err));
    }
  }, [selectedOptionName, initialData]);

  useEffect(() => {
    const optionConfig = formOptions?.find(
      (option) => option.name === selectedOptionName
    );
    setSelectedOption(optionConfig);

    const initialValues = optionConfig
      ? optionConfig?.fields?.reduce((acc, field) => {
          acc[field.name] = initialData[field.name] || "";
          return acc;
        }, {})
      : {};

    formik.setValues(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptionName, initialData]);

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setSelectedIds(value);
      formik.setFieldValue(name, value);
    },
    [formik]
  );

  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "number":
        return (
          <TextField
            fullWidth
            id={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            disabled={field.disabled}
            value={
              formik.values[field.name] !== undefined
                ? formik.values[field.name]
                : " "
            }
            onChange={formik.handleChange}
            margin="normal"
            required={field.required}
            hidden={field.hidden}
          />
        );
      case "dropdown":
        return (
          <TextField
            id={field.name}
            name={field.name}
            select
            label={field.label}
            variant="outlined"
            disabled={field.disabled}
            fullWidth
            margin="normal"
            value={formik?.values[field.name] || ""}
            onChange={formik?.handleChange}
          > 
            {(field.name === "MainDepartmentID" ?  field.options.filter((main)=>(main.BranchID === formik.values.BranchID)): field.options)?.map((option) => (
              <MenuItem key={option?.id} value={option.id}>
                <div>
                  <p className=" capitalize">{option.option}</p>{" "}
                  <p
                    title={"Choose the window user works"}
                    className="text-slate-400 capitalize"
                  >
                    {option.subOption}
                  </p>{" "}
                </div>
              </MenuItem>
            ))}
          </TextField>
        );
      case "date":
        return (
          <>
            <div className="relative">
              <label
                htmlFor={field.name}
                className={`block text-base font-normal text-gray-600 absolute truncate -top-3 left-3 bg-white px-1  `}
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type="date"
                className={`block w-full py-4 px-4 rounded-md text-base border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${
            formik.touched[field.name] && formik.errors[field.name]
              ? "border-red-500"
              : "border-gray-300"
          } mt-7`}
                value={formik.values[field.name] || " "}
                onChange={formik.handleChange}
                placeholder=" "
              />
              {formik.touched[field.name] && formik.errors[field.name] && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors[field.name]}
                </div>
              )}
            </div>
          </>
        );
      case "MultiCheckBox":
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-multiple-checkbox-label">
              {field.label}
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
                      field?.options &&
                      field.options?.find((name) => name.id === id)?.option
                  )
                  .join(", ")
              }
            > 
              {field?.options &&
                field?.options?.filter((opt)=>(opt.BranchID === formik.values.BranchID)).map((option) => (
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
        );
      default:
        return null;
    }
  };
  const gridItemSize = selectedOption?.fields.length === 1 ? 12 : 6;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="dynamic-modal-title"
      aria-describedby="dynamic-modal-description"
    >

      <Box sx={style}>
        <Typography
          id="dynamic-modal-title"
          variant="h4"
          className="text-center uppercase"
          component="h4"
          style={{ margin: "1rem" }}
        >
          <span className="">
            {" "}
            <strong>{selectedOptionName} </strong>
          </span>
        </Typography>
        <Typography
          id="dynamic-modal-title"
          variant="h6"
          j
          className="text-center uppercase"
          component="h6"
          style={{ margin: "1rem" }}
        >
          {" "}
          {formik.values[selectedOption?.fields[0].name]}
        </Typography>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {selectedOption?.fields?.map((field) => {
              if (
                field.name === "GST" &&
                formik.values["gstOption"] === "exception"
              ) {
                return null; // Skip rendering the Grid item and field altogether
              }
              return (
                <Grid item xs={gridItemSize} key={field.name}> 
                  {renderField(field)}
                </Grid>
              );
            })}
          </Grid>
          <Box textAlign="center" marginTop={2}>
            <Button color="error" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="primary" sx={{ marginLeft: 2 }}>
              Save
            </Button>
          </Box>
        </form>
        <div
          className={`w-full  justify-center items-center mt-4 animate-pulse duration-100 flex`}
        >
          <div
            className={`flex justify-center items-ce nter m-4  max-w-2xl p-5 text-red-600   ${
              backendError ? "flex border" : "hidden"
            }`}
          >
            {backendError && (
              <div>
                An error occurred: {JSON.stringify(backendError)}{" "}
                {console.log(backendError)}
              </div>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default DynamicEditModal;
