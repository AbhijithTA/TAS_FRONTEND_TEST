/* eslint-disable react/prop-types */
import  { useState } from 'react';
import Axios from "../../../Config/axios"
import useToast from '../../../hooks/useToast';

const RescheduleModal = ({ showModal, setShowModal, event,selectedDates,fetchAppointments,fetchAppointment }) => {

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const tost = useToast() 

  const closeModal = (e) => {
    if (e.target.id === 'modal-backdrop-2') {
      setShowModal(false);
    }
  };  
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleSave = () => {
    if (selectedDate && selectedTime) {  
      const combinedDateTime = new Date(`${selectedDate} ${selectedTime}`); 
      Axios.put(`/admin/reschedule_appointment/${event._id}`,{date_time:combinedDateTime}).then((resp)=>{
        tost(resp?.data?.message,"success") 
        fetchAppointments()
        fetchAppointment()
      }).catch((err)=>{ 
        tost(err.response?.data?.errors,"error") 
      })
      setShowModal(false);
    } else {
      tost('Please select a date and time.',"error");
    }
  };

  function getAvailableDatesForNextTwoMonths() {
    const today = new Date();
    const year = today.getFullYear();
    const currentMonth = today.getMonth();
    const nextMonth = (currentMonth + 1) % 12;
    const months = [currentMonth, nextMonth];
    const availableDates = [];

    const getDaysInMonth = (year, month) => {
      const today = new Date();
      const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const date = new Date(year, month, 1);
      const daysInMonth = [];
    
      while (date.getMonth() === month) {
        if (date >= currentDate) { // Check if the date is greater than or equal to today
          daysInMonth.push(new Date(date.getTime()));
        }
        date.setDate(date.getDate() + 1);
      }    
      return daysInMonth;
    };
    

    months.forEach(month => {
      const daysInMonth = getDaysInMonth(year, month);
      daysInMonth.forEach(date => {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        if (event?.doctor_id?.schedule?.some(schedule => schedule?.day === dayName)) {
          availableDates.push(date);
        }
      });
    });

    return availableDates;
  }

  const availableDates = getAvailableDatesForNextTwoMonths();

  

  const generateTimeSlots = (start, end) => {
    const slots = [];
    let current = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);

    while (current < endTime) {
      const next = new Date(current.getTime() + 15 * 60000);
      slots.push(`${formatTime(current)}`);
      current = next;
    }

    return slots;
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${strMinutes} ${ampm}`;
  };

  const getAvailableTimeSlots = (selectedDate) => {
    const dayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    const daySchedule = event.doctor_id?.schedule.find(schedule => schedule?.day === dayName);

    if (daySchedule) {
      return daySchedule.slots.flatMap(slot => generateTimeSlots(slot.start, slot.end));
    }

    return [];
  };

  const isSelected = (time) => {
    return selectedDates.some(selected => {
      const selectedDateObj = new Date(selected.date_time);
      const selectedDateString = selectedDateObj.toDateString();
      const selectedTimeString = formatTime(selectedDateObj);
      return selectedDateString === selectedDate && selectedTimeString === time;
    });
  };

  return (
    <div>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none"
            onClick={closeModal}
            id="modal-backdrop-2"
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

                <div className="relative px-10 pb-10 flex-auto w-full bg-white rounded-xl">
                  <div className="flex flex-col gap-8">
                    <div className="flex justify-center gap-10">
                      <div className="">
                        <div className="capitalize my-3 bg-slate-200 px-7 rounded-md text-xl py-1">
                          <p className="my-2">Doctor: {event?.doctor_id?.name}</p>
                          <label className="my-2">
                            Date:
                            <select
                              name="day"
                              id=""
                              onChange={(e) => setSelectedDate(e.target.value)}
                            >
                              <option value="">Select a date</option>
                              {availableDates.map((date, index) => (
                                <option value={date.toDateString()} key={index}>
                                  {date.toDateString()}
                                </option>
                              ))}
                            </select>
                          </label>
                          <br />
                          <label className="my-2">
                            Time:
                            <select
                              name="time"
                              id=""
                              onChange={(e) => setSelectedTime(e.target.value)}
                              disabled={!selectedDate}
                            >
                              <option value="">Select a time</option>
                              {getAvailableTimeSlots(selectedDate).map((slot, index) => (
                                <option
                                  key={index}
                                  value={slot}
                                  style={{
                                    backgroundColor: isSelected(slot) ? 'yellow' : 'white'
                                  }}
                                >
                                  {slot}
                                </option>
                              ))}
                            </select>
                          </label>
                          <p className="my-2">Procedure: {event?.procedure_id?.procedure}</p>
                          <p className="my-2">Notes: {event?.note}</p>
                        </div>
                        <div className="flex justify-end">
                          <button
                            className="border px-3 text-2xl bg-green-400 rounded-md py-2"
                            onClick={handleSave}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
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

export default RescheduleModal;
