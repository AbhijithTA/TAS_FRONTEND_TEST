// PatientProfile.js
import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate, Outlet, useParams } from "react-router-dom";
import Axios from "../../../Config/axios";
import {
  IoIosArrowForward,
  IoIosArrowDown,
  IoIosArrowUp,
} from "react-icons/io";
import { TextField, CircularProgress } from "@mui/material";
import man from "../../../assets/Gender/man.png";
import woman from "../../../assets/Gender/woman.png";
import calendar from "../../../assets/Patientprofile/calendar.png";
import doctors from "../../../assets/Patientprofile/doctors.png";
import calendarNew from "../../../assets/Patientprofile/calendarNew.png";
import invoices from "../../../assets/Patientprofile/invoices.png";
import clinicalNotes from "../../../assets/Patientprofile/clinicalNotes.png";
import paymentCredits from "../../../assets/Patientprofile/paymentCredits.png";
import consentForms from "../../../assets/Patientprofile/consentForms.png";
import treatment from "../../../assets/Patientprofile/treatment.png";
import test from "../../../assets/Patientprofile/test.png";
import consent from "../../../assets/Patientprofile/consent.png";
import EditPatientModal from "./../../Admin/Patients/patientPreview";
import AppointmentsModal from "./components/Appointments_Modal";
import ClinicalNoteForm from "./components/Clinical_Note_Form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { PatientProvider } from "../../../hooks/PatientContext";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCity } from "react-icons/fa";

const APPOINTMENT_LIMIT = 10;
// icon: calendar,
const TITLES = [
  {
    title: "Appointments",
    icon: calendarNew,
    link: "appointments",
  },
  {
    title: "Invoices",
    icon: invoices,
    link: "invoices",
  },
  { title: "Clinical Notes", icon: clinicalNotes, link: "clinicalNotes" },
  { title: "Payment Credits", icon: paymentCredits, link: "paymentCredits" },
  { title: "Consent Forms", icon: consentForms, link: "consentForms" },
];

