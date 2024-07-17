/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { TextField, MenuItem } from "@mui/material";
import Axios from "../../../Config/axios";
import { toast } from "react-toastify";

const AlertForm = () => {
  const [formErrors, setFormErrors] = useState({});
  const [branches, setBranches] = useState([]);

  const validate = (values) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const errors = {};
    if (!values.msg) {
      errors.msg = "Required";
    } else if (values.msg.length < 3) {
      errors.msg = "Must be 3 characters or more";
    }

    if (!values.BranchID) {
      errors.BranchID = "Required";
    }

    if (!values.type) {
      errors.type = "Required";
    }

    if (values.startDate) {
      const startDateObj = new Date(values.startDate);
      startDateObj.setHours(0, 0, 0, 0);

      if (startDateObj < today) {
        errors.startDate = "Start date must be today or a future date";
      }
    } else {
      errors.startDate = "Start date is required";
    }

    // Check if end date is provided
    if (!values.endDate) {
      errors.endDate = "End date is required";
    }

    // Check if end date is after the start date
    if (
      values.startDate &&
      values.endDate &&
      new Date(values.startDate) > new Date(values.endDate)
    ) {
      errors.endDate = "End date must be after start date";
    }

    setFormErrors(errors);
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      msg: "",
      BranchID: "",
      type: "",
      startDate: "",
      endDate: "",
    },
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await Axios.post("/admin/set-alert", values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.success("Alert Submitted");
        resetForm();
      } catch (error) {
        toast.error("Something went wrong !");
      }
    },
    validate,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get("/admin/Get-Branches", {});
        setBranches(response?.data?.Branches);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="max-w-full mx-auto my-8 p-6 border rounded-md shadow-lg">
      <h2 className="text-lg font-semibold text-center mb-4">ALERT</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-4 mb-4">
          <TextField
            id="msg"
            name="msg"
            label="Message"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formik.values.msg}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.msg && Boolean(formErrors.msg)}
            helperText={formik.touched.msg && formErrors.msg}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <TextField
            id="BranchID"
            name="BranchID"
            select
            label="BranchID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formik.values.BranchID}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.BranchID && Boolean(formik.errors.BranchID)}
            helperText={formik.touched.BranchID && formik.errors.BranchID}
          >
            {branches.map((branch) => (
              <MenuItem key={branch._id} value={branch._id}>
                {branch.branchName}{" "}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="type"
            name="type"
            select
            label="Message Type"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
          >
            <MenuItem value="Success" className="bg-green-200">
              Success
            </MenuItem>
            <MenuItem value="Info" className="bg-yellow-200">
              Info
            </MenuItem>
            <MenuItem value="Error" className="bg-red-200">
              Error
            </MenuItem>
            <MenuItem value="Warning" className="bg-orange-200">
              Warning
            </MenuItem>
          </TextField>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative mt-4">
            <label
              htmlFor="startDate"
              className="block text-base font-normal text-gray-600 absolute -top-3 left-3 bg-white px-1"
            >
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              className="block w-full py-2 px-4 rounded-md text-base border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <span className="text-red-500 text-xs">
                {formik.errors.endDate}
              </span>
            )}
          </div>

          <div className="relative mt-4">
            <label
              htmlFor="endDate"
              className="block text-base font-normal text-gray-600 absolute -top-3 left-3 bg-white px-1"
            >
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              className="block w-full py-2 px-4 rounded-md text-base border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <span className="text-red-500 text-xs">
                {formik.errors.endDate}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 border rounded-md">CANCEL</button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#387ADF] text-white border rounded-md"
          >
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlertForm;
