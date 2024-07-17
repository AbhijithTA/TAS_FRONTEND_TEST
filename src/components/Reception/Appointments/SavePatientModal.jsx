/* eslint-disable react/prop-types */
import { useFormik } from 'formik';
import { Button,   Dialog, DialogTitle, DialogContent } from '@mui/material';
import useToast from '../../../hooks/useToast';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Axios from "../../../Config/axios"
import SelectBox from '../../Utils/SelectBox';
import TextFieldInput from '../../Utils/inputbox';

const SavePatientModal = ({ ModalOpen, setModalOpen, data, fetchData }) => {  
    const showToast = useToast();
    const branch = localStorage.getItem("branch");
    const BranchID = branch?.split(",")[1];
    const [visitorTypes, setVisitorTypes] = useState([]);
    const [patientTypes, setPatientTypes] = useState([]);
    const [patientID, setPatientID] = useState("TM");
  
    const formFields = useMemo(
      () => [
        { label: "Patient ID", name: "PatientID", type: "text", disabled: true },
        { label: "Name", name: "Name", type: "text" },
        { label: "Age", name: "age", type: "number" },
        {
          label: "Gender",
          name: "Gender",
          type: "dropdown",
          options: [
            { id: "Male", type: "Male" },
            { id: "Female", type: "Female" },
            { id: "Other", type: "Other" },
          ],
        },
        { label: "Phone Number", name: "phone", type: "text" },
        { label: "Email", name: "email", type: "email" },
        { label: "Address", name: "address", type: "text" },
        { label: "city", name: "city", type: "text" },
        { label: "State", name: "state", type: "text" },
        { label: "country", name: "country", type: "text" },
        { label: "Pincode", name: "pincode", type: "text" },
        {
          label: "Visitor Type",
          name: "VisitorTypeID",
          type: "dropdown",
          options: visitorTypes,
        },
        {
          label: "Patient Type",
          name: "patientTypeID",
          type: "dropdown",
          options: patientTypes,
        },
      ],
      [patientTypes, visitorTypes]
    );
  
    const validateID = (ID) => {
      const isEmpty = (ID) =>
        !ID || (typeof value === "string" && ID.trim() === "");
      if (isEmpty(ID) && !/^[0-9a-fA-F]{24}$/.test(ID)) {
        return null;
      }
      return ID;
    };

  
  
    const fetchDropdownData = useCallback(async () => {
      try {
        const DropdownData = await Axios.get(`/add-patient/${BranchID}`);
        const visitorTypesData =
          DropdownData?.data?.VisitorTypes?.map((obj) => ({
            type: obj?.type,
            id: obj?._id,
          })) || [];
        const patientTypesData =
          DropdownData?.data?.PatientTypes?.map((obj) => ({
            type: obj?.type,
            id: obj?._id,
          })) || [];
  
        setVisitorTypes(visitorTypesData);
        setPatientTypes(patientTypesData);
        setPatientID(DropdownData?.data?.nextPatientID);
  
        formik.setFieldValue(
          "VisitorTypeID",
          visitorTypesData[0]?.type || "",
          false
        );
        formik.setFieldValue(
          "patientTypeID",
          patientTypesData[0]?.type || "",
          false
        );
      } catch (error) {
        showToast("Error fetching dropdown data", "error");
      }
    }, [BranchID]);
  
    useEffect(() => {
      if (BranchID) fetchDropdownData();
    }, [BranchID, fetchDropdownData, showToast]);
  
    const validateFormFields = (values) => {
      const errors = {};
      const isEmpty = (value) =>
        !value || (typeof value === "string" && value.trim() === "");
  
      // Mandatory Fields Validation
      if (isEmpty(values.Name)) errors.Name = "Name is required";
      if (isEmpty(values.Gender)) errors.Gender = "Gender is required";
  
      // Age Validation
      if (isEmpty(values.age)) {
        errors.age = "Age is required";
      } else {
        const ageValue = parseInt(values.age, 10);
        if (isNaN(ageValue) || ageValue < 1 || ageValue > 110) {
          errors.age = "Age must be a valid number between 1 and 110";
        }
      }
      if (isEmpty(values.city)) {
        errors.city = "City is required City must be more than 2 letters";
      } else if (values.city.trim().length < 2) {
        errors.city = "City must be more than 2 letters";
      }
  
      // Phone Validation
      if (isEmpty(values.phone)) {
        errors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(values.phone)) {
        errors.phone = "Phone number must be 10 digits";
      }
  
      // Custom Validations for Other Fields (only if they have values)
      if (!isEmpty(values.address) && values.address.trim().length <= 4) {
        errors.address = "Address must be more than 4 letters";
      } 
      if (!isEmpty(values.state) && values.state.trim().length <= 3) {
        errors.state = "State must be more than 3 letters";
      }
      if (!isEmpty(values.pincode) && !/^\d{6}$/.test(values.pincode)) {
        errors.pincode = "Pincode must be exactly 6 digits";
      }
      if (!isEmpty(values.country) && values.country.trim().length <= 3) {
        errors.country = "Country must be more than 3 letters";
      }
      return errors;
    }; 
    const formik = useFormik({
      initialValues: {
        PatientID: '',
        Name: data?.patient?.name,
        phone: data?.patient?.phone,
        email: data?.patient?.email,
        age: Number(data?.patient?.age),        
        address: data?.patient?.address,
        city: data?.patient?.place,
        state: data?.patient?.state,
        country: data?.patient?.country,
        pincode: data?.patient?.pincode,
        Gender: data?.patient?.gender?.toLowerCase(),
        VisitorTypeID: '',
        patientTypeID: '',
        BranchID: ''
      },  
      enableReinitialize: true,
      validate: validateFormFields,
      onSubmit: (values) => {
        Axios.post("/add-patient", {
          PatientID: patientID,
          Name: values.Name,
          phone: values.phone,
          email: values.email,
          age: Number(values.age),
          address: {
            address: values.address,
            city: values.city,
            state: values.state,
            country: values.country,
            pincode: values.pincode,
          },
          Gender: values.Gender,
          VisitorTypeID: validateID(
            visitorTypes.find((obj) => obj.type === values.VisitorTypeID)?.id ||
              null
          ),
          patientTypeID: validateID(
            patientTypes.find((obj) => obj.type === values.patientTypeID)?.id ||
              null
          ),
          BranchID: validateID(BranchID),
          appointment_id:data?._id

        })
          .then((response) => {
            showToast(response.data.message, "success"); 
            formik.handleReset(); 
            setModalOpen(false)
            fetchData()
          })
          .catch((err) => {
            console.log(err.response.data.errors);
            showToast(err.response.data.errors, "error");
          });
      },
    });

  return (
    <Dialog open={ModalOpen} onClose={() => setModalOpen(false)}>
     <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-full mx-auto bg-white"
    >
        <DialogTitle className='text-center
        '>Save Patient</DialogTitle>
        <DialogContent>
        <div className="flex flex-wrap gap-3 justify-center items-center">
        {formFields.map((field, i) => (
          <div key={i + field.name} className="w-full max-w-[15rem]">
            {field.type === "dropdown" ? (
              <SelectBox
                id={field.name}
                label={field.label}
                options={field.options}
                className="capitalize w-1/5"
                onChange={(selectedValue) =>
                  formik.setFieldValue(field.name, selectedValue)
                }
                value={formik.values[field.name] || null}
                onBlur={formik.handleBlur}
                error={
                  formik.touched[field.name] &&
                  Boolean(formik.errors[field.name])
                }
                helperText={
                  formik.touched[field.name] && formik.errors[field.name]
                }
              />
            ) : (
              <TextFieldInput
                label={field.label}
                name={field.name}
                value={
                  field.name === "PatientID"
                    ? patientID
                    : formik.values[field.name]
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full"
                disabled={field.disabled}
                error={
                  formik.touched[field.name] &&
                  Boolean(formik.errors[field.name])
                }
                helperText={
                  formik.touched[field.name] && formik.errors[field.name]
                }
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-8 mt-8">
        <Button
          variant="contained"
          onClick={() => {
            formik.resetForm() 
            setModalOpen(false) } }
          sx={{ bgcolor: "grey.500", width: "150px" }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" sx={{width:"150px"}}>
          Submit
        </Button>
      </div>

        </DialogContent>       
      </form>
    </Dialog>
  );
};

export default SavePatientModal;