const PatientProfile = ({ BranchID }) => {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [openGeneralInfo, setOpenGeneralInfo] = useState(true);

  const [clinicalHistory, setClinicalHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState([]);
  const [patientCredit, setPatientCredit] = useState([]);

  const jobRole = localStorage.getItem("jobRole");
  const navigate = useNavigate();

  const fetchPatientDetails = useCallback(async () => {
    try {
      const response = await Axios.get(`/patient-profile/${id}`);
      setPatient(response.data.patient);
      setInvoiceData(response.data.aggregatedResult.invoiceDetails);
      setPatientCredit(response.data.aggregatedResult.PatientCredit);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  }, [id]);

  const fetchClinicalNotes = useCallback(async () => {
    try {
      if (patient) {
        const response = await Axios.get(
          `/doctor/get-clinicalNote/${patient._id}`
        );
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

  const toggleGeneralInfo = () => {
    setOpenGeneralInfo(!openGeneralInfo);
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => app.patient_obj_id === id);
  }, [appointments, id]);

  const limitedScheduledAppointments = useMemo(() => {
    return filteredAppointments
      .filter((app) => app.status === "scheduled")
      .slice(0, APPOINTMENT_LIMIT);
  }, [filteredAppointments]);

  const limitedPastAppointments = useMemo(() => {
    return filteredAppointments
      .filter((app) => app.status === "completed" || app.status === "canceled")
      .slice(0, APPOINTMENT_LIMIT);
  }, [filteredAppointments]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row bg-gray-100">
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <CircularProgress />
        </div>
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
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-4"
                onClick={() => {
                  navigate(
                    `/patient-invoice/?BranchID=${BranchID}&PatientID=${id}`
                  );
                }}
              >
                Generate Invoice
              </button>
              <button onClick={() => setModalOpen(true)}>
                <svg
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  height="50"
                  image-rendering="optimizeQuality"
                  shape-rendering="geometricPrecision"
                  text-rendering="geometricPrecision"
                  viewBox="0 0 6.66666 6.66666"
                  width="50"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Layer_x0020_1">
                    <circle cx="3.333" cy="3.333" fill="#b3e5fc" r="3.227" />
                    <g fill="#212121" fill-rule="nonzero">
                      <path d="m5.5638.981654.120673.120677.00000787.00000787c.139228.139228.208843.322665.208843.506039 0 .18337-.0696142.366807-.208843.506035l-.00000787.00000787-3.2577 3.2577.00000394.00000394c-.0104409.0104409-.0230472.0173898-.036378.0208504l-1.51215.496748.00004724.00014173c-.0419724.0137874-.087185-.00906299-.100972-.0510354-.0060748-.0185-.0050315-.037626.00162598-.0544173l.495681-1.51319.075937.024689-.0760236-.0249055c.00422441-.0129016.0114252-.0239961.0205827-.0327795l3.25658-3.25658c.139232-.139232.322673-.20885.506047-.20885s.366815.0696181.506047.20885zm.00754724.233803-.120673-.120677c-.10798-.10798-.250425-.161976-.392921-.161976s-.284941.0539961-.392921.161976l-3.24442 3.24442-.442079 1.34955 1.34857-.443012 3.24444-3.24444.00000787-.00000787c.107976-.107976.161969-.250417.161969-.392909 0-.142496-.0539921-.284937-.161969-.392913l-.00000787-.00000787z" />
                      <path d="m1.45527 4.19122c-.0312362-.0312362-.0818898-.0312362-.113126 0s-.0312362.0818898 0 .113126l1.01964 1.01964c.0312362.0312362.0818898.0312362.113126 0s.0312362-.0818898 0-.113126z" />
                      <path d="m4.41438 1.23211c-.0312362-.0312362-.0818898-.0312362-.113126 0s-.0312362.0818898 0 .113126l1.01964 1.01964c.0312362.0312362.0818898.0312362.113126 0s.0312362-.0818898 0-.113126z" />
                      <path d="m4.30383 2.11491c.0312362-.0312362.0312362-.0818898 0-.113126s-.0818898-.0312362-.113126 0l-2.0789 2.0789c-.0312362.0312362-.0312362.0818898 0 .113126s.0818898.0312362.113126 0z" />
                      <path d="m4.66435 2.47542c.0312362-.0312362.0312362-.0818898 0-.113126s-.0818898-.0312362-.113126 0l-2.0789 2.0789c-.0312362.0312362-.0312362.0818898 0 .113126s.0818898.0312362.113126 0z" />
                      <path d="m1.50868 5.68263-.630429.207098.00004724.00014173c-.0419724.0137874-.087185-.00906299-.100972-.0510354-.0060748-.0185-.0050315-.037626.00162598-.0544173l.20665-.63085.075937.024689-.0760236-.0249055c.013752-.0419843.0589449-.0648701.100929-.0511181.0129016.00422441.0239961.0114252.0327795.0205827l.425835.425835.00000394-.00000394c.0312402.0312402.0312402.0818937 0 .113134-.0104409.0104409-.0230512.0173898-.0363819.0208504zm-.530343.00612205.36174-.118831-.243161-.243161z" />
                    </g>
                    <path
                      d="m4.47094 1.2886687.906516.906516.193902-.193902c.107976-.107976.161969-.250417.161969-.392909 0-.142496-.0539921-.284937-.161976-.392921l-.120673-.120677c-.10798-.10798-.250425-.161976-.392921-.161976s-.284941.0539961-.392921.161976l-.193894.193894z"
                      fill="#ef5350"
                    />
                    <path
                      d="m5.26433 2.30831-.906516-.906516-2.84599 2.84599.906516.906516zm-.713106.0539803c.0312362-.0312362.0818898-.0312362.113126 0s.0312362.0818898 0 .113126l-2.0789 2.0789c-.0312362.0312362-.0818898.0312362-.113126 0s-.0312362-.0818898 0-.113126zm-.24739-.360512c.0312362.0312362.0312362.0818898 0 .113126l-2.0789 2.0789c-.0312362.0312362-.0818898.0312362-.113126 0s-.0312362-.0818898 0-.113126l2.0789-2.0789c.0312362-.0312362.0818898-.0312362.113126 0z"
                      fill="#ffee58"
                    />
                    <path
                      d="m2.29426 5.25646-.88456-.88455-.25696.78442.35764.35764z"
                      fill="#ffcc80"
                    />
                    <path
                      d="m1.34008 5.56992-.24316-.24316-.118581.36199z"
                      fill="#616161"
                    />
                    <path
                      d="m5.06796 1.88569.239594-.894177c-.0782402-.0391378-.164008-.0587087-.249795-.0587087-.142496 0-.284941.0539961-.392921.161976l-.193894.193894.597016.597016z"
                      fill="#c24441"
                    />
                  </g>
                </svg>
              </button>
            </div>
            {modalOpen && (
              <EditPatientModal onClose={() => setModalOpen(false)} />
            )}
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
                    className="w-12 h-12 rounded-full"
                  />
                  <Link
                    to={titleItem.link}
                    className="text-gray-700 font-semibold"
                  >
                    {titleItem.title}
                  </Link>
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
                <div className="bg-white p-4 mt-2 rounded-lg ">
                  <div className="text-gray-700 space-y-3">
                    <div className="flex items-center">
                      <FaPhoneAlt className="text-gray-500 mr-2" />
                      <p>
                        <strong>Phone:</strong> {patient?.phone}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-500 mr-2" />
                      <p>
                        <strong>Email:</strong>{" "}
                        {patient?.email ? patient.email : "Not Provided"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-500 mr-2" />
                      <p>
                        <strong>Address:</strong> {patient?.address?.address}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FaCity className="text-gray-500 mr-2" />
                      <p>
                        <strong>City:</strong> {patient?.address?.city}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <PatientProvider
            value={{
              appointments,
              id,
              invoiceData,
              jobRole,
              clinicalHistory,
              patientCredit,
            }}
          >
            <div className="w-full lg:w-3/4 flex flex-col shadow-md  md:mx-4 md:my-4 ">
              <Outlet />
            </div>
          </PatientProvider>
        </>
      )}
      {modalOpen && (
        <EditPatientModal
          showModal={modalOpen}
          data={patient}
          setShowModal={setModalOpen}
        />
      )}
    </div>
  );
};

export default PatientProfile;
