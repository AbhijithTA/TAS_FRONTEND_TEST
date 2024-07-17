import { useEffect, useState } from "react";
import Axios from "../../../Config/axios";
import Add_DOC_Form from "../../../components/Common/Doctor/add_Doc";

const AddDoc = () => {
  const [formData, setFormData] = useState({fields: [
    { name: "BranchID", label: "Branch", type: "dropdown", options: [],required:true },
    { name: "name", label: "Doctor Name", type: "text" ,required:true },
    { name: "age", label: "Age", type: "number" ,required:true },
    { name: "Gender", label: "Gender",required:true, type: "dropdown", options: [{option:"Male", id:"Male"}, {option:"Female",id:"Female"}], },
    { name: "specialization", label: "Specialization",required:true, type: "text" },
    { name: "email", label: "email", type: "text" },
    { name: "address", label: "Address", type: "text",required:true },
    { name: "DepartmentID", label: "Department", type: "dropdown", options: [],required:true, },
    { name: "phone", label: "Contact Number", type: "text",required:true }, 
    { name: "ProcedureIds", label: "Procedure", type: "MultiCheckBox", options: [], required:true, },
  ]})

  useEffect(() => {
    Axios.get('/admin/add-doctor').then((resp) => { 
      // Assuming resp.data.Branches and resp.data.Departments are arrays
      const branchOptions = resp?.data?.Branches?.map(branch => ({ option: branch?.branchName, id: branch?._id }));
      const departmentData = resp?.data?.Departments?.map(dept => ({ option: dept?.Name, id: dept?._id, BranchID: dept?.BranchID?._id ,subOption:dept?.BranchID?.branchName}));
      const procedureData = resp?.data?.Procedures?.map((proc)=>({id:proc?._id,option:proc?.procedure,BranchID:proc?.BranchID?._id,subOption:proc?.BranchID?.branchName}))
       

      setFormData(prevFormData => ({
        ...prevFormData,
        fields: prevFormData.fields.map(field => {
          if (field.name === "BranchID") {
            return { ...field, options: branchOptions };
          } else if (field.name === "DepartmentID") {
            return { ...field, options: departmentData };
          }else if (field.name === "ProcedureIds") {
            return { ...field, options: procedureData };
          } else {
            return field;
          }
        }),
      }));

     
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  

  return (
    <Add_DOC_Form formData={formData} setFormData={setFormData} />
  );
};

export default AddDoc;