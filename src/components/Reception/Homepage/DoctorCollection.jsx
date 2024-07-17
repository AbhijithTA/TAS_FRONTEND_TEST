/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const DoctorsList = (props) => {
  const branch = localStorage.getItem("branch");
  const Branch = branch?.split(",")[0];
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (props.report && props.report.doctors) {
      const updatedDoctors = props.report.doctors.filter((obj)=>(obj.branch === Branch )) 
      setDoctors(updatedDoctors);
    }
  }, [props.report.doctors]);
   
  return (
    <div className="max-w-full  h-[550px] mx-auto p-6 border border-blue-500 rounded-md ">
      <h2 className="text-lg font-semibold mb-4 uppercase">
        Doctors Collection
      </h2>
      <div className="max-h-[450px] overflow-y-auto">
        <table className="text-sm text-left text-gray-500 w-full">
          <thead className="text-xs text-gray-700 uppercase ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Branch
              </th>
              <th scope="col" className="px-6 py-3">
                Collection
              </th>
            </tr>
          </thead>
          <tbody className="">
            {doctors?.map((doctor, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-200">
                <td className="px-6 py-4">
                  <span className="flex flex-col">
                    {doctor.name}{" "}
                    <span className="text-[#387ADF] text-xs">
                      {doctor?.firstInvoiceCreatedAt
                        ? `${doctor?.firstInvoiceCreatedAt} to ${doctor?.lastInvoiceCreatedAt}`
                        : "No invoice"}
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex flex-col">
                    {doctor?.branch}{" "}
                    <span className="uppercase text-xs text-[#387ADF]">
                      {doctor?.department}
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  {`Rs ${doctor?.totalCollection}/-`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {doctors?.length === 0 && (
        <p className="text-center text-gray-500">No doctors found</p>
      )}
    </div>
  );
};

export default DoctorsList;
