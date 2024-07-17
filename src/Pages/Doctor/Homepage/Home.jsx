import TitleInfo from "../../../components/Doctor/Homepage/TitleInfo";
import Appointments_List from "../../../components/Doctor/Homepage/Appointments";
import Recent_Appointments from "../../../components/Doctor/Homepage/Recent_Appointments";
import EmployeeList from "../../../components/Doctor/Homepage/Employee"; 
import Axios from "../../../Config/axios";
import { useEffect, useState } from "react";

const Dashboard = () => { 
  const [appointmentList,setAppointmentList] = useState([])
  const [completed,setCompleted]=useState([])
  const [canceled,setCanceled]=useState([])
  const [scheduled,setScheduled]=useState([])
  
const filter_appointments = (datas,string)=>{
 return datas.filter((data)=>(data.status===string))
}
  useEffect(()=>{
Axios.get('doctor/get-appointments').then(async (res)=>{
  setAppointmentList(res?.data?.appointments)
  const scheduled_appointments = await filter_appointments(res?.data?.appointments,'scheduled')
  const completed_appointments = await filter_appointments(res?.data?.appointments,'completed')
  const canceled_appointments = await filter_appointments(res?.data?.appointments,'canceled')
  setCompleted(completed_appointments)
  setCanceled(filter_appointments(res?.data?.appointments,'canceled'))
  setScheduled(scheduled_appointments)
})
  },[])
 
  return (
    <div className="p-4 lg:p-8">
      <TitleInfo count={scheduled?.length} /> 
      <div className="flex gap-10  ">
        <div className="w-[70%]  min-h-96">
          <Appointments_List appointmentList={scheduled}  />
        </div>
        <div className="w-[27%] min-h-96">
          <Recent_Appointments recent={completed}  />
        </div>
      </div>
      <div className="mt-20">
      <EmployeeList   />       
      </div>
    </div>
  );
};

export default Dashboard;
