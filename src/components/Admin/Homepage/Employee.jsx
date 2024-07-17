/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
const Employee = (props) => {
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    if (props.report && props.report.employee) {
      setEmployee(props.report.employee);
    }
  }, [props.report.employee]);

  return (
    <div className="max-w-full mx-auto my-8 p-6 border rounded-md shadow-lg">
      <h2 className="text-lg font-semibold mb-4 uppercase">Employee List</h2>
      <div className="max-h-[450px] overflow-y-auto">
        <table className="text-sm text-left text-gray-500 w-full">
          <thead className="text-xs text-gray-700 uppercase ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Date of Join
              </th>
              <th scope="col" className="px-6 py-3">
                Place
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Designation
              </th>
            </tr>
          </thead>
          <tbody className="">
            {employee.map((emp) => (
              <tr key={emp.id} className="odd:bg-white even:bg-gray-200">
                <td className="px-6 py-4 flex flex-col">{emp.firstName}</td>
                <td className="px-6 py-4">{emp.createdAtIST}</td>
                <td className="px-6 py-4">{emp.address}</td>
                <td className="px-6 py-4">{emp.phone}</td>
                <td className="px-6 py-4">{emp.email}</td>
                <td className="px-6 py-4">{emp.designation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {employee.length === 0 && (
        <p className="text-center text-gray-500">No doctors found</p>
      )}
    </div>
  );
};

export default Employee;