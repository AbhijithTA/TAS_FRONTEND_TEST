import { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import Modal from "react-modal";
import MyForm from "./AppointmentForm";
import AppointmentList from "./AppointmentList";
import Appointmentprofile from "./PatientProfile";
import DoctorsList from "./DoctorsList";
import Axios from "../../../Config/axios";
import useToast from "../../../hooks/useToast";
import { stringToColor } from "../../../Utils/StringToColor";

const localizer = momentLocalizer(moment);
Modal.setAppElement("#root");
const officeStart = moment().set({ hour: 9, minute: 0, second: 0 });
const officeEnd = moment().set({ hour: 20, minute: 0, second: 0 });

const MyCalander = () => {
  const tost = useToast();
  const [events, setEvents] = useState([]);
  const [filterdevents, setFilteredEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ start: null, end: null });
  const [currentView, setCurrentView] = useState("week");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const branch = localStorage.getItem("branch");
  const BranchID = branch?.split(",")[1];
  const [showDoctorList,setShowDoctorList] = useState(false)

  // Open Modal
  const openModal = (start, end) => {
    setSelectedSlot({ start, end });
    setModalIsOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedSlot(null);
  };

  // Handle Date Click
  const handleDateClick = (slotInfo) => {
    if (currentView !== "month") {
      openModal(slotInfo.start, slotInfo.end);
    }
  };

  // Close Event Modal
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  // Fetch Appointments
  const fetchAppointments = useCallback(async () => {
    try {
      const { data } = await Axios.get(
        `/admin/get-appointments?BranchID=${BranchID}`
      );
      setDoctors(data.doctors);

      const matchDoctor = (id) => {
        const doctor = data.doctors.find((doc) => doc._id === id);
        return doctor ? doctor.name : "Unknown";
      };

      const updatedEvents = data.appointments.map((appointment) => ({
        title: appointment.patient?.name,
        start: moment(appointment?.date_time).toDate(),
        end: moment(appointment?.date_time).add(15, "minutes").toDate(),
        id: appointment?._id,
        doctor: matchDoctor(appointment?.doctor_id),
        doctor_id: appointment?.doctor_id,
        procedure_id: appointment?.procedure_id,
        note: appointment?.note,
        phone: appointment.patient?.phone,
        age: appointment.patient?.age,
        place: appointment.patient?.place,
        name: appointment.patient?.name,
        email: appointment.patient?.email,
        gender: appointment.patient?.gender,
        patient_id: appointment?.patient_id,
        patient_obj_id: appointment?.patient_obj_id,
        status: appointment?.status,
        visit_type: appointment?.visit_type,
        branch_id: appointment?.branch_id,
      }));

      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, [BranchID]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const matchDoctor = (id) => {
    const doctor = doctors.find((doc) => doc._id === id);
    return doctor ? doctor.name : "Unknown";
  };

  // Handle Event Submission
  const handleEventSubmit = (currentEvents) => {
    Axios.post(`/admin/set-appointment/${BranchID}`, currentEvents)
      .then((resp) => {
        const newEvent = {
          title: currentEvents?.name,
          start: moment(currentEvents?.date_time).toDate(),
          end: moment(currentEvents.date_time).add(15, "minutes").toDate(),
          doctor: matchDoctor(currentEvents?.doctor_id),
          doctor_id: currentEvents?.doctor_id,
          procedure_id: currentEvents?.procedure_id,
          id: resp?.data?.data?.id,
          note: currentEvents?.note,
          phone: currentEvents?.phone,
          age: currentEvents?.age,
          place: currentEvents?.place,
          name: currentEvents?.name,
          gender: currentEvents?.gender,
          email: currentEvents?.email,
          patient_id: currentEvents?.patient_id,
          patient_obj_id: currentEvents?.patient_obj_id,
          status: currentEvents?.status,
          visit_type: currentEvents?.visit_type,
          branch_id: currentEvents?.branch_id,
        };
        setEvents((prev) => [...prev, newEvent]);
        setFilteredEvents((prev) => [...prev, newEvent]);
        closeModal();
        fetchAppointments();
      })
      .catch((err) => {
        if (typeof err.response.data.errors === "string") {
          return tost(err.response.data.errors, "error");
        } else {
          Object.entries(err.response.data.errors).forEach(([key, message]) => {
            const error = key + message;
            tost(error.toLocaleUpperCase(), "error");
          });
        }
        console.log(err);
      });
  };

  // Custom Event Styling
  const eventPropGetter = (event) => {
    const backgroundColor = stringToColor(event.doctor_id) || "gray";
    const border =
      event.status === "canceled"
        ? "8px solid red"
        : event.status === "completed"
        ? "8px solid #00D100"
        : "8px solid gray";
    return {
      className: "custom-event text-black font-semibold ",
      style: {
        backgroundColor,
        display: "block",
        borderRight: "none",
        borderTop: "none",
        borderBottom: "none",
        borderLeft: border,
        outline: "2px solid transparent",
        outlineOffset: "2px",
      },
    };
  };
  const modalContentStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '2rem',
    borderRadius: '10px',
    outline: 'none',
    zIndex: 1001,
    maxWidth: '90%',
    maxHeight: '90%',
    overflowY: 'auto',
  };
  
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  };
  

  return (
    <div>
       
        { events && <AppointmentList setShowDoctorList={setShowDoctorList} eventData={filterdevents} /> }
      <div className="flex flex-row   px-10">
        <div
          className={`relative ${
            modalIsOpen ? "backdrop-blur-lg w-full" : "w-full"
          }   `}
        >
          <Calendar
            localizer={localizer}
            selectable
            defaultDate={new Date()}
            defaultView="week"
            onSelectSlot={handleDateClick}
            onView={(view) => setCurrentView(view)}
            events={filterdevents}
            timeslots={1}
            startAccessor="start"
            endAccessor="end"
            step={15}
            onSelectEvent={(event) => setSelectedEvent(event)}
            min={officeStart.toDate()}
            max={officeEnd.toDate()}
            eventPropGetter={eventPropGetter}
          />
        </div>
        <DoctorsList
          doctors={doctors}
          events={events}
          setFilteredEvents={setFilteredEvents}
        />
      </div>

      {selectedEvent && (
        <Appointmentprofile
          open={!!selectedEvent}
          event={selectedEvent}
          onClose={handleCloseModal}
          fetchAppointments={fetchAppointments}
        />
      )}
      <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Add Appointment"
      style={{
        content: modalContentStyle,
        overlay: modalOverlayStyle
      }}
    >
      <MyForm
        selectedDate={selectedSlot}
        closeModal={closeModal}
        handleEventSubmit={handleEventSubmit}
        setEvents={setEvents}
      />
    </Modal>
    </div>
  );
};

export default MyCalander;
