/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
const TopProcedures = (props) => {
  const branch = localStorage.getItem("branch");
  const Branch = branch?.split(",")[0];
  const [procedures, setProcedures] = useState([]);

  useEffect(() => {
    if (props.report && props.report.procedures) {
const updatedProcedures = props.report.procedures.filter((obj)=>(obj.branch === Branch))  
      setProcedures(updatedProcedures);
    }
  }, [props.report.procedures]);

  return (
    <div className="max-w-full h-[550px] mx-auto p-6 border border-blue-500 rounded-md">
      <h2 className="text-lg font-semibold mb-4 uppercase">Top Procedures</h2>
      <div className="max-h-[450px] overflow-y-auto">
        <table className="text-sm text-left text-gray-500 w-full">
          <thead className="text-xs text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Procedure
              </th>
              <th scope="col" className="px-6 py-3">
                Count
              </th>
            </tr>
          </thead>
          <tbody>
            {procedures?.map((data) => (
              <tr key={data._id} className="odd:bg-white even:bg-gray-200">
                <td className="px-6 py-4 flex flex-col">
                  {data.procedure}
                  <span className="uppercase text-xs text-[#387ADF]">
                    {data.department}
                  </span>
                </td>
                <td className="px-6 py-4">{data?.branch}</td>
                <td className="px-6 py-4">{data?.totalCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {procedures.length === 0 && (
          <p className="text-center text-gray-500">No procedures found</p>
        )}
      </div>
    </div>
  );
};

export default TopProcedures;
