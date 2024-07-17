import { useState } from 'react';
import { format } from 'date-fns';

const PatientAppointmentList = () => {
  // Dummy data simulating fetched data from backend
  const initialAppointments = [
    { id: 1, patientName: 'John Doe', date: '2023-12-30', confirmed: false, rescheduling: false },
    { id: 2, patientName: 'Jane Smith', date: '2023-12-31', confirmed: false, rescheduling: false },
    { id: 3, patientName: 'Emily Johnson', date: '2023-01-02', confirmed: false, rescheduling: false },
    { id: 4, patientName: 'Michael Brown', date: '2023-01-03', confirmed: false, rescheduling: false },
    { id: 5, patientName: 'Jessica Davis', date: '2023-01-04', confirmed: false, rescheduling: false },
    { id: 6, patientName: 'Daniel Miller', date: '2023-01-05', confirmed: false, rescheduling: false },
    { id: 7, patientName: 'Sarah Wilson', date: '2023-01-06', confirmed: false, rescheduling: false },
    { id: 8, patientName: 'Christopher Moore', date: '2023-01-07', confirmed: false, rescheduling: false },
    { id: 9, patientName: 'Amanda Taylor', date: '2023-01-08', confirmed: false, rescheduling: false },
    { id: 10, patientName: 'James Anderson', date: '2023-01-09', confirmed: false, rescheduling: false }
  ];
  

  const [appointments, setAppointments] = useState(initialAppointments);

  const handleConfirmAppointment = (id) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, confirmed: true } : appointment
    ).sort((a, b) => a.confirmed === b.confirmed ? 0 : a.confirmed ? 1 : -1);
    setAppointments(updatedAppointments);
  };

  const startReschedule = (id) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, rescheduling: true } : appointment
    );
    setAppointments(updatedAppointments);
  };

  const handleRescheduleAppointment = (id, newDate) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, date: newDate, rescheduling: false } : appointment
    );
    setAppointments(updatedAppointments);
  };

  return (
    <div className="p-2 rounded-xl bg-blue-400  shadow-xl border">
      <h2 className="text-base pl-4 font-bold mb-2">Upcoming Appointments</h2>
      <div className="overflow-auto h-96  scrollingNewstyle rounded-b-lg ">
        <ul className="space-y-2 flex flex-col flex-nowrap">
          {appointments.map((appointment,i) => (
            <li key={appointment.id+i} className={`flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-2 rounded ${appointment.confirmed ? 'bg-green-200' : 'bg-gray-100'} `}>
              <div className="flex-1 text-sm md:text-base mb-2 md:mb-0">
                {appointment.patientName} - 
                {appointment.rescheduling ? 
                  <input type="date" defaultValue={appointment.date} onBlur={(e) => handleRescheduleAppointment(appointment.id, e.target.value)} />
                  : ` ${format(new Date(appointment.date), 'PP')}`
                }
              </div>
              <div className="flex">
                {!appointment.confirmed && (
                  <>
                    <button className="mx-1 px-2 py-1 bg-green-500 text-white rounded" onClick={() => handleConfirmAppointment(appointment.id)}>
                      Confirm
                    </button>
                    {!appointment.rescheduling && (
                      <button className="mx-1 px-2 py-1 bg-yellow-500 text-white rounded" onClick={() => startReschedule(appointment.id)}>
                        Reschedule
                      </button>
                    )}
                  </>
                )}
                {appointment.confirmed && <span className="text-green-600">Confirmed</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PatientAppointmentList;