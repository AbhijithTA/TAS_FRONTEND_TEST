/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "../../../hooks/useToast";

const DoctorsList = ({ appointmentList }) => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const tost = useToast();

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return date.toLocaleTimeString("en-US", options);
  };

  useEffect(() => {
    if (appointmentList) {
      setAppointments(appointmentList);
    }
  }, [appointmentList]);
  return (
    <div className="max-w-full mx-auto my-8 p-6 border rounded-md shadow-lg h-full">
      <h2 className="text-lg font-semibold mb-4 uppercase">
        Todays Appointments{" "}
      </h2>
      <div className="max-h-[450px] overflow-y-auto ">
        <table className="text-sm text-center text-gray-500 w-full">
          <thead className="text-xs text-gray-700 uppercase ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Patient Name
              </th>
              <th scope="col" className="px-6 py-3">
                Type - Procedure
              </th>
              <th scope="col" className="px-6 py-3">
                Time
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="">
            {appointments?.map((appointment, i) => {
              console.log(appointment);
              return (
                <tr
                  key={i}
                  onClick={() => {
                    if (!appointment.patient_obj_id) {
                     return tost("Please Save the Patient First", "error");
                    }
                    navigate(
                      `/doctor-panel/patient-profile/${appointment.patient_obj_id}`
                    );
                  }}
                  className={`border font-bold hover:cursor-pointer hover:bg-slate-100 rounded-xl ${
                    appointment.status === "scheduled"
                      ? "border-blue-200"
                      : appointment.status === "completed"
                      ? "border-green-200"
                      : appointment.status === "canceled"
                      ? "border-yellow-200"
                      : ""
                  }  `}
                >
                  <td className="px-6 py-4">
                    <span className="flex flex-col text-[#387ADF] hover:cursor-pointer capitalize">
                      {appointment.patient.name}{" "}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex flex-col capitalize">
                      {appointment?.visit_type}{" "}
                      {appointment?.procedure_id && (
                        <span className="text-red-700">{`${appointment?.procedure_id?.procedure} `}</span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {formatTime(appointment.date_time)}
                  </td>
                  <td className=" ">
                    <span
                      className={`px-6 py-4 border   text-black  uppercase rounded-xl ${
                        appointment.status === "scheduled"
                          ? "bg-blue-400"
                          : appointment.status === "completed"
                          ? "bg-green-400"
                          : appointment.status === "canceled"
                          ? "bg-yellow-400"
                          : ""
                      }`}
                    >
                      {appointment?.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-center items-center ">
          {appointments?.length === 0 && (
            <p className="text-center text-gray-500">No Appointments found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;
