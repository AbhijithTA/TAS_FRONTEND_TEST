/* eslint-disable react/prop-types */
import { stringToColor } from "../../../Utils/StringToColor";

const DoctorsList = ({ doctors, events, setFilteredEvents }) => {
  const findCount = (id) => {
    return events.reduce((count, event) => (event.doctor_id === id ? count + 1 : count), 0);
  };

  const doctorEventCounts = doctors.map((doctor) => ({
    ...doctor,
    eventCount: findCount(doctor._id),
  }));

  const sortedDoctors = doctorEventCounts.sort((a, b) => b.eventCount - a.eventCount);

  const handleDoctorSelection = async (id) => {
    if (!id) return setFilteredEvents(events);
    const filtered = await events.filter((event) => event.doctor_id === id);
    setFilteredEvents(filtered);
  };

  return (
    <div className="pl-5">
      <h1
        className="text-center uppercase text-3xl font-extrabold text-blue-700 hover:cursor-pointer mb-6 transition-transform transform hover:scale-105"
        onClick={() => handleDoctorSelection()}
      >
        All Doctors
      </h1>
      <div>
        {sortedDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className="flex items-center gap-6 justify-between bg-white border border-gray-200 p-4 mb-3 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => handleDoctorSelection(doctor._id)}
          >
            <div className="flex items-center space-x-5">
              <div
                className="w-3 h-12 rounded-full"
                style={{ backgroundColor: stringToColor(doctor._id) }}
              ></div>
              <h1 className="text-lg font-semibold text-gray-800 uppercase">{doctor.name}</h1>
            </div>
            <p className="text-lg text-gray-600 font-medium">({doctor.eventCount})</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
