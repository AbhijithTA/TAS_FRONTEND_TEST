import { useCallback, useEffect, useState } from "react";
import InvoiceTable from "../../../components/Common/Report/InvoceTable";
import FilterComponent from "../../../components/Common/Report/filter";
import Axios from "../../../Config/axios";
import { Pagination } from "@mui/material";
import ProgressBar from "../../../components/Utils/ProgressBar/ProgressBar";
const initialValues = [
  {
    label: "Branch",
    name: "BranchID",
    type: "dropdown",
    options: [],
  },
  {
    label: "Department",
    name: "DepartmentID",
    type: "dropdown",
    options: [],
  },
  {
    label: "Procedure",
    name: "ProcedureID",
    type: "MultiCheckBox",
    options: [],
  },
  {
    label: "Doctor",
    name: "doctorID",
    type: "dropdown",
    options: [],
  },
  {
    label: "Payment Methods",
    name: "paymentMethod",
    type: "dropdown",
    options: [],
  },
  {
    label: "GST",
    name: "GST",
    type: "dropdown",
    options: [],
  },
  {
    label: "Patient Type",
    name: "patientTypeId",
    type: "dropdown",
    options: [],
  },
  {
    label: "Visitor Type",
    name: "visitorTypeId",
    type: "dropdown",
    options: [],
  },
  {
    label: "Gender",
    name: "Gender",
    type: "dropdown",
    options: [
      { id: "Male", option: "Male" },
      { id: "Female", option: "Female" },
    ],
  },
  {
    label: "Created By",
    name: "createdBy",
    type: "text",
  },
];

