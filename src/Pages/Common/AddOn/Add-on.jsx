import { useCallback, useEffect, useState } from "react";
import Addon from "../../../components/Common/AddOn/AddOptions"
import Axios from "../../../Config/axios"
const InitialLIst = [
  {
    name: "Employee",
    apiEndPoint:'/admin/employee-register',
    fields: [
      { name: "firstName", label: "First Name", type: "text" },
      { name: "lastName", label: "Last Name", type: "text" },
      { name: "age", label: "Age", type: "number" ,required:true },
      { name: "Gender", label: "Gender",required:true, type: "dropdown", options: [{option:"Male", id:"Male"}, {option:"Female",id:"Female"}], }, 
      { name: "address", label: "Address", type: "text",required:true },
      { name: "email", label: "email", type: "text" },
      { name: "phone", label: "phone", type: "text" },
      { name: "designation", label: "Designation", type: "text" },  
      { name:"role",label:"Role",type:"dropdown",options:[]},
      { name: "loginId", label: "Login ID", type: "text" },
      { name: "password", label: "Password", type: "text" },  
  ],
  },
  {
    name: "Branch",
    apiEndPoint:'/admin/branch-register',
    fields: [
      { name: "branchName", label: "Branch Name", type: "text" },
      { name: "address", label: "Address", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "state", label: "State", type: "text" },
      { name: "country", label: "Country", type: "text" },
      { name: "pincode", label: "Pincode", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "loginId", label: "Login ID", type: "text" },
      { name: "password", label: "Password", type: "text" },  
  ],
  },
  {
    name: "Main Department",    
    apiEndPoint:'/admin/MainDepartment',
    fields: [
      { name: "Name", label: "Department Name", type: "text" },
      { name: "BranchID", label: "Branch", type: "dropdown", options: [],},
      // { name: "DepartmentID", label: "Sub Departments", type: "MultiCheckBox", options: [] },      
    ],
  },
  {
    name: "Department",
    apiEndPoint:'/admin/add-Department',
    fields: [
      { name: "Name", label: "Department Name", type: "text" },
      {
        name: "BranchID",
        label: "Branch",
        type: "dropdown",
        options: [],
      },
      {
        name: "MainDepartmentID",
        label: "Main Department ",
        type: "dropdown",
        options: [],
      },
    ],
  },
  {
    name: "Procedure",
    apiEndPoint:'/admin/add-procedure',
    fields: [
      {
        name: "BranchID",
        label: "Branch",
        type: "dropdown",
        options: [],
      },
      {
        name: "DepartmentID",
        label: "Department",
        type: "dropdown",
        options: [],
      },
      { name: "procedure", label: "Procedure", type: "text" },
      { name: "description", label: "Description", type: "text" }, 
      { name: "gstOption", label: "GST Option",required:true, type: "dropdown", options: [{option:"Exception", id:"exception"}, {option:"Non-exception",id:"non-exception"}], }, 
      { name: "HSNCode", label: "HSN Code", type: "text" }, 
      { name: "GST", label: "GST", type: "number" }, 
    ],
  },
  {
    name: "Patient Type",
    apiEndPoint:'/admin/add-patientType',
    fields: [
      { name: "type", label: "Patient Type", type: "text" },
      { name: "description", label: "Description", type: "text" },
    ],
  },
  {
    name: "Visitor Type",
    apiEndPoint:'/admin/add-visitorType',
    fields: [
      { name: "type", label: "Patient Type", type: "text" },
      { name: "description", label: "Description", type: "text" },
    ],
  },
  {
    name: "Payment Method",    
    apiEndPoint:'/admin/add-paymentMethod',
    fields: [
      { name: "Method", label: "Payment Method", type: "text" },
    ],
  },
  {
    name: "Alert",
    apiEndPoint:'/admin/set-alert',
    fields: [
      { name: "msg", label: "Message", type: "text" },
      { name: "type", label: "Alert Type", type: "dropdown", 
      options: [{option:"Success",id:"Success"},{option:"Info", id:"Info"}, {option:"Warning",id:"Warning"},{option:"Error",id:"Error"} ],  },
      { name: "startDate", label: "Start Date", type: "date"  },
      { name: "endDate", label: "End Date", type: "date"  }, 
      { name: "BranchID", label: "Branch", type: "dropdown", options: [],},
      
    ],
  },
  

];
const AddOn = () => {   
  const [buttonlist,setButtonList] = useState(InitialLIst)
  const jobRole = localStorage.getItem("jobRole");
 

  const fetchData = useCallback(()=>{
    Axios.get('/admin/get-addOns').then((resp) => { 
      const branchOptions = resp?.data?.Branches?.map(branch => ({ option: branch?.branchName, id: branch?._id }));
      const departmentOptions = resp?.data?.Departments?.map(dept => ({ option: dept?.Name, id: dept?._id ,subOption:dept?.BranchID?.branchName , BranchID:dept?.BranchID?._id }));
      const roleOptions = resp?.data?.roleType?.map(role=>({option: role?.name, id: role?._id,subOption:role?.roleType }))
      const Main_Departments = resp?.data?.MainDepartments?.map(Main=>({option: Main?.Name, id: Main?._id,subOption:Main?.BranchID?.branchName,BranchID:Main?.BranchID?._id }))
    
      // Update the buttonlist with new options
      const updatedButtonList = buttonlist.map((item) => {
        if (item.name === 'Department') {
          return {
            ...item,
            fields: item?.fields?.map((field) => {
              if (field.name === 'BranchID') {
                return { ...field, options: branchOptions };
              }
              if (field.name === 'MainDepartmentID') {
                return { ...field, options: Main_Departments };
              }
              return field;
            }),
          };
        } else if (item.name === 'Procedure') {
          return {
            ...item,
            fields: item.fields.map((field) => {
              if (field.name === 'BranchID') {
                return { ...field, options: branchOptions };
              }
              if (field.name === 'DepartmentID') {
                return { ...field, options: departmentOptions };
              }
              return field;
            }),

          };
        }else if (item.name === 'Main Department') {
          return {
            ...item,
            fields: item.fields.map((field) => {
              if (field.name === 'BranchID') {
                return { ...field, options: branchOptions };
              }
              // if (field.name === 'DepartmentID') {
              //   return { ...field, options: departmentOptions };
              // }
              return field;
            }),

          };
        } else if (item.name === 'Employee') {
          return {
            ...item,
            fields: item.fields.map((field) => {
              if (field.name === 'role') {
                return { ...field, options: roleOptions };
              }
              return field;
            }),
          };
        }else if (item.name === 'Alert') {
          return {
            ...item,
            fields: item.fields.map((field) => {
              if (field.name === 'BranchID') {
                return { ...field, options: branchOptions };
              }
              return field;
            }),
          };
        }
        return item;
      });

      setButtonList(updatedButtonList); 

    }).catch((err) => {
      console.log(err);
    }) 
  },[])

  useEffect(() => {
    fetchData()
  }, [fetchData]);

  const filteredButtonList = buttonlist?.filter(item => {
    if (jobRole === 'admin') {
      return true; 
    } else if(jobRole === 'user') {
      return [ "Payment Method","Procedure"].includes(item.name);
    }
  });

  return (
    <>
      <Addon buttonlist={filteredButtonList} fetchData={fetchData}/>
    </>
  )
}

export default AddOn
