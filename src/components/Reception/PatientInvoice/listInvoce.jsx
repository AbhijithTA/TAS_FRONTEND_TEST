/* eslint-disable react/prop-types */
import Table from "./Table";
import { useCallback, useEffect, useState } from "react";
import Axios from "../../../Config/axios";
import { Pagination } from "@mui/material"; 

const InvoiceList = ({ setRefresh, refresh,list=20 }) => {
  const [loader,setloader]=useState(true)
  const [patientInvoiceList, setPatientInvoiceList] = useState([]);
  const branch = localStorage.getItem("branch");
  const BranchID = branch?.split(",")[1];
  const [searchTerm, setSearchTerm] = useState(""); 
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchData = useCallback(() => {
    setloader(true)
    Axios.get(`/patient-invoice-list/${BranchID}`, {
      params: { search: searchTerm, page: page, limit: list },
    })
      .then((response) => {
        setloader(false)
        setPatientInvoiceList(response?.data?.patientInvoice); 
        setTotalPages(response?.data?.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching patient list:", error);
      });
  }, [BranchID, page, searchTerm]);

  useEffect(() => {
    if (searchTerm || refresh) {
      const debounceFetch = setTimeout(() => {
        fetchData();
        setRefresh(false);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(debounceFetch);
    }
  }, [searchTerm, fetchData, refresh, setRefresh]);

  useEffect(() => {
    if (BranchID) fetchData();
  }, [BranchID, fetchData, page]);

  return (
    <div className="topbar p-10 bg-white">
      <div className="flex justify-center w-full">
        <div className="w-1/2 flex justify-start">
          <h2 className="text-xl font-Inter font-bold uppercase tracking-normal">
            Patient invoice Directory
          </h2>
        </div>
        <div className="w-1/2 flex justify-end">
          <div className="search-bar w-full ">
            <div className="flex justify-center  items-center  w-full  gap-5 ">
              <input
                type="text"
                placeholder="Search Invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-[0.965rem] focus:outline-none border border-gray-300 rounded w-full mt-2"
              />
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

export default InvoiceList;
