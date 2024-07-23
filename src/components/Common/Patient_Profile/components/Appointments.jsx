// Appointments.js
import React, { useCallback,useMemo,useState } from "react";
import { usePatient } from "../../../../hooks/PatientContext";
import { Link, useNavigate } from "react-router-dom";
import {
  IoIosArrowForward,
  IoIosArrowDown,
  IoIosArrowUp,
} from "react-icons/io";
import AppointmentsModal from "./Appointments_Modal";

const Appointments = () => {
  const { appointments, patientInfo,id } = usePatient();
  const APPOINTMENT_LIMIT = 10;
  const [appointmentsModalOpen, setAppointmentsModalOpen] = useState(false);

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
    <>
    <div className="p-6 bg-white h-full">
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
                    <p>{new Date(appointment.date_time).toLocaleString()}</p>
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
    <AppointmentsModal
    isOpen={appointmentsModalOpen}
    onClose={() => setAppointmentsModalOpen(false)}
    appointments={filteredAppointments}
    />
    </>
  );
};

export default Appointments;
