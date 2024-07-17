import { useState } from "react";
import { Link } from "react-router-dom";
import Patient_Model from "../../Utils/PatientPreviewModal";
import ProgressBar from "../../Utils/ProgressBar/ProgressBar";

/* eslint-disable react/prop-types */
const PatientList = ({ data, fetchData, loader }) => {
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const branch = localStorage.getItem("branch");
  const BranchID = branch?.split(",")[1];
  const [dropdownVisible, setDropdownVisible] = useState({});

  // const handleRowClick = (patient) => {
  //   setRowData(patient);
  //   setShowModal(true)};

  const toggleDropdown = (patientId) => { 
    setDropdownVisible( {       
      [patientId]: !dropdownVisible[patientId]
    })
  };

  const handleEditClick = (patient, e) => {
    e.stopPropagation();
    setRowData(patient);
    setShowModal(true);
    setDropdownVisible({});
  };

  return (
    <div className="overflow-x-auto mt-6 ">
      <table className="min-w-full table-auto border-8">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Age</th>
            <th className="py-3 px-6 text-center">Gender</th>
            <th className="py-3 px-6 text-center">Phone</th>
            <th className="py-3 px-6 text-center">City</th>
            <th className="py-3 px-6 text-center">Date</th>
            <th className="py-3 px-6 text-center">Invoice</th>
            <th className="py-3 px-6 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-600 text-sm font-light">
          {loader ? (
            <tr>
              <td
                colSpan="9"
                className="text-center font-bold text-red-600 py-4"
              >
                <ProgressBar />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan="9"
                className="text-center font-bold text-red-600 py-4"
              >
                No data available
              </td>
            </tr>
          ) : (
            data?.map((patient, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 even:bg-slate-100 odd:bg-white"
                // onClick={() => {
                //   handleRowClick(patient);
                // }}
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {patient?.PatientID}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {patient?.Name}
                </td>
                <td className="py-3 px-6 text-left">{patient?.age}</td>
                <td className="py-3 px-6 text-center">{patient?.Gender}</td>
                <td className="py-3 px-6 text-center">{patient?.phone}</td>
                <td className="py-3 px-6 text-center">{patient?.address?.city}</td>
                <td className="py-3 px-6 text-center">
                  {patient?.createdAtIST}
                </td>
                <td className="py-3 px-6 flex justify-center items-center">
                  <Link
                    to={`/patient-invoice/?BranchID=${BranchID}&PatientID=${patient?._id}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="25"
                      height="25"
                      fill="#FFFFFF"
                      className="bg-[#387ADF] hover:bg-[#387ADF] rounded-full  shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6H5v-2h6V5h2v6h6v2h-6v6z" />
                    </svg>
                  </Link>
                </td>
                <td className="relative text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(patient?._id);
                    }}
                    className="focus:outline-none "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="40"
                      height="30"
                      fill="#000000"
                      
                    >
                      <g fill="#000000">
                        <circle cx="6" cy="12" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="18" cy="12" r="2" />
                      </g>
                    </svg>
                  </button>
                  {dropdownVisible[patient?._id] && (
                    <div className="absolute top-[20%] right-[8%] z-50  mt-2 bg-white rounded-md shadow-lg border border-gray-300">
                      <Link
                        to={`/Patient-Profile/${patient?._id}`}
                        className="block px-4 py-2 text-sm text-gray-600 font-semibold hover:bg-gray-300"
                      >
                        View
                      </Link>
                      <button
                        onClick={(e) => handleEditClick(patient, e)}
                        className="block px-4 py-2 text-sm text-gray-600  font-semibold hover:bg-gray-300 w-full text-left"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Patient_Model
        showModal={showModal}
        data={rowData}
        setShowModal={setShowModal}
        fetchData={fetchData}
      />
    </div>
  );
};

export default PatientList;
