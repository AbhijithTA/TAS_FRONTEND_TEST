/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import Datefilter from "../../Utils/Date filter button";
import AgeRangeDialog from "../../Utils/AgeSelectionForm";
import { Box, Grid, Button, TextField, MenuItem, FormControl, InputLabel, Select, OutlinedInput, Checkbox } from "@mui/material";
import { useFormik } from "formik";

function Filter({ setFilterOpen,  dropdownData, filterSubmit }) {
  const branch = localStorage.getItem("branch");
  const BranchID = branch?.split(",")[1];
  const [dropDownData, setDropdownData] = useState(dropdownData);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [ageModalOpen, setAgeModalOpen] = useState(false);
  const [ageRange, setAgeRange] = useState({ StartAge: "", EndAge: "" });
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedIds, setSelectedIds] = useState([]);
  useEffect(() => {
    setDropdownData(dropdownData);
  }, [dropdownData]);

  useEffect(() => {
    // Initially set all data to be displayed if no branch is selected
    setFilteredDepartments(
      dropdownData.find((list) => list.name === "DepartmentID")?.options || []
    );
    setFilteredProcedures(
      dropdownData.find((list) => list.name === "ProcedureID")?.options || []
    );
    setFilteredDoctors(
      dropdownData.find((list) => list.name === "doctorID")?.options || []
    );
  }, [dropdownData]);

  const formik = useFormik({
    initialValues: {
      BranchID: BranchID,
      doctorID: "",
      DepartmentID: "",
      ProcedureID: [],
      GST: "",
      paymentMethod: "",
      createdBy: "",
      startDate: "",
      endDate: "",
      visitorTypeId: "",
      patientTypeId: "",
      StartAge: "",
      EndAge: "",
      Gender: "",
    },
    onSubmit: (values) => { 
      const formData = { ...values, ...ageRange, ...dateRange };

      filterSubmit(formData);
    },
  });

  const handleReset = (e)=>{
    setAgeRange({ StartAge: "", EndAge: "" });
    setDateRange({ startDate: "", endDate: "" })
    setSelectedIds([])
    setSelectedDateRange("")
    formik.handleReset(e)
    filterSubmit({BranchID: BranchID,});
  }

  useEffect(() => {
    // Filter departments, procedures, and doctors based on the selected branch
    if (formik.values.BranchID) {
      setFilteredDepartments(
        dropdownData
          .find((list) => list.name === "DepartmentID")
          ?.options.filter(
            (option) => option.branchID === formik.values.BranchID
          ) || []
      );
      setFilteredProcedures(
        dropdownData
          .find((list) => list.name === "ProcedureID")
          ?.options.filter(
            (option) => option.branchID === formik.values.BranchID
          ) || []
      );
      setFilteredDoctors(
        dropdownData
          .find((list) => list.name === "doctorID")
          ?.options.filter(
            (option) => option.branchID === formik.values.BranchID
          ) || []
      );
    } else {
      // If no branch is selected, show all data
      setFilteredDepartments(
        dropdownData.find((list) => list.name === "DepartmentID")?.options || []
      );
      setFilteredProcedures(
        dropdownData.find((list) => list.name === "ProcedureID")?.options || []
      );
      setFilteredDoctors(
        dropdownData.find((list) => list.name === "doctorID")?.options || []
      );
    }
  }, [
    formik.values.BranchID,
    formik.values.ProcedureID,
    formik.values.DepartmentID,
    dropdownData,
  ]);

  useEffect(() => {
    // Filter procedures based on the selected department
    if (formik.values.DepartmentID) {
      setFilteredProcedures(
        dropdownData
          .find((list) => list.name === "ProcedureID")
          ?.options.filter(
            (option) => option.DepartmentID === formik.values.DepartmentID
          ) || []
      );
      setFilteredDoctors(
        dropdownData
          .find((list) => list.name === "doctorID")
          ?.options.filter(
            (option) => option.DepartmentID === formik.values.DepartmentID
          ) || []
      );
    }
  }, [formik.values.DepartmentID, formik.values.BranchID, dropdownData]);

  const handleAgeSubmit = useCallback((ageValues) => {
    setAgeRange(ageValues);
    setAgeModalOpen(false);
  }, []);

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setSelectedIds(value);  
      formik.setFieldValue(name, value);
    },
    [formik]
  );



  return (
    <Box className="relative w-full px-5 py-5">
      <button
        className="uppercase text-lg font-bold w-min py-1 rounded-lg cursor-pointer flex items-center gap-2"
        onClick={() => setFilterOpen((prevState) => !prevState)}
      >
        Filter
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </button>

      <form onSubmit={formik.handleSubmit} className="w-full">
        <div className="flex flex-wrap mb-4">
          {dropDownData?.map((list) => (
            <div
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2"
              key={list.name}
            >
              {list.type === "dropdown" ? (
                <TextField
                  id={list.name}
                  name={list.name}
                  label={list.label}
                  select
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={
                    formik.values[list.name] !== undefined &&
                    formik.values[list.name] !== null
                      ? formik.values[list.name]
                      : ""
                  }
                  onChange={formik.handleChange}
                >
                  <MenuItem key={"XX"} value={null}>
                    None
                  </MenuItem>
                  {(list.name === "DepartmentID"
                    ? filteredDepartments
                    : list.name === "doctorID"
                    ? filteredDoctors
                    
                    : list.options
                  ).map(
                    (option) =>
                      option.id !== null && (
                        <MenuItem key={option.id} value={option.id}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            width="100%"
                          >
                            <Box flexGrow={1}>{option.option} </Box>
                            <Box
                              fontStyle="revert"
                              color="text.secondary"
                              textAlign="right"
                              flexShrink={0}
                              marginLeft={2}
                            >
                              {option.subOption}
                              {option.branchName
                                ? ` (${option.branchName})`
                                : ""}
                            </Box>
                          </Box>
                        </MenuItem>
                      )
                  )}
                </TextField>
              ) : list.type === "MultiCheckBox" ? (<FormControl fullWidth margin="normal">
              <InputLabel id="demo-multiple-checkbox-label">
                procedures
              </InputLabel> 
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                fullWidth
                value={formik.values[list.name] || " "}
                
                name={list.name}
                onChange={handleChange}
                input={<OutlinedInput label={list.label} />}
                renderValue={(selected) =>
                  selected
                    ?.map(
                      (id) =>
                      filteredProcedures &&
                      filteredProcedures?.find((name) => name.id === id)?.option
                    )
                    .join(", ")
                }
              >
                {filteredProcedures &&
                  filteredProcedures?.map((option) => (
                    <MenuItem key={option?.id} value={option?.id}>
                      <Checkbox checked={selectedIds?.indexOf(option?.id) > -1} />
                      <div>
                        <p>{option?.option}</p>
                        <p className="text-slate-400">{option?.subOption} </p>
                      </div>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>): (
                <TextField
                  id={list.name}
                  name={list.name}
                  label={list.label}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formik.values[list.name] || ""}
                  onChange={formik.handleChange}
                />
              )}
            </div>
          ))}
        </div>

        <Grid item xs={12} container className="gap-5 px-2">
          <Datefilter
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
            setFinalDateRange={setDateRange}
          />
          <Button variant="outlined" onClick={() => setAgeModalOpen(true)}>
            {ageRange.StartAge && ageRange.EndAge
              ? ` ${ageRange.StartAge}-${ageRange.EndAge}`
              : "Age"}
          </Button> 
        </Grid>

        <Grid item xs={12} className="px-2">
          <div className="flex gap-4 mt-6">
            <Button
              onClick={() => setFilterOpen(false)}
              variant="contained"
              color="error"
            >
              Close
            </Button>
            <Button
              onClick={handleReset}
              variant="outlined"
              color="secondary"
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#387ADF", color: "#FFFFFF" }}
            >
              Submit
            </Button>
          </div>
        </Grid>
      </form>

      <AgeRangeDialog
        ModalOpen={ageModalOpen}
        setModalOpen={setAgeModalOpen}
        Submit={handleAgeSubmit}
    />
</Box>
  );
}

export default Filter;