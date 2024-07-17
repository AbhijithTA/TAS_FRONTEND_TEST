/* eslint-disable react/prop-types */
import Table from "./Table";
import { useCallback, useEffect, useState } from "react";
import Axios from "../../../Config/axios";
import { Pagination } from "@mui/material"; 
import Select_Branch_ID from "../../Utils/BranchIDSelection";

const InvoiceList = ({setRefresh,refresh,list=20}) => {
  const [loader,setloader]=useState(true)
  const [patientInvoiceList, setPatientInvoiceList] = useState([]);
  const [branch, setBranch] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); 
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchData = useCallback(() => {
    setloader(true)
    Axios.get(`/patient-invoice-list/${branch?.id}`, {
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
  }, [branch?.id, page, searchTerm]);

  useEffect(() => {
    if (branch?.id && (searchTerm || refresh)) {
      const debounceFetch = setTimeout(() => {
        fetchData();
        setRefresh(false);
      }, 500);
      return () => clearTimeout(debounceFetch);
    }
  }, [branch?.id, searchTerm, fetchData, refresh, setRefresh]);

  useEffect(() => {
    if (branch?.id) fetchData();
  }, [branch?.id, page, fetchData]);

  return (
    <div className="topbar p-10 bg-white ">
      <div className="flex justify-center w-full">
        <div className="w-1/2 flex justify-start">
          <h2 className="text-xl font-Inter font-bold uppercase tracking-normal">
            Patient invoicelist
          </h2>
        </div>
        <div className="w-1/2 flex justify-end">
          <div className="search-bar w-full ">
            <div className="flex justify-center  items-center  w-full  gap-5 ">
              <Select_Branch_ID value={branch} onChange={setBranch} />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-[0.965rem]  border border-gray-300 rounded w-full mt-2 focus:outline-none"
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