const Patiant_Invoice_report = () => {
  const branch = localStorage.getItem("branch");
  const BranchID = branch?.split(",")[1];
  const [loader,setloader]=useState(true)
  const [openFilter, setFilterOpen] = useState(true);
  const [tempFormData, setTempFormData] = useState({BranchID:BranchID});
  const [dropdownData, setDropdownData] = useState(initialValues);
  const [filterdList, setFilterdList] = useState([]);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const [summaries, setSummaries] = useState();
  const [globelSum, setGlobelSum] = useState({});
  const [notfilterList,setnotfilterList] = useState([])
 
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchFilterOptions = useCallback(async () => {
    try {
      const { data } = await Axios.get(`/admin/report/filterOptions?BranchID=${BranchID}`);
      const updatedDropdownData = dropdownData?.map((item) => {
        switch (item.name) {
          case "BranchID":
            return {
              ...item,
              options: data?.branches?.map((branch) => ({
                id: branch?._id,
                option: branch?.branchName,
              })),
            };
          case "doctorID":
            return {
              ...item,
              options: data?.doctors?.map((doctor) => ({
                id: doctor?._id,
                option: doctor?.name,
                branchID: doctor?.BranchID,
                DepartmentID: doctor?.DepartmentID,
              })),
            };
          case "DepartmentID":
            return {
              ...item,
              options: data?.departments?.map((dept) => ({
                id: dept?._id,
                option: dept?.Name,
                subOption: dept?.BranchID?.branchName,
                branchID: dept?.BranchID?._id,
              })),
            };
          case "ProcedureID":
            return {
              ...item,
              options: data?.procedures?.map((proc) => ({
                id: proc?._id,
                option: proc?.procedure,
                subOption: proc?.DepartmentID?.Name,
                branchID: proc?.BranchID?._id,
                branchName: proc?.BranchID?.branchName,
                DepartmentID: proc?.DepartmentID?._id,
                HSNCode:proc?.HSNCode

              })),
            };
          case "paymentMethod":
            return {
              ...item,
              options: data?.paymentMethods?.map((method) => ({
                id: method?._id,
                option: method?.Method,
              })),
            };
          case "visitorTypeId":
            return {
              ...item,
              options: data?.visitorTypes?.map((type) => ({
                id: type?._id,
                option: type?.type,
              })),
            };
          case "patientTypeId":
            return {
              ...item,
              options: data?.patientTypes?.map((type) => ({
                id: type?._id,
                option: type?.type,
              })),
            };
          case "GST":
            return {
              ...item,
              options: data?.gst?.map((gst) => ({
                id: gst?._id,
                option: gst?._id + "%".toString(),
              })),
            };
          default:
            return item;
        }
      });
      setDropdownData(updatedDropdownData);
    } catch (err) {
      console.error(err);
    }
  },[]);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const mapIdsToNames = useCallback(
    function (invoices) {  
      return invoices.map((invoice) => { 
        const branchName =
          dropdownData
            .find((item) => item.name === "BranchID")
            .options.find((option) => option.id === invoice.BranchID)?.option ||
          "Unknown";
        const doctorName =
          dropdownData
            .find((item) => item.name === "doctorID")
            .options.find((option) => option.id === invoice.doctorID)?.option ||
          "Unknown";
        const departmentName =
          dropdownData
            .find((item) => item.name === "DepartmentID")
            .options.find((option) => option.id === invoice.DepartmentID)
            ?.option || "Unknown"; 
        const itemsWithHSN = invoice.items.map(invitem => {         
           const hsnCode = dropdownData
          .find((item) => item.name === "ProcedureID")
          .options.find((option) => option.id === invitem.ProcedureID)
          ?.HSNCode || "Unknown";          
          return {...invitem, HSNCode:hsnCode}; // Add the HSN code to each item
        }); 
        
        return {
          ...invoice,
          BranchName: branchName,
          DoctorName: doctorName,
          DepartmentName: departmentName,
          items: itemsWithHSN,
        };
      });
      
    },
    [dropdownData]
  );

  const fetchData = useCallback(() => { 
    setloader(true)       
    Axios.get("/admin/report/filter", {
      params: { ...tempFormData, page },
    }).then((res)=>{      
    const enhancedData =  mapIdsToNames(res?.data?.invoices);
    setSummaries(res?.data?.summaries);
    setGlobelSum(res?.data?.globalSums);
    setTotalPages(res?.data?.totalPages);
    if(enhancedData){
      setFilterdList(enhancedData); 
      setloader(false)       
    }    
    
    }).catch((err)=>{
      console.log(err,"error occured")
    })    
    
  },[mapIdsToNames, page, tempFormData])

  useEffect(() => {  
    fetchData(); 
  }, [tempFormData, page, fetchData]);
  
  //print-patient-invoice
  const fetchallData = useCallback(() => { 
    setloader(true)       
    Axios.get("/admin/print-patient-invoice", {
      params: tempFormData
    }).then((res)=>{      
    const enhancedData =  mapIdsToNames(res?.data?.invoices);
    setSummaries(res?.data?.summaries);
    setGlobelSum(res?.data?.globalSums);
    if(enhancedData){
      setnotfilterList(enhancedData); 
      setloader(false)       
    }    
    
    }).catch((err)=>{
      console.log(err,"error occured")
    })    
    
  },[mapIdsToNames,tempFormData])

  useEffect(() => {  
    fetchallData(); 
  }, [tempFormData, fetchallData]);
  

  const filterSubmit = useCallback((formData) => {
    setPage(1); // Reset to page 1 on new filter submission
    setTempFormData(formData); // Update formData for fetching
  }, []);



  return (
    <div className="w-full">
      <div
        className={`border-b flex justify-center ${
          openFilter ? "block" : "hidden"
        } `}
      >
        <FilterComponent
          openFilter={openFilter}
          setFilterOpen={setFilterOpen}
          dropdownData={dropdownData || []}
          filterSubmit={filterSubmit}
        />
      </div>

      <div className="w-auto py-5 px-5">
        <h2 className="text-2xl font-Inter text-center font-semibold uppercase tracking-wide"> 
          Patient - invoice
        </h2>
        <div className="w-auto">
          {loader ? ( <div className="mt-28"><ProgressBar/> </div>  ): (<InvoiceTable
            openFilter={openFilter}
            setFilterOpen={setFilterOpen}
            data={filterdList}
            alldata ={notfilterList}
            summaries={summaries}
            globelSum={globelSum}
          />) }
          
        
        </div>

        <Pagination
          className="py-5"
          count={totalPages}
          page={page}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Patiant_Invoice_report;