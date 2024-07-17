// import HoroImg from "../../assets/DashBoard/DashBordHeroSectionIMG.png";
import CompanyInfo from "../../../components/Reception/Homepage/companyInfo.jsx";
import ChartSesion from "../../../components/Reception/Homepage/ChartSesion.jsx";
import Cards from "../../../components/Reception/Homepage/Analyticalcards.jsx";
import Collection from "../../../components/Reception/Homepage/DoctorCollection.jsx";
import TopProcedures from "../../../components/Reception/Homepage/TopProceduresList.jsx";
import TodoList from "../../../components/Reception/Homepage/Todo.jsx";
import AlertComponent from "../../../components/Reception/Homepage/AlertComponent.jsx";
import { useEffect, useState } from "react";
import Axios from "../../../Config/axios.js";
// import PatientReminder from "../../components/ReceptionPanel/Homepage/PatientReminder.jsx";

const initialcompanyinfo = {
  companyName: "Topmost Group",
  Branch: "",
};

const Dashboard = () => {
  const [report, setReport] = useState([]);
  const [companyInfo, setCopmayInfo] = useState(initialcompanyinfo);
  const branch = localStorage.getItem("branch");
  const BranchName = branch?.split(",")[0];
  const BranchID =branch?.split(",")[1];
    
  useEffect(() => {
    Axios.get(`/admin/adminhome-reports?BranchID=${BranchID}`)
      .then((resp) => {
        setReport(resp?.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [BranchID]);

  useEffect(() => {
    setCopmayInfo((prev) => ({ ...prev, Branch: BranchName }));
  }, [BranchName]);

  return (
    <div className="p-4 lg:p-8 bg-Receptionbackground  ">
      <CompanyInfo companyInfo={companyInfo} type={" Reception panel"} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2  ">
        <div className="col-span-full md:col-span-2 xl:col-span-1  overflow-hidden">
          <AlertComponent />
        </div>
        <div className="col-span-full md:col-span-2 xl:col-span-1 ">
          <TodoList />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 py-10">
        <Cards report={report} />
      </div>
      <div className="flex gap-10">
        <div className="w-[48%]">
          <Collection report={report} />
        </div>
        <div className="w-[48%]">
          <TopProcedures report={report} />
        </div>
      </div>
      <div className="mt-10">
        <h1 className="uppercase text-2xl font-semibold">
          Analytical Represenatation
        </h1>
        <ChartSesion />
      </div>

      {/* upcomming patients */}
      {/* <PatientReminder /> */}
    </div>
  );
};

export default Dashboard;
