/* eslint-disable react/prop-types */

import   { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../../../Config/axios";
import { IoIosArrowForward, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { TextField,CircularProgress  } from '@mui/material';
import man from "../../../assets/Gender/man.png";
import woman from "../../../assets/Gender/woman.png";
import calendar from "../../../assets/Patientprofile/calendar.png";
import doctors from "../../../assets/Patientprofile/doctors.png";
import treatment from "../../../assets/Patientprofile/treatment.png";
import test from "../../../assets/Patientprofile/test.png";
import pencil from "../../../assets/Patientprofile/pencil.png";
import consent from "../../../assets/Patientprofile/consent.png";
import EditPatientModal from "./../../Admin/Patients/patientPreview";
import AppointmentsModal from "./Appointments_Modal";
import ClinicalNoteForm from "./Clinical_Note_Form";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";

const APPOINTMENT_LIMIT = 10;
const INITIAL_FORM_DATA = {
  date: "",
  chiefComplaint: "",
  historyOfPresentingIllness: "",
  pastMedicalHistory: "",
  notes: "",
  allergies: "",
};

const TITLES = [
  {
    title: "Appointments",
    icon: calendar,
    link: `/review-panel/Patient-Appointment/`,
  },
  {
    title: "Invoices",
    icon: doctors,
    link: `/review-panel/Patient-Invoices/`,
  },
  { title: "Clinical Notes", icon: treatment },
  { title: "Payment Credits", icon: test },
  { title: "Consent Forms", icon: consent },
];

const PatientProfile = ({id,BranchID}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [appointmentsModalOpen, setAppointmentsModalOpen] = useState(false);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]); 
  const [openGeneralInfo, setOpenGeneralInfo] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clinicalModelForm, setClinicalModelForm] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const [clinicalHistory, setClinicalHistory] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(true);

  const jobRole = localStorage.getItem("jobRole"); 
  const navigate = useNavigate()


  const fetchPatientDetails = useCallback(async () => {
    try {
      const response = await Axios.get(`/patient-profile/${id}`);
      setPatient(response.data.patient);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  }, [id]);

  const fetchClinicalNotes = useCallback(async () => {
    try {
      if (patient) {
        const response = await Axios.get(`/doctor/get-clinicalNote/${patient._id}`);
        setClinicalHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching clinical note:", error);
    }
  }, [patient]);

  const fetchAppointments = useCallback(async () => {
    try {
      if (patient?.BranchID) {
        const response = await Axios.get(`/admin/get-appointments`, {
          params: { BranchID: patient.BranchID },
        });
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, [patient]);

  useEffect(() => {
    fetchPatientDetails();
  }, [fetchPatientDetails]);

  useEffect(() => {
    if (patient) {
      fetchClinicalNotes();
      fetchAppointments();
    }
  }, [patient, fetchClinicalNotes, fetchAppointments]);

  const toggleSection = (index) => {
    setVisibleSections((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleEditClick = (index, item) => {
    setEditingIndex(index);
    setEditData({ ...item });
    setModalIsOpen(true);
  };

  const handleDeleteClick = async (index, item) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.delete(`/doctor/delete-clinicalNote/${patient?._id}`, { data: { clinicalNoteId: item?._id } });
          fetchClinicalNotes(); // Automatically update data
          Swal.fire(
            'Deleted!',
            'Your clinical note has been deleted.',
            'success'
          );
        } catch (err) {
          toast.error('Failed to delete clinical note');
          console.error('Error deleting clinical note:', err);
        }
      }
    });
  };

  const handleSaveClick = async () => {
    try {
      await Axios.put(`/doctor/edit-clinicalNote/${patient?._id}`, { clinicalNoteId: editData?._id, updatedNote: editData });
      toast.success("Clinical Note updated successfully");
      fetchClinicalNotes(); // Automatically update data
      setModalIsOpen(false);
      setEditingIndex(null);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormSubmit = async (formdata) => {
    try {
      const data = [formdata];
      await Axios.post(`/doctor/add-clinicalNote/${patient?._id}`, { data });
      toast.success("Clinical Note added successfully");
      setClinicalModelForm(false);
      fetchClinicalNotes(); // Automatically update data
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const toggleGeneralInfo = () => {
    setOpenGeneralInfo(!openGeneralInfo);
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => app.patient_obj_id === id);
  }, [appointments, id]);

  const limitedScheduledAppointments = useMemo(() => {
    return filteredAppointments.filter(app => app.status === "scheduled").slice(0, APPOINTMENT_LIMIT);
  }, [filteredAppointments]);

  const limitedPastAppointments = useMemo(() => {
    return filteredAppointments.filter(app => app.status === "completed" || app.status === "canceled").slice(0, APPOINTMENT_LIMIT);
  }, [filteredAppointments]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row bg-gray-100">
      {loading ? (
        <div className="flex justify-center items-center w-full h-full"><CircularProgress /></div>
      ) : (
        <>
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 bg-white shadow-md rounded-lg p-4 mb-6 lg:mb-0 lg:mr-4 md:mx-4 md:my-4">
            <div className="flex items-center mb-6">
              <img
                src={patient?.Gender === "Male" ? man : woman}
                alt="Avatar icon"
                className="w-16 h-16 mr-4"
              />
              <div>
                <h1 className="text-2xl font-semibold">{patient?.Name}</h1>
                <p className="text-gray-600">
                  {patient?.Gender}, {patient?.age}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-4" onClick={()=>{
              navigate(`/patient-invoice/?BranchID=${BranchID}&PatientID=${id}`)
              }}>
                Generate Invoice
              </button>
              {/* <img
                src={pencil}
                alt="edit icon"
                className="w-6 h-6 cursor-pointer"
                onClick={() => setModalOpen(true)}
              /> */}
            </div>
            {modalOpen && <EditPatientModal onClose={() => setModalOpen(false)} />}
            {/* Redirection Links */}
            <div className="space-y-4 mb-7">
              {TITLES.map((titleItem, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 py-2 hover:bg-gray-100 rounded-lg"
                >
                  <img
                    src={titleItem.icon}
                    alt={titleItem.title}
                    className="w-6 h-6"
                  />
                  {titleItem.link ? (
                    <Link
                      // to={titleItem.link}
                      className="text-gray-700 font-semibold"
                    >
                      {titleItem.title}
                    </Link>
                  ) : (
                    <span className="text-gray-700 font-semibold">
                      {titleItem.title}
                    </span>
                  )}
                  <IoIosArrowForward className="text-gray-400 ml-auto" />
                </div>
              ))}
            </div>
            {/* General Info */}
            <div className="mt-6">
              <div
                className="flex items-center hover:bg-gray-100 py-2 rounded-lg cursor-pointer"
                onClick={toggleGeneralInfo}
              >
                <h1 className="text-lg font-semibold">General Info</h1>
                <IoIosArrowForward
                  className={`text-gray-400 ml-auto transition-transform duration-200 ${
                    openGeneralInfo ? "rotate-90" : ""
                  }`}
                />
              </div>
              {openGeneralInfo && (
                <div className="text-gray-700 my-3">
                  <p>
                    <strong>Phone:</strong> {patient?.phone}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {patient?.email ? patient.email : "Not Provided"}
                  </p>
                  <p>
                    <strong>Address:</strong> {patient?.address?.address}
                  </p>
                  <p>
                    <strong>City:</strong> {patient?.address?.city}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 flex flex-col shadow-md  md:mx-4 md:my-4 ">
            {/* Appointments Section */}
            <div className="p-6 bg-white">
              <h1 className="text-2xl font-semibold mb-4">Appointments</h1>
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold uppercase text-gray-600 my-1">
                    Scheduled
                  </h2>
                  <div className="h-[6rem] overflow-x-auto">
                    {limitedScheduledAppointments.length > 0 ? (
                      limitedScheduledAppointments.map((appointment, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-200 rounded-lg mb-2 text-sm"
                        >
                          <h2 className="font-semibold">
                            {appointment.doctor_id?.name}
                          </h2>
                          <p className="font-semibold">
                            {appointment.procedure_id?.procedure}
                          </p>
                          <p className="font-semibold">{appointment.status}</p>
                          <p>{new Date(appointment.date_time).toLocaleString()}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-gray-100 rounded-lg">
                        <p>No Scheduled Appointments</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold uppercase text-gray-600 my-1">
                    Past Appointments
                  </h2>
                  <div className="h-[6rem] overflow-x-auto">
                    {limitedPastAppointments.length > 0 ? (
                      limitedPastAppointments.map((appointment, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg mb-2 text-sm ${
                            appointment.status === "canceled"
                              ? "bg-[#F8E5F4]"
                              : "bg-[#e5f8ea]"
                          }`}
                        >
                          <div>
                            <h2 className="font-semibold">
                              {appointment.doctor_id.name}
                            </h2>
                            <p className="font-semibold">
                              {appointment.procedure_id?.procedure}
                            </p>
                            <p>
                              {new Date(appointment.date_time).toLocaleString()}
                            </p>
                            <p>
                              Status:{" "}
                              {appointment.status.charAt(0).toUpperCase() +
                                appointment.status.slice(1)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-[#F8E5F4] rounded-lg">
                        <p>No Past Appointments</p>
                      </div>
                    )}
                  </div>
                    <Link
                      to="#"
                      className="text-blue-600 block"
                      onClick={() => setAppointmentsModalOpen(true)}
                    >
                  <div className="flex w-[6rem] items-center my-1 font-semibold ">
                      See More
                    <IoIosArrowDown className="text-gray-600 ml-auto font-semibold" />
                  </div>
                    </Link>
                </div>
              </div>
            </div>
            {/* Clinical history */}
            <div className="p-6 bg-white mt-4 w-full shadow-md rounded-md h-[22rem] overflow-x-auto">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Clinical History</h1>
                {(jobRole === 'doctor') && <h1
                  className="text-sm font-semibold"
                  onClick={() => setClinicalModelForm(true)}
                >
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-10 inline-block mr-1 cursor-pointer hover:text-blue-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </h1>}
              </div>
              {/* listing history */}
              <div>
                {clinicalHistory.length === 0 ? (
                  <p className="text-center text-gray-600 font-bold my-10">No history found</p>
                ) : null}
              
                {clinicalHistory.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 mb-4 border rounded my-7 bg-[#fceded]"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-md  uppercase">
                          <strong >Chief Complaint:</strong> {item.chiefComplaint}
                        </p>
                        <p>
                          <strong>Date:</strong> {new Date(item.date).toLocaleDateString()} 
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-7 ">
                        { (jobRole === 'doctor') && visibleSections[index] && (
                         <>
                          <p
                            className="cursor-pointer capitalize text-sm hover:underline hover:text-blue-600 text-gray-600"
                            onClick={() => handleEditClick(index, item)}
                          >
                            <FiEdit/>
                          </p>
                          <p
                            className="cursor-pointer capitalize text-sm hover:underline hover:text-red-600 text-gray-600"
                            onClick={() => handleDeleteClick(index, item)}
                          >
                            <AiFillDelete/>
                          </p>
                         </>
                          
                        )}
                        <p
                          className="cursor-pointer"
                          onClick={() => {
                            toggleSection(index);
                            setEditingIndex(null);
                          }}
                        >
                          {visibleSections[index] ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </p>
                      </div>
                    </div>
                    {visibleSections[index] && (
                      <div className="my-2 uppercase text-sm">
                        <p>
                          <strong>History of Presenting Illness:</strong>{" "}
                          {item.historyOfPresentingIllness}
                        </p>
                        <p>
                          <strong>Past Medical History:</strong>{" "}
                          {item.pastMedicalHistory}
                        </p>
                        <p>
                          <strong>Notes:</strong> {item.notes}
                        </p>
                        <p>
                          <strong>Allergies:</strong> {item.allergies}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Clinical Note Form */}
          <ClinicalNoteForm
            isOpen={clinicalModelForm}
            onClose={() => setClinicalModelForm(false)}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleFormSubmit}
          />

          <AppointmentsModal
            isOpen={appointmentsModalOpen}
            onClose={() => setAppointmentsModalOpen(false)}
            appointments={filteredAppointments}
          />

          {/* clinical history edit modal */}
          {modalIsOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-4 rounded shadow-lg w-1/3">
                <div className="flex justify-between">
                <h1>Edit Clinical History</h1>
                  <button onClick={() => setModalIsOpen(false)} className="text-xl">
                    &times;
                  </button>
                </div>
                <div className="my-4 flex flex-col gap-4">
                  <p>
                    <TextField
                      label="Chief Complaint"
                      type="text"
                      value={editData.chiefComplaint}
                      onChange={(e) =>
                        handleChange("chiefComplaint", e.target.value)
                      }
                      className="border p-2 mb-2 w-full"
                    />
                  </p>
                  <p>
                    <TextField
                      label="Date"
                      type="date"
                      value={editData.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                      className="border p-2 mb-2 w-full"
                    />
                  </p>
                  <p>
                    <TextField
                      label="History of Presenting Illness"
                      type="text"
                      value={editData.historyOfPresentingIllness}
                      onChange={(e) =>
                        handleChange("historyOfPresentingIllness", e.target.value)
                      }
                      className="border p-2 mb-2 w-full"
                    />
                  </p>
                  <p>
                    <TextField
                      label="Past Medical History"
                      type="text"
                      value={editData.pastMedicalHistory}
                      onChange={(e) =>
                        handleChange("pastMedicalHistory", e.target.value)
                      }
                      className="border p-2 mb-2 w-full"
                    />
                  </p>
                  <p>
                    <TextField
                      label="Notes"
                      type="text"
                      value={editData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      className="border p-4 mb-2 w-full"
                    />
                  </p>
                  <p>
                    <TextField
                      label="Allergies"
                      type="text"
                      value={editData.allergies}
                      onChange={(e) => handleChange("allergies", e.target.value)}
                      className="border p-2 mb-2 w-full"
                    />
                  </p>
                  <button
                    onClick={handleSaveClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientProfile;
