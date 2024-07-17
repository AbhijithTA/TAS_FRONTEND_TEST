/* eslint-disable react/prop-types */
import { IoIosClose } from "react-icons/io";
import { useEffect, useRef } from "react";

const AppointmentsModal = ({ isOpen, onClose, appointments }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const scheduledAppointments = appointments.filter(app => app.status === "scheduled");
  const completedAppointments = appointments.filter(app => app.status === "completed");
  const canceledAppointments = appointments.filter(app => app.status === "canceled");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div ref={modalRef} className="bg-white w-full max-w-6xl h-[80vh] p-4 rounded-lg">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-semibold">Appointments</h2>
          <button onClick={onClose}>
            <IoIosClose size={35} />
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <div className="flex-1 h-[60vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-600">Scheduled Appointments</h3>
              {scheduledAppointments.length > 0 ? (
                scheduledAppointments.map((appointment, index) => (
                  <div key={index} className="p-4 bg-gray-200 rounded-lg my-2">
                    <p>Doctor: {appointment.doctor_id?.name}</p>
                    <p>Procedure: {appointment.procedure_id?.procedure}</p>
                    <p>Status: {appointment.status}</p>
                    <p>Date: {new Date(appointment.date_time).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No Scheduled Appointments</p>
              )}
            </div>
            <div className="flex-1 h-[60vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-600">Completed Appointments</h3>
              {completedAppointments.length > 0 ? (
                completedAppointments.map((appointment, index) => (
                  <div key={index} className="p-4 bg-[#e5f8ea] rounded-lg my-2 ">
                    <p>Doctor: {appointment.doctor_id?.name}</p>
                    <p>Procedure: {appointment.procedure_id?.procedure}</p>
                    <p>Status: {appointment.status}</p>
                    <p>Date: {new Date(appointment.date_time).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No Completed Appointments</p>
              )}
            </div>
            <div className="flex-1 h-[60vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-600">Canceled Appointments</h3>
              {canceledAppointments.length > 0 ? (
                canceledAppointments.map((appointment, index) => (
                  <div key={index} className="p-4 bg-[#F8E5F4] rounded-lg my-2 ">
                    <p>Doctor: {appointment.doctor_id?.name}</p>
                    <p>Procedure: {appointment.procedure_id?.procedure}</p>
                    <p>Status: {appointment.status}</p>
                    <p>Date: {new Date(appointment.date_time).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No Canceled Appointments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsModal;
