/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useFormik } from "formik";
import TextFieldInput from "../../Utils/inputbox";
import SelectBox from "../../Utils/SelectBox";
import { Button } from "@mui/material";
import useToast from "../../../hooks/useToast";
import Axios from "../../../Config/axios";
import { useEffect, useMemo, useState } from "react";

const patientPreview = ({showModal,setShowModal,data,fetchData}) => {   
  const showToast = useToast();
  const [visitorTypes, setVisitorTypes] = useState([]);
  const [patientTypes, setPatientTypes] = useState([]);
  const [patientType,setPatientType] = useState('')
  const [visitorType,setVisitorType] = useState('')

   
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

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const DropdownData = await Axios.get(`/add-patient/${data?.BranchID}`);
        const visitorTypesData =
          DropdownData?.data?.VisitorTypes.map((obj) => ({
            type: obj?.type,
            id: obj?._id,
          })) || [];
        const patientTypesData =
          DropdownData?.data?.PatientTypes.map((obj) => ({
            type: obj?.type,
            id: obj?._id,
          })) || [];

        setVisitorTypes(visitorTypesData);
        setPatientTypes(patientTypesData);

      

      } catch (error) {
        showToast("Error fetching dropdown data", "error");
      }
    };

    if (data?.BranchID) fetchDropdownData();
  }, [data?.BranchID,   showToast]);


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
    // if (!isEmpty(values.city) && values.city.trim().length <= 2) {
    //   errors.city = "City must be more than 2 letters";
    // }
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
        PatientID: data?.PatientID || '',
        Name: data?.Name || '',
        age: data?.age || '',
        Gender: data?.Gender || '',
        phone: data?.phone || '',
        email: data?.email || '',
        address: data?.address?.address || '',
        city: data?.address?.city || '',
        state: data?.address?.state || '',
        country: data?.address?.country || '',
        pincode: data?.address?.pincode || '',
        VisitorTypeID:  visitorType || '',
        patientTypeID:  patientType|| '',
      },
    validate: validateFormFields,
    onSubmit: (values) => {
      Axios.post("/edit-patient", {
        PatientID: values.PatientID,
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
        VisitorTypeID: visitorTypes.find(obj => obj.type === values.VisitorTypeID)?.id || null,
        patientTypeID: patientTypes.find(obj => obj.type === values.patientTypeID)?.id || null,
        BranchID: validateID(data?.BranchID),
      })
        .then(({data}) => { 
          fetchData()
          showToast(data?.message, "success");
          setShowModal(false);
          formik.handleReset(); 
          
        })
        .catch((err) => {
          console.log("err", err.response.data.errors);
          showToast(err.response.data.errors, "error");
        }); 
    },
    enableReinitialize: true,
  });

  // Close modal function
  const closeModal = (e) => {
    if (e.target.id === "modal-backdrop") {
      setShowModal(false);
    }
  };

  // Prevent event propagation
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
 
  useEffect(()=>{    
    if(!formik.values.VisitorTypeID){
      setVisitorType(visitorTypes?.find(obj => obj.id === data?.VisitorTypeID._id)?.type || '')
    }
    if(!formik.values.patientTypeID){
      setPatientType(patientTypes?.find(obj => obj.id === data?.patientTypeID._id)?.type || '')
    }    
     
  },[data?.VisitorTypeID,data?.patientTypeID, formik.values.VisitorTypeID, formik.values.patientTypeID, patientTypes, visitorTypes ])

  
  return (
    <div>
      {showModal && (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            onClick={closeModal}
            id="modal-backdrop">
            <div
              className="relative w-auto my-6 mx-auto max-w-5xl"
              onClick={stopPropagation}>
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl font-semibold">Edit Patient</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}>
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-4 flex-auto">
                  <form
                    onSubmit={formik.handleSubmit}
                    className="w-full max-w-full mx-auto bg-white"
                  >
                    <div className="flex flex-wrap gap-3 justify-center items-center">
                      {formFields.map((field, i) => (
                        <div
                          key={i + field.name}
                          className="w-full max-w-[12rem]">
                          {field.type === "dropdown" ? (
                            <> 
                              <SelectBox
                              id={field.name}
                              label={field.label}
                              options={field.options}
                              className="capitalize w-1/5"
                              onChange={(selectedValue) =>
                                formik.setFieldValue(field.name, selectedValue)
                              }
                              value={ formik.values[field.name] || ''}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched[field.name] &&
                                Boolean(formik.errors[field.name])
                              }
                              helperText={
                                formik.touched[field.name] &&
                                formik.errors[field.name]
                              }/>
                            </>) : (
                            <TextFieldInput
                              label={field.label}
                              name={field.name}
                              value={formik.values[field.name]}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full"
                              disabled={field.disabled}
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
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-5 mt-8">
                      <Button
                        variant="contained"
                        onClick={() =>  setShowModal(false)}
                        sx={{ bgcolor: "grey.500" }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained" color="primary">
                        Submit
                      </Button>
                    </div>
                  </form>
                </div>
                
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </div>
  );
};

export default patientPreview;
