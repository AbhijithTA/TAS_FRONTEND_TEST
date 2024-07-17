/* eslint-disable react-hooks/exhaustive-deps */ 

/* eslint-disable react/prop-types */
const Recent_Appointments = ({ recent }) => {


  return (
    <div className="max-w-full mx-auto my-8 p-6 border rounded-md shadow-lg h-full">
      <h2 className="text-lg font-semibold mb-4 uppercase">Recent Patients</h2>
      <div className="max-h-[450px] overflow-y-auto">
        <table className="text-sm text-left text-gray-500 w-full border font-bold capitalize">
          <thead className="text-xs text-gray-700 uppercase border-green-800 text-left border bg-slate-100">
            <tr >
              <th scope="col" className="px-6 py-3  ">
                Name & Place
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th> 
            </tr>
          </thead>
          <tbody>
            {recent?.map((data) => (
              <tr key={data._id}  className=" text-left border hover:cursor-pointer hover:bg-slate-300">
                <td className="px-6 py-4 border-l-8 border-green-800 flex flex-col gap-1"><span className="text-blue-500">{data.patient.name}</span> <span >{data.patient.place}</span> </td>
                <td className="px-6 py-4 "><span className="flex flex-col capitalize">
                    {data?.visit_type}  {data?.procedure_id && <span className="text-red-700">{`${data?.procedure_id?.procedure} `}</span>}                   
                  </span></td> 
              </tr>
            ))}
          </tbody>
        </table>
        {recent?.length === 0 && (
          <p className="text-center text-gray-500">No Patients found</p>
        )}
      </div>
    </div>
  );
};

export default Recent_Appointments;
