import { useState } from "react"
import PatientList from "../../../components/Reception/Patients/PatientList"
import AddPatient from "../../../components/Reception/Patients/addPatient"
const ADDPatient = () => {
  const [refresh,setRefresh] = useState(false)
    return (
      <div className="m-auto   ">
        <div className="topbar py-10 px-5 bg-white  flex  flex-wrap justify-center">
          <h2 className="text-xl mb-5 font-Inter font-bold uppercase tracking-normal">Patient Info </h2>
          <AddPatient  setRefresh={setRefresh} />
        </div>
       <PatientList refresh={refresh} setRefresh={setRefresh}/>
      </div>
    )
  }
  
  export default ADDPatient
  