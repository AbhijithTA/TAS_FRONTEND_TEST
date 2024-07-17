/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import moment from "moment";
import { stringToColor } from "../../../Utils/StringToColor";

const AppointmentList = ({ eventData }) => {
  const [currentDateTime, setCurrentDateTime] = useState(moment());
  const [showTodayAppointments, setShowTodayAppointments] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(moment());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!eventData) {
    return null;
  }

  const appointments = Object.values(eventData);

  const futureAppointments = appointments.filter((appointment) =>
    moment(appointment.start).isAfter(currentDateTime)
  );

  futureAppointments.sort((a, b) => moment(a.start) - moment(b.start));

  const todayAppointments = appointments.filter((appointment) => {
    const startOfToday = moment().startOf("day");
    const endOfToday = moment().endOf("day");
    const appointmentDate = moment(appointment.start);
    return appointmentDate.isBetween(startOfToday, endOfToday, null, "[]");
  });

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 w-full">
      <div className="w-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 uppercase">
          Total Appointments:{" "}
          <span className="font-bold text-blue-600 animate-pulse">
            {showTodayAppointments ? todayAppointments.length : appointments.length}
          </span>
        </h1>
        <button
          onClick={() => setShowTodayAppointments(!showTodayAppointments)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md focus:outline-none hover:bg-blue-700 transition duration-300"
        >
          {showTodayAppointments ? "Show All Future Appointments" : "Show Today's Appointments"}
        </button>
      </div>

      <div className=" w-full border-b border-gray-300 mb-5"></div>

      <div className="relative w-full h-32">
      <div className="absolute top-0  flex w-full overflow-x-auto gap-4 custom-scrollbar">
        {showTodayAppointments ? (
          todayAppointments.length === 0 ? (
            <div className="text-center text-xl font-semibold text-gray-600 p-5 border border-gray-300 rounded-lg w-full">
              No appointments for today
            </div>
          ) : (
            todayAppointments.map((appointment, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex flex-col bg-white p-4 rounded-lg shadow-md relative w-72"
              >
                <div
                  className="absolute left-0 top-0 w-2 h-full rounded-tl-lg rounded-bl-lg"
                  style={{
                    backgroundColor: stringToColor(appointment?.doctor_id),
                  }}
                ></div>
                <h1 className="text-xl font-semibold text-gray-800 mb-2">
                  {appointment?.title || "Unknown Patient"}
                </h1>
                <p className="text-gray-600 mb-1">
                  {moment(appointment?.start).format("MMMM Do YYYY, h:mm a")}
                </p>
                <p className="text-blue-600 font-bold">
                  {appointment?.doctor || "No Doctor Assigned"}
                </p>
              </div>
            ))
          )
        ) : futureAppointments.length === 0 ? (
          <div className="text-center text-xl font-semibold text-gray-600 p-5 border border-gray-300 rounded-lg w-full">
            No upcoming appointments
          </div>
        ) : (
          futureAppointments.map((appointment, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex flex-col bg-white p-4 rounded-lg shadow-md relative w-72"
            >
              <div
                className="absolute left-0 top-0 w-2 h-full rounded-tl-lg rounded-bl-lg"
                style={{
                  backgroundColor: stringToColor(appointment?.doctor_id),
                }}
              ></div>
              <h1 className="text-xl font-semibold text-gray-800 mb-2">
                {appointment?.title || "Unknown Patient"}
              </h1>
              <p className="text-gray-600 mb-1">
                {moment(appointment?.start).format("MMMM Do YYYY, h:mm a")}
              </p>
              <p className="text-yellow-600 font-bold">
                {appointment?.doctor || "No Doctor Assigned"}
              </p>
            </div>
          ))
        )}
      </div>
      </div>
      <div className="w-full border-b border-gray-300 my-5"></div>
    </div>
  );
};

export default AppointmentList;
