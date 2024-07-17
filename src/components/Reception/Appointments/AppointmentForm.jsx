/* eslint-disable react/prop-types */
import moment from "moment";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import Axios from "../../../Config/axios";
import Close from "../../../assets/svg/Close";

const MyForm = ({ closeModal, handleEventSubmit, selectedDate }) => {
  const [doctors, setDoctors] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState({ Name: "", phone: "", PatientID: "" });
  const [activeSearchField, setActiveSearchField] = useState("");
  const [patientList, setPatientList] = useState([]);
  const branch = localStorage.getItem("branch");
  const BranchID = branch?.split(",")[1];

  const handlePatient = (patient) => {
    formik.setFieldValue("name", patient?.Name);
    formik.setFieldValue("phone", patient?.phone);
    formik.setFieldValue("age", patient?.age);
    formik.setFieldValue("place", patient?.address?.city);
    formik.setFieldValue("email", patient?.email);
    formik.setFieldValue("gender", patient?.Gender);
    formik.setFieldValue("new_patient", false);
    formik.setFieldValue("patient_id", patient?.PatientID);
    formik.setFieldValue("patient_obj_id", patient._id);
    setSearch({ Name: "", phone: "", PatientID: "" });
    setActiveSearchField("");
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Example: only allows 10 digit phone numbers
    if (!phone) {
      return "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
      return "Invalid phone number";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation
    if (!email) {
      return "Email is required";
    } else if (!emailRegex.test(email)) {
      return "Invalid email address";
    }
    return "";
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      age: "",
      place: "",
      email: "",
      gender: "",
      new_patient: true,
      patient_id: "",
      date: selectedDate ? moment(selectedDate.start).format("YYYY-MM-DD") : "",
      time: selectedDate ? moment(selectedDate.start).format("HH:mm") : "",
      doctor_id: "",
      procedure: "",
      note: "",
      visit_type: "",
      patient_obj_id: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = "Name is required";
      }
      if (!values.phone) {
        errors.phone = "Phone number is required";
      } else {
        const phoneError = validatePhoneNumber(values.phone);
        if (phoneError) {
          errors.phone = phoneError;
        }
      }
      if (!values.age) {
        errors.age = "Age is required";
      } else if (isNaN(values.age)) {
        errors.age = "Age must be a number";
      }
      if (!values.place) {
        errors.place = "Place is required";
      }
      if (values.email) {
        const emailError = validateEmail(values.email);
        if (emailError) {
          errors.email = emailError;
        }
      }

      if (!values.doctor_id) {
        errors.doctor_id = "Doctor ID is required";
      }
      if (!values.visit_type) {
        errors.visit_type = "Visit type is required";
      }

      return errors;
    },
    onSubmit: (values) => { 
      const newEvent = {
        name: values.name,
        phone: values.phone,
        age: values.age,
        place: values.place,
        email: values.email,
        gender: values.gender,
        new_patient: values.new_patient,
        patient_id: values.new_patient ? null : values.patient_id,
        patient_obj_id: values.patient_obj_id,
        date_time: moment(`${values.date}T${values.time}`).toDate(),
        doctor_id: values.doctor_id,
        procedure: values.procedure,
        visit_type: values.visit_type,
        note: values.note,
        branch_id: BranchID,
      };
      handleEventSubmit(newEvent);
    },
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await Axios.get(`/search-patient/${BranchID}`, {
        params: { Name: search.Name, phone: search.phone, PatientID: search.PatientID },
      });
      setPatientList(response?.data?.patients);
    } catch (error) {
      console.error("Error fetching patient list:", error);
    }
  }, [BranchID, search]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      if (
        (search.Name.length > 0 || search.phone.length > 0 || search.PatientID.length > 0) &&
        formik.values.new_patient
      ) {
        fetchData();
      }
    }, 500);
    return () => clearTimeout(debounceFetch);
  }, [fetchData, formik.values.new_patient, search.Name.length, search.PatientID.length, search.phone.length]);

  useEffect(() => {
    Axios.get(`/admin/appointment?BranchID=${BranchID}`).then((resp) => {
      setDoctors(resp?.data?.doctors);
      setProcedures(resp?.data?.procedurs);
      setFilteredDoctors(resp?.data?.doctors);
    });
  }, [BranchID, selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      const day = moment(selectedDate.start).format("dddd");
      const filtered = doctors.filter((doctor) =>
        doctor.schedule.some(
          (schedule) =>
            schedule.day.toLocaleLowerCase() === day.toLocaleLowerCase() &&
            schedule.status === true
        )
      );
      setFilteredDoctors(filtered);
    }
  }, [selectedDate, doctors]);

  const handleNameChange = (e) => {
    if (formik.values.new_patient) {
      formik.setFieldValue("new_patient", true);
      formik.setFieldValue("patient_id", "");
      formik.setFieldValue("patient_obj_id", "");
    }
    formik.handleChange(e);
    setSearch((prev) => ({
      ...prev,
      Name: e.target.value,
    }));
    setActiveSearchField("Name");
  };

  const handlePhoneChange = (e) => {
    if (formik.values.new_patient) {
      formik.setFieldValue("new_patient", true);
      formik.setFieldValue("patient_id", "");
      formik.setFieldValue("patient_obj_id", "");
    }
    formik.handleChange(e);
    setSearch((prev) => ({
      ...prev,
      phone: e.target.value,
    }));
    setActiveSearchField("phone");
  };

  const handlePatientIDChange = (e) => {
    if (formik.values.new_patient) {
      formik.setFieldValue("new_patient", true);
      formik.setFieldValue("patient_id", "");
      formik.setFieldValue("patient_obj_id", "");
    }
    formik.handleChange(e);
    setSearch((prev) => ({
      ...prev,
      PatientID: e.target.value,
    }));
    setActiveSearchField("PatientID");
  };

  const handlePatientList = () => {
    if (
      (search.Name.length || search.phone.length || search.PatientID.length) &&
      patientList.length
    ) {
      return (
        <div className="absolute top-10 z-50 w-full bg-white border rounded-lg shadow mt-2">
          <div className="relative">
            <span
              className="absolute p-2 top-0 right-1 hover:cursor-pointer hover:bg-slate-200 rounded-full"
              onClick={() => {
                setSearch({ Name: "", phone: "", PatientID: "" });
                setActiveSearchField("");
              }}
            >
              <Close />
            </span>
          </div>
          {patientList.map((patient, index) => (
            <div key={index} className="border-b border-gray-200">
              <div
                className="p-4 border-b hover:bg-gray-100 transition duration-200 ease-in-out cursor-pointer"
                onClick={() => {
                  handlePatient(patient);
                }}
              >
                <p className="font-semibold text-gray-800">
                  {patient?.PatientID}
                </p>
                <p className="text-gray-600">{patient?.Name}</p>
                <p className="text-gray-600">{patient?.phone}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <div className="w-full h-auto flex items-center justify-center">
        <div className="bg-white">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Patient Details</h1>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Close />
            </button>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                  onChange={handleNameChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                />
                {formik.errors.name && formik.touched.name && (
                  <div className="text-red-500 mt-1">{formik.errors.name}</div>
                )}
                {activeSearchField === "Name" && handlePatientList()}
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="patient_id"
                  name="patient_id"
                  placeholder="Patient ID"
                  value={formik.values.patient_id}
                  onBlur={formik.handleBlur}
                  onChange={handlePatientIDChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                />
                {formik.errors.patient_id && formik.touched.patient_id && (
                  <div className="text-red-500 mt-1">{formik.errors.patient_id}</div>
                )}
                {activeSearchField === "PatientID" && handlePatientList()}
              </div>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Phone Number"
                  value={formik.values.phone}
                  onBlur={formik.handleBlur}
                  onChange={handlePhoneChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                />
                {formik.errors.phone && formik.touched.phone && (
                  <div className="text-red-500 mt-1">{formik.errors.phone}</div>
                )}
                {activeSearchField === "phone" && handlePatientList()}
              </div>
              <div className="relative">
                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder="Age"
                  onBlur={formik.handleBlur}
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                />
                {formik.errors.age && formik.touched.age && (
                  <div className="text-red-500 mt-1">{formik.errors.age}</div>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="place"
                  name="place"
                  placeholder="Place"
                  onBlur={formik.handleBlur}
                  value={formik.values.place}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                />
                {formik.errors.place && formik.touched.place && (
                  <div className="text-red-500 mt-1">{formik.errors.place}</div>
                )}
              </div>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  name="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                />
                {formik.errors.email && formik.touched.email && (
                  <div className="text-red-500 mt-1">{formik.errors.email}</div>
                )}
              </div>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.gender}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formik.errors.gender && formik.touched.gender && (
                  <div className="text-red-500 mt-1">
                    {formik.errors.gender}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 ">
               <div className="border px-4 py-2 w-1/2">
               <label htmlFor="new_patient" className="mr-2">
                  New Patient:
                </label>
                <input
                  type="checkbox"
                  name="new_patient"
                  id="new_patient"
                  readOnly
                  checked={formik.values.new_patient}
                />
              
                </div> 
                <div className="border py-2 w-1/2 truncate">
                  <span className="ml-2">
                  Patient ID:{" "} 
                  <span className="font-bold">{formik.values.patient_id}</span>
                </span>
                </div>
                
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-8">
              Appointment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  placeholder="Date"
                  onBlur={formik.handleBlur}
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                  disabled
                />
                {formik.errors.date && formik.touched.date && (
                  <div className="text-red-500 mt-1">{formik.errors.date}</div>
                )}
              </div>
              <div className="relative">
                <input
                  type="time"
                  id="time"
                  name="time"
                  placeholder="Time"
                  onBlur={formik.handleBlur}
                  value={formik.values.time}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                />
                {formik.errors.time && formik.touched.time && (
                  <div className="text-red-500 mt-1">{formik.errors.time}</div>
                )}
              </div>
              <div className="relative">
                <select
                  name="doctor_id"
                  id="doctor_id"
                  onBlur={formik.handleBlur}
                  value={formik.values.doctor_id}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Doctor</option>
                  {filteredDoctors.length <= 0 && (
                    <option value="">No Doctors</option>
                  )}
                  {filteredDoctors?.map((doctor) => {
                    return (
                      <option key={doctor?._id} value={doctor?._id}>
                        {doctor?.name}
                      </option>
                    );
                  })}
                </select>
                {formik.errors.doctor_id && formik.touched.doctor_id && (
                  <div className="text-red-500 mt-1">
                    {formik.errors.doctor_id}
                  </div>
                )}
              </div>
              <div className="relative">
                <select
                  name="procedure"
                  id="procedure"
                  value={formik.values.procedure}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Choose the Procedure</option>
                  {procedures.length <= 0 && (
                    <option value="">No procedures found</option>
                  )}
                  {procedures?.map((procedure) => {
                    return (
                      <option key={procedure?._id} value={procedure?._id}>
                        {procedure?.procedure}
                      </option>
                    );
                  })}
                </select>
                {formik.errors.procedure && formik.touched.procedure && (
                  <div className="text-red-500 mt-1">
                    {formik.errors.procedure}
                  </div>
                )}
              </div>
              <div className="relative md:col-span-2">
                <textarea
                  id="note"
                  name="note"
                  placeholder="Note"
                  value={formik.values.note}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                ></textarea>
                {formik.errors.note && formik.touched.note && (
                  <div className="text-red-500 mt-1">{formik.errors.note}</div>
                )}
              </div>
              <div className="relative md:col-span-2">
                <select
                  id="visit_type"
                  name="visit_type"
                  onBlur={formik.handleBlur}
                  value={formik.values.visit_type}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Visit Type</option>
                  <option value="consultation" className="uppercase">
                    Consultation
                  </option>
                  <option value="follow-up" className="uppercase">
                    Follow-up
                  </option>
                </select>
                {formik.errors.visit_type && formik.touched.visit_type && (
                  <div className="text-red-500 mt-1">
                    {formik.errors.visit_type}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
              >
                Submit
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MyForm;
