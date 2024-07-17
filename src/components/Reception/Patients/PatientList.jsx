/* eslint-disable react/prop-types */
import Table from "./Table";
import { useCallback, useEffect, useState } from "react";
import Axios from "../../../Config/axios";
import { Pagination } from "@mui/material";

const PatientList = ({refresh, setRefresh, list=10}) => {
  const [loader,setloader]=useState(true)
  const [patientList, setPatientList] = useState([]);
  const branch = localStorage.getItem("branch");
  const BranchID = branch?.split(",")[1];
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchData = useCallback(async () => {  
    try {
      const response = await Axios.get(`/patient-list/${BranchID}`, {
        params: { search: searchTerm, page, list },
      });
      setloader(false)
      setPatientList(response?.data?.patients);
      setTotalPages(response?.data?.totalPages);
    } catch (error) {
      console.error("Error fetching patient list:", error);
    }
  }, [BranchID, searchTerm, page, list]);


   useEffect(() => {
    setloader(true)
    fetchData();
  }, [page, list, fetchData]);

  // Separate useEffect for debounced search term changes
  useEffect(() => {
    if (searchTerm || refresh) {
      const handleSearch = setTimeout(() => {
        fetchData();
        setRefresh(false);
      }, 500); // Debounce time
      return () => clearTimeout(handleSearch);
    }
  }, [searchTerm, fetchData, refresh, setRefresh]);

  return (
    <div className="topbar m-5  p-8  bg-white ">
      <div className="flex justify-center w-full">
        <div className="flex justify-start w-full items-center">
          <h2 className="text-xl text-center uppercase font-bold py-5">
            Patient Directory
          </h2>
        </div>
        <div className="w-full flex justify-end">
          <div className="flex gap-5 justify-end items-center w-full">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-[0.965rem] border w-[50%] border-gray-300 rounded mt-2 focus:outline-none focus:border-gray-300"
            />
          </div>
        </div>
      </div>
      <Table
        data={patientList}  
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

export default PatientList;
