/* eslint-disable react/prop-types */
import Table from "./Table";
import { useCallback, useEffect, useState } from "react";
import Axios from "../../../Config/axios";
import { Pagination } from "@mui/material"; 
import Select_Branch_ID from "../../Utils/BranchIDSelection";

const Deleted_Invoice_List = () => {
  const [loader,setloader]=useState(true)
  const [patientInvoiceList, setPatientInvoiceList] = useState([]);
  const [branch, setBranch] = useState({}); 
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchData = useCallback(() => {
    setloader(true)
    Axios.get(`/admin/deleted_invoices/${branch?.id}`, {
      params: { page: page, limit:  10 }, 
    })
      .then((response) => {
        setloader(false)
        setPatientInvoiceList(response?.data?.deleted_records); 
        setTotalPages(response?.data?.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching patient list:", error);
      });
  }, [branch?.id, page]); 

  useEffect(() => {
    if (branch?.id) fetchData();
  }, [branch?.id, page, fetchData]);

  return (
    <div className="topbar p-10 bg-white hover:cursor-pointer">
      <div className="flex justify-center w-full">
        <div className="w-3/4 flex justify-start">
          <h2 className="text-xl font-Inter font-bold uppercase tracking-normal">
            Deleted invoicelist
          </h2>
        </div>
        <div className="w-1/4 flex justify-end">
          <div className="search-bar w-full ">
            <div className="flex justify-center  items-center  w-full  gap-5 ">
              <Select_Branch_ID value={branch} onChange={setBranch} /> 
            </div>
          </div>
        </div>
      </div>
      <Table
        data={patientInvoiceList} 
        fetchData={fetchData}
        loader={loader}
      />
      <Pagination
        className="mt-5"
        count={totalPages}
        page={page}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default Deleted_Invoice_List;
