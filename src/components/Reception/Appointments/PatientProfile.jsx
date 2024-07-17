/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useCallback, useEffect, useState } from "react";
import RescheduleModal from "./RescheduleModal";
import Axios from "../../../Config/axios";
import useToast from "../../../hooks/useToast";
import CancelModal from "./CancelModal";
import Swal from "sweetalert2";
import Save_Patient_Modal from "./SavePatientModal";
import CloseIcon from "../../../assets/svg/Close";
import { useNavigate } from "react-router-dom";

function AppointmentProfile({ event, onClose, open, fetchAppointments }) {
  const [savePatientModal, setSavePatientModal] = useState(false);
  const [eventData, setEventData] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reasonModal, setreasonModal] = useState(false);
  const [enableEdit, setEnableEdit] = useState(false);
  const [updatedValues, setUpdatedValues] = useState({
    visit_type: "",
    name: "",
    phone: "",
    age: "",
    place: "",
    email: "",
    gender: "",
  });
  const navigate = useNavigate();
  const tost = useToast();
  const fetchAppointment = useCallback(() => {
    Axios.get(`/admin/get-appointment/${event.id}`).then((resp) => {
      setEventData(resp?.data?.appointment);
      setSelectedDates(resp?.data?.appointments_dates);
    });
  }, [event.id]);

  useEffect(() => {
    if (event?.id) fetchAppointment();
  }, [event?.id, fetchAppointment]);

  const startDate = new Date(eventData?.date_time);

  const startTime = startDate?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const startDateString = startDate?.toDateString();

  const complete_appoinment = (status, id) => {
    Axios.put(`/admin/appointment_status/${id}`, { status: status })
      .then((resp) => {
        tost(resp.data.message, "success");
        fetchAppointment();
        fetchAppointments();
      })
      .catch((err) => {
        tost(err.response.data.errors, "error");
      });
  };

  const edit_appoinment = (updated_values, id) => {
    Axios.put(`/admin/edit-appointment/${id}`, updated_values)
      .then((resp) => {
        tost(resp.data.message, "success");

        fetchAppointment();
        setEnableEdit(false);
      })
      .catch((err) => {
        tost(err.response.data.errors, "error");
      });
  };

  const Cancel_appoinment = (reason, id) => {
    Axios.put(`/admin/appointment_status/${id}`, {
      status: "canceled",
      cancellationReason: reason,
    })
      .then((resp) => {
        tost(resp.data.message, "success");
        fetchAppointments();
        fetchAppointment();
        setreasonModal(false);
      })
      .catch((err) => {
        tost(err.response.data.errors, "error");
      });
  };

  useEffect(() => {
    setUpdatedValues((prev) => {
      return {
        ...prev,
        visit_type: event?.visit_type,
        name: event?.name,
        phone: event?.phone,
        age: event?.age,
        place: event?.place,
        email: event?.email,
        gender: event?.gender,
      };
    });
  }, [
    event?.age,
    event?.email,
    event?.gender,
    event?.name,
    event?.phone,
    event?.place,
    event?.visit_type,
  ]);

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {event && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              minWidth: 800,
              maxWidth: 800,
              minHeight: 600,
              maxHeight: 900,
              borderRadius: "10px",
            }}
          >
            <>
              <div className="flex justify-end ">
                <span
                  className="hover:scale-150 transition-transform duration-500 hover:cursor-pointer "
                  onClick={onClose}
                >
                  <CloseIcon />
                </span>
              </div>

              <Save_Patient_Modal
                fetchData={fetchAppointment}
                data={eventData}
                ModalOpen={savePatientModal}
                setModalOpen={setSavePatientModal}
              />

              <div className="flex gap-3 justify-center ">
                <div className="flex flex-col items-center justify-center gap-2 w-full mx-4 my-4">
                  <svg
                    id="Layer_1"
                    height="150"
                    width="150"
                    enableBackground="new 0 0 512 512"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="m256 511.44c140.724 0 255.5-114.655 255.5-255.379s-114.776-255.501-255.5-255.501-255.5 114.776-255.5 255.5 114.776 255.38 255.5 255.38z"
                      fill="#f0f1f4"
                      fillRule="evenodd"
                    />
                    <path
                      d="m178.474 176.509c0-42.738 34.778-77.509 77.526-77.509 42.739 0 77.509 34.771 77.509 77.509s-34.77 77.509-77.509 77.509c-42.748 0-77.526-34.77-77.526-77.509zm139.172 110.591h-123.344c-41.799 0-75.805 34.006-75.805 75.806v40.28c0 5.42 4.394 9.814 9.814 9.814h255.379c5.42 0 9.814-4.394 9.814-9.814v-40.228c-.001-41.828-34.03-75.858-75.858-75.858z"
                      fill="#5d6163"
                    />
                  </svg>
                  <input
                    type="text"
                    disabled={!enableEdit}
                    onChange={(e) => {
                      setUpdatedValues((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                    }}
                    className={` bg-white font-bold md:text-2xl text-center ${
                      enableEdit && "text-blue-800"
                    } outline-none`}
                    value={updatedValues?.name}
                  />
                  <input
                    type="text"
                    disabled={!enableEdit}
                    onChange={(e) => {
                      setUpdatedValues((prev) => ({
                        ...prev,
                        place: e.target.value,
                      }));
                    }}
                    className={` bg-white font-bold my-1 text-xl text-center ${
                      enableEdit && "text-blue-800"
                    } outline-none`}
                    value={updatedValues?.place}
                  />
                  <div className="flex justify-start items-center gap-5">
                    {!(
                      event?.patient_id ||
                      eventData?.patient_obj_id ||
                      event?.patient_obj_id
                    ) ? (
                      <>
                        {enableEdit ? (
                          <button
                            onClick={() => {
                              edit_appoinment(updatedValues, event.id);
                            }}
                            className="items-center p-2 border border-gray-300 rounded-md capitalize flex gap-2 font-bold"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#000000"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="feather feather-check-circle"
                            >
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                              <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            Save
                          </button>
                        ) : (
                          <button
                            className="p-2 items-center border border-gray-300 rounded-md capitalize flex gap-2 font-bold"
                            onClick={() => {
                              setEnableEdit(true);
                            }}
                          >
                            <svg
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="15px"
                              viewBox="0 0 528.899 528.899"
                              className="cursor-pointer"
                            >
                              <g>
                                <path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981 c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611 C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069 L27.473,390.597L0.3,512.69z" />{" "}
                              </g>
                              <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
                              <g> </g> <g> </g>
                              <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
                              <g> </g> <g> </g>
                              <g> </g>
                            </svg>
                            Edit
                          </button>
                        )}
                      </>
                    ) : (
                      <></>
                    )}

                    <button
                      onClick={() => {
                        {
                          event.patient_obj_id || eventData.patient_obj_id
                            ? navigate(
                                `/Patient-Profile/${
                                  event.patient_obj_id ||
                                  eventData.patient_obj_id
                                }`
                              )
                            : setSavePatientModal(true);
                        }
                      }}
                      className="p-2 border border-gray-300 rounded-md capitalize flex gap-2 font-bold"
                    >
                      {event.patient_obj_id || eventData.patient_obj_id
                        ? "profile"
                        : "Save Patient"}
                      <svg
                        height="20"
                        width="20"
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="m512 256c0 74.921875-32.191406 142.328125-83.488281 189.148438-45.511719 41.523437-106.050781 66.851562-172.511719 66.851562s-127-25.328125-172.511719-66.851562c-51.296875-46.820313-83.488281-114.226563-83.488281-189.148438 0-141.378906 114.621094-256 256-256s256 114.621094 256 256zm0 0"
                          fill="#ffaa20"
                        />
                        <path
                          d="m512 256c0 74.921875-32.191406 142.328125-83.488281 189.148438-45.511719 41.523437-106.050781 66.851562-172.511719 66.851562v-512c141.378906 0 256 114.621094 256 256zm0 0"
                          fill="#ff8900"
                        />
                        <path
                          d="m428.511719 444.128906v1.019532c-45.511719 41.523437-106.050781 66.851562-172.511719 66.851562s-127-25.328125-172.511719-66.851562v-1.019532c0-74.160156 47.042969-137.550781 112.863281-161.867187 18.589844-6.882813 38.6875-10.640625 59.648438-10.640625s41.058594 3.757812 59.660156 10.640625c65.820313 24.328125 112.851563 87.707031 112.851563 161.867187zm0 0"
                          fill="#7985eb"
                        />
                        <path
                          d="m428.511719 444.128906v1.019532c-45.511719 41.523437-106.050781 66.851562-172.511719 66.851562v-240.378906c20.960938 0 41.058594 3.757812 59.660156 10.640625 65.820313 24.328125 112.851563 87.707031 112.851563 161.867187zm0 0"
                          fill="#4b5be6"
                        />
                        <path
                          d="m361.808594 194.921875c0 58.339844-47.457032 105.8125-105.808594 105.8125-58.339844 0-105.808594-47.472656-105.808594-105.8125s47.46875-105.808594 105.808594-105.808594c58.351562 0 105.808594 47.46875 105.808594 105.808594zm0 0"
                          fill="#ffdba9"
                        />
                        <path
                          d="m361.808594 194.921875c0 58.339844-47.457032 105.8125-105.808594 105.8125v-211.621094c58.351562 0 105.808594 47.46875 105.808594 105.808594zm0 0"
                          fill="#ffc473"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="w-full md:my-4 text-xl ">
                  <div className="md:my-9 flex flex-col gap-3">
                    <label
                      htmlFor="contact"
                      className="inline bg-gray-100 pl-3 rounded-md"
                    >
                      Phone:
                      <input
                        type="text"
                        value={updatedValues?.phone}
                        disabled={!enableEdit}
                        onChange={(e) => {
                          setUpdatedValues((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }));
                        }}
                        id="contact"
                        className={`pl-3 inline uppercase bg-gray-100 ${
                          enableEdit && "text-blue-800"
                        } py-2 border-b outline-none`}
                      />
                    </label>
                    <label
                      htmlFor="Email"
                      className="inline bg-gray-100 pl-3 rounded-md"
                    >
                      Email:
                      <input
                        type="text"
                        value={updatedValues?.email || "N/A"}
                        disabled={!enableEdit}
                        onChange={(e) => {
                          setUpdatedValues((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }));
                        }}
                        id="Email"
                        className={`pl-3 inline uppercase ${
                          enableEdit && "text-blue-800"
                        } bg-gray-100 py-2 border-b outline-none`}
                      />
                    </label>
                    <label
                      htmlFor="Age"
                      className="inline bg-gray-100 pl-3 rounded-md"
                    >
                      Age:
                      <input
                        type="number"
                        value={updatedValues?.age}
                        disabled={!enableEdit}
                        onChange={(e) => {
                          setUpdatedValues((prev) => ({
                            ...prev,
                            age: e.target.value,
                          }));
                        }}
                        id="Age"
                        className={`pl-3 appearance-none inline uppercase bg-gray-100 py-2 ${
                          enableEdit && "text-blue-800"
                        } border-b outline-none`}
                      />
                    </label>
                    <label
                      htmlFor="gender"
                      className="inline bg-gray-100 pl-3 rounded-md"
                    >
                      gender:
                      <select
                        value={updatedValues?.gender}
                        disabled={!enableEdit}
                        onChange={(e) => {
                          setUpdatedValues((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }));
                        }}
                        id="gender"
                        className={`appearance-none pl-3 inline ${
                          enableEdit && "text-blue-800"
                        } uppercase bg-gray-100 py-2 border-b outline-none`}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                    <p className="capitalize bg-gray-100 px-3">
                      Patient ID : {event?.patient_id || "New Patient"}
                    </p>
                  </div>
                </div>
              </div>
              {showModal && (
                <RescheduleModal
                  showModal={showModal}
                  setShowModal={setShowModal}
                  event={eventData}
                  selectedDates={selectedDates}
                  fetchAppointments={fetchAppointments}
                  fetchAppointment={fetchAppointment}
                />
              )}
              {reasonModal && (
                <CancelModal
                  showModal={reasonModal}
                  setShowModal={setreasonModal}
                  Cancel_appoinment={Cancel_appoinment}
                  id={eventData._id}
                />
              )}
              <div className="capitalize my-3 bg-slate-200 px-7 rounded-md text-xl py-1">
                <p className="my-2">doctor : {event?.doctor}</p>
                <p className="my-2">Time: {startTime}</p>
                <p className="my-2">Date: {startDateString}</p>
                <p className="my-2">
                  procedure: {eventData?.procedure_id?.procedure}
                </p>
                <p className="my-2">notes : {event?.note}</p>
                {enableEdit ? (
                  <div className="my-2">
                    <label htmlFor="Visit" className=" ">
                      Visit :
                      <select
                        value={updatedValues?.visit_type}
                        disabled={!enableEdit}
                        onChange={(e) => {
                          setUpdatedValues((prev) => ({
                            ...prev,
                            visit_type: e.target.value,
                          }));
                        }}
                        id="Visit"
                        className="appearance-none pl-3 inline text-blue-800 capitalize bg-slate-200  outline-none">
                        <option value="consultation" className="uppercase px-5">
                          consultation
                        </option>
                        <option value="follow-up" className="uppercase px-5">
                          follow-up
                        </option>
                      </select>
                    </label>
                  </div>
                ) : (
                  <p className="my-2">Visit : {updatedValues?.visit_type}</p>
                )}
              </div>
              <div className="capitalize text-end my-3  bg-gray-100 p-1 px-3 rounded-md">
                <p className="font-bold text-xl flex  justify-between items-center">
                  <span>
                    {(eventData.status || event.status) === "canceled" ? (
                      <span>
                        Reason :
                        {
                          <span className="text-blue-400">
                            {eventData?.cancellationReason}
                          </span>
                        }{" "}
                      </span>
                    ) : (
                      ""
                    )}
                  </span>{" "}
                  <span>
                    {" "}
                    status :{" "}
                    <span className="text-blue-400">
                      {eventData.status}
                    </span>{" "}
                  </span>
                </p>
              </div>
              <div className="md:my-2 flex justify-center gap-8 ">
                <button
                  disabled={
                    (eventData.status || event.status) === "completed" ||
                    (eventData.status || event.status) === "canceled"
                      ? true
                      : false
                  }
                  className={`p-2 border  border-gray-300 rounded-md capitalize flex gap-2 font-bold ${
                    !(
                      (eventData.status || event.status) === "completed" ||
                      (eventData.status || event.status) === "canceled"
                    )
                      ? "bg-yellow-600 text-white font-bold py-2 px-4 rounded transform transition-transform duration-100 ease-in-out hover:scale-105 active:scale-95 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
                      : ""
                  }`}
                  onClick={() => {
                    setreasonModal(true);
                  }}
                >
                  Cancel Appointment
                </button>
                <button
                  disabled={
                    (eventData.status || event.status) === "completed" ||
                    (eventData.status || event.status) === "canceled"
                      ? true
                      : false
                  }
                  className={`  p-2 border  font-bold  border-gray-300 rounded-md   capitalize flex gap-2  ${
                    !(
                      (eventData.status || event.status) === "completed" ||
                      (eventData.status || event.status) === "canceled"
                    )
                      ? "bg-blue-500 text-white font-bold py-2 px-4 rounded transform transition-transform duration-100 ease-in-out hover:scale-105 active:scale-95 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
                      : ""
                  }`}
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  reschedule
                </button>
                {!(
                  new Date(startDateString).getTime() >=
                  new Date(today).getTime()
                ) ? (
                  <button
                    disabled={
                      (eventData.status || event.status) === "completed" ||
                      (eventData.status || event.status) === "canceled"
                        ? true
                        : false
                    }
                    onClick={() => {
                      if (
                        !(
                          new Date(startDateString).getTime() >=
                          new Date(today).getTime()
                        )
                      ) {
                        complete_appoinment("completed", eventData._id);
                      } else {
                        Swal.fire({
                          title: "Are you sure?",
                          text: "The appointment completion date does not match today's date.",
                          icon: "warning",
                          showCancelButton: true,
                          cancelButtonColor: "#d33",
                          confirmButtonColor: "#22c55e",
                          confirmButtonText: "Yes, Complete!",
                          customClass: {
                            container: "z-[9999]",
                          },
                        }).then((result) => {
                          if (result.isConfirmed) {
                            complete_appoinment("completed", eventData._id);
                          }
                        });
                      }
                    }}
                    className={`p-2 border  border-gray-300   rounded-md capitalize flex gap-2 font-bold ${
                      !(
                        (eventData.status || event.status) === "completed" ||
                        (eventData.status || event.status) === "canceled"
                      )
                        ? "bg-green-500  text-white font-bold py-2 px-4 rounded transform transition-transform duration-100 ease-in-out hover:scale-105 active:scale-95 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
                        : ""
                    }`}
                  >
                    complete
                  </button>
                ) : null}
              </div>
            </>
          </Box>
        )}
      </Modal>
    </>
  );
}

export default AppointmentProfile;
