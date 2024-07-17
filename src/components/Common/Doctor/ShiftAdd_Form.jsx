/* eslint-disable react/prop-types */ 
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import Axios from "../../../Config/axios"
import useToast from "../../../hooks/useToast";


const ShiftAssignmentForm = ({ setShowModal, shiftmodal, doctor, refresh,setData,
  setRefresh }) => {   
  const tost = useToast()
  const [shifts, setShifts] = useState([]);
  const [shift, setShift] = useState({ day: "None", start: "", end: "" ,status:true });
  const [err,setErr] = useState('')

const fetchdata = useCallback (async ()=>{ 
  const reverseFormattedShifts = (schedule) => {
    return schedule.reduce((acc, { day, slots, status }) => {
      slots.forEach(({ start, end }) => {
        acc.push({ day, start, end, status });
      });
      return acc;
    }, []);
  }; 
  setShifts(await reverseFormattedShifts(doctor.schedule))
 },[doctor.schedule])

useEffect(()=>{  
    fetchdata()
},[doctor.schedule, fetchdata])


  const handleSubmit = () => {
    if(!shifts.length) {
      setErr("Please add Slots")
      return
    }
    const formattedShifts = shifts.reduce((acc, { day, start, end,status }) => {
      const existingDay = acc.find(item => item.day === day);
      const slot = { start, end };
      if (existingDay) {
        existingDay.slots.push(slot);
      } else {
        acc.push({ day, slots: [slot] , status  });
      }
      return acc;
    }, []);

Axios.put(`/admin/Doctor/update-shift/${doctor._id}`,{shifts:formattedShifts}).then((res)=>{
   
  setRefresh(!refresh) 
  tost("successfully shift updated", "success");
  setData(res.data.updatedDoctor)
  setShowModal(false);
}).catch((err)=>{
  console.log(err)
  tost("err", "error");
})
  };

  const closeModal = (e) => {
    if (e.target.id === "modal-backdrop-1") {
      setShowModal(false);
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  const addShift = (newShift) => { 
    if(newShift.start === '' || newShift.end ===''){
      setErr("please set time");
      return;
    }
    if(newShift.day === 'None'){
      setErr("please select day");
      return;
    }
    if (newShift.start >= newShift.end) {
      setErr("Start time must be earlier than end time.");
      return;
    }
    setErr('')
    setShifts([...shifts, newShift]);
    setShift({ day: "none", start: "", end: "",status:true }); // Reset the form after adding

  };

  const handleRemoveShift = (index) => {
    setShifts(shifts.filter((_, i) => i !== index));
  };
  const handleHideShift = (index) => {
    setShifts(shifts.map((shift, i) => {
      if (i === index) {
        return { ...shift, status: !shift.status };
      }
      return shift;
    }));
  };

  return (
    <div>
      {shiftmodal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none"
            onClick={closeModal}
            id="modal-backdrop-1"
          >
            <div
              className="relative w-auto my-6 mx-auto max-w-3xl"
              onClick={stopPropagation}
            >
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="p-1">
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-[#6a696977] float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="relative px-6 pb-6 flex-auto bg-white rounded-xl">
                  <div className="p-4"> 
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2 items-center">
                          <select
                            value={shift.day}
                            onChange={(e) => setShift((prev) => ({ ...prev, day: e.target.value }))}
                            className="border p-2 flex-1"
                          >
                            {["None", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>
                          <input
                            type="time"
                            value={shift.start}
                            onChange={(e) => setShift((prev) => ({ ...prev, start: e.target.value }))}
                            className="border p-2 flex-1"  
                            name="time"      
                          />
                          <input
                            type="time"
                            value={shift.end}
                            onChange={(e) => setShift((prev) => ({ ...prev, end: e.target.value }))}
                            className="border p-2 flex-1"  
                                           
                          />
                          <button
                            type="button"
                            onClick={()=>{addShift(shift)}}
                            className="bg-blue-500 text-white px-2 py-2 rounded"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                      </div>
                       
                    {shifts.length > 0 && (
                      <table className="w-full mt-4 border-collapse">
                        <thead>
                          <tr>
                            <th className="border px-2 py-1">Day</th>
                            <th className="border px-2 py-1">Start Time</th>
                            <th className="border px-2 py-1">End Time</th>
                            <th className="border px-2 py-1">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shifts.map((shift, index) => (

                            <tr key={index}> 
                              <td className="border px-2 py-1">{shift.day}</td>
                              <td className="border px-2 py-1">{shift.start}</td>
                              <td className="border px-2 py-1">{shift.end}</td>
                              <td className="border px-2 py-1 flex justify-center items-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveShift(index)}
                                  className="text-red-500 px-2 py-1 rounded"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <div 
                                onClick={()=>{handleHideShift(index)}}
                                className={`relative toggle w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                                    shift.status ? "bg-[#28A745]" : "bg-[#6C757D]"
                                }`}
                              >
                                <span
                                  className={`absolute right-5 top-1 bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                                    shift.status ? "translate-x-full" : ""
                                  }`}
                                  style={{
                                    transform: `translateX(${
                                      shift.status ? "100%" : "0%"
                                    })`,
                                  }}
                                ></span>
                              </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    
                    )}
                    {err && <span className="text-red-800 capitalize pl-0.5 animate-pulse">{err}</span>}
                  </div>
                  <div className="flex justify-end mt-4">
                        <button
                          type="button"
                          className="mr-2 px-4 py-2 bg-gray-300 rounded"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          className="px-4 py-2 bg-blue-500 text-white rounded"
                          onClick={handleSubmit}
                        >
                          Assign Shifts
                        </button>
                      </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-40 fixed inset-0 z-30 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

export default ShiftAssignmentForm;
