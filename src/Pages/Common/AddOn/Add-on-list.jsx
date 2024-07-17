import { useEffect, useState } from "react";
import ListOptions from "../../../components/Common/AddOn/ListofOptions";
import Axios from "../../../Config/axios";
import ProgressBar from "../../../components/Utils/ProgressBar/ProgressBar";
const initialData = [
  {
    name: "Branches",
    endpoints: {
      update: "/admin/Branch/updateStatus",
      approve:"/admin/Branch/approve",
    },
    columns: [
      "branchName",
      "address",
      "city",
      "phone",
      "email",
      "createdBy",
      "createdAtIST",
      "isApproved",
    ],
    
    Head: [
      "Branch Name",
      "Address",
      "City",
      "Phone",
      "email",
      "CreatedBy",
      "createdAtIST",
      "status",
    ],
    data: [],
  },
  {
    name: "Employees",
    endpoints: {
      update: "/admin/Employee/updateStatus",
      approve:"/admin/Employee/approve",
    },
    columns: [
      "firstName",
      "Gender",
      "age",
      "designation", 
      "address",
      "email", 
      "createdAtIST",
      "isApproved",
    ],
    
    Head: [
      "Name",
      "Gender",
      "Age",
      "Designation",
      "address",
      "email", 
      "createdAtIST",
      "status",
    ],
    data: [],
  },

  {
    name: "Patient Types",
    endpoints: {
      update: "/admin/PatientType/updateStatus", 
      approve:"/admin/PatientType/approve", 
    },
    columns: ["type", "description", "createdBy", "createdAtIST", "isApproved"],
    Head: ["Patient Type", "Description", "CreatedBy", "Date", "Status"],
    data: [],
  },
  {
    name: "Payment Methods",
    endpoints: {
      update: "/admin/PaymentMethod/updateStatus", 
      approve:"/admin/PaymentMethod/approve",
    },
    columns: ["Method", "createdBy", "createdAtIST", "isApproved"],
    Head: ["Payment Method", "CreatedBy", "Date", "Status"],
    data: [],
  },
  {
    name: "Procedures",
    endpoints: {
      update: "/admin/Procedure/updateStatus", 
      approve:"/admin/Procedure/approve",
    },
    columns: [
      "procedure",
      "description",
      "DepartmentName",
      "BranchName",
      "GST",
      "HSNCode",
      "createdBy",
      "createdAtIST",
      "isApproved",
    ],
    Head: [
      "Procedure",
      "Description", 
      "Department",
      "Branch",
      "GST",
      "HSNCode",
      "CreatedBy",
      "Date",
      "Status",
    ],
    data: [],
  },
  {
    name: "Main Department",
    endpoints: {
      update: "/admin/MainDepartment/updateStatus", 
      approve:"/admin/MainDepartment/approve",
    },
    columns: ["Name", "BranchName", "createdBy", "createdAtIST",],
    Head: ["Name","Branch", "CreatedBy", "Created Date"],
    data: [],
  },
  {
    name: "Departments",
    endpoints: {
      update: "/admin/Department/updateStatus", 
      approve:"/admin/Department/approve",
    },
    columns: ["Name", "BranchName", "createdBy", "createdAtIST", "isApproved"],
    Head: ["Department", "Branch", "createdBy", "Date", "status"],
    data: [],
  },
  {
    name: "Visitor Types",
    endpoints: {
      update: "/admin/VisitorType/updateStatus", 
      approve:"/admin/VisitorType/approve",
    },
    columns: ["type", "description", "createdBy", "createdAtIST", "isApproved"],
    Head: ["Visitor Type", "Description", "CreatedBy", "Date", "Status"],
    data: [],
  },
  {
    name: "Alerts",
    endpoints: {
      update: "/admin/Alert/updateStatus", 
      approve:"/admin/Alert/approve",
    },
    columns: ["msg", "type","BranchName", "createdBy", "createdAtIST", "startDate","endDate"],
    Head: ["Message", "Type","Branch", "CreatedBy", "Created Date", "Valid From","Valid UpTo"],
    data: [],
  },
  
];

const AddOnList = () => {
  const [loader,setloader]=useState(true)
  const [refresh,setRefresh]=useState(false)
  const jobRole = localStorage.getItem("jobRole"); 
  const [tableData, setTableData] = useState(initialData);
  
  useEffect(() => { 
    const branch = localStorage.getItem("branch");
    const BranchID = branch?.split(",")[1];
    Axios.get(`admin/list-addOns/?BranchID=${BranchID}`).then((resp) => {
      setloader(false)
      const data = resp?.data;
      const updatedData = initialData.map((table) => ({
        ...table,
        data: data[table.name] || [],  
      }));  
      setTableData(updatedData); 
    });
  }, [refresh]);

  const filteredButtonList = tableData?.filter(item => {
    if (jobRole === 'admin') {
      return true; 
    } else if(jobRole === 'user') {
      return ["Patient Types","Payment Methods","Procedures","Departments","Visitor Types" ].includes(item.name);
    }
  });
 
  return (
    <>
  
  {loader ? ( <div className="mt-28"><ProgressBar/> </div>  ): ( <ListOptions className={"pb-10"} refresh={refresh } setRefresh={setRefresh}    tableData={filteredButtonList} /> )}
      
    </>
  );
};

export default AddOnList;
