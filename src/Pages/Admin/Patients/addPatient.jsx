import { useState } from "react";
import PatientList from "../../../components/Admin/Patients/PatientList";
import AddPatient from "../../../components/Admin/Patients/addPatient";
import Select_Branch_ID from "../../../components/Utils/BranchIDSelection";
const ADDPatient = () => {
  const [refresh, setRefresh] = useState(false);
  const [branch, setBranch] = useState([]);
  return (
    <div className="m-auto">
      <div className="topbar bg-white flex flex-wrap justify-center items-center overflow-x-scroll py-10">
        <div className="flex flex-col justify-center items-center w-full ">
          <h2 className="text-xl font-Inter font-bold uppercase tracking-normal mb-5 text-center">
            Patient Form - {branch?.type}
          </h2>
          <div className="w-full flex justify-end px-20">
            <div className="w-[20rem]">
              <Select_Branch_ID value={branch} onChange={setBranch} />
            </div>
          </div>
        </div>

        <AddPatient setRefresh={setRefresh} branch={branch} />
      </div>

      <PatientList refresh={refresh} setRefresh={setRefresh} branch={branch} />
    </div>
  );
};

export default ADDPatient;
