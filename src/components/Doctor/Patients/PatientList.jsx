/* eslint-disable react/prop-types */
import Table from "./Table";
import { useCallback, useEffect, useState } from "react";
import Axios from "../../../Config/axios";
import { Pagination } from "@mui/material";
import Select_Branch_ID from "../../Utils/BranchIDSelection";



const PatientList = ({ refresh, setRefresh, list = 10 }) => {
  const [loader, setloader] = useState(true);
  const [patientList, setPatientList] = useState([]);
  const [branch, setBranch] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total number of p

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchData = useCallback(async () => {
    if (!branch?.id) return;
    try {
      const response = await Axios.get(`/patient-list/${branch?.id}`, {
        params: { search: searchTerm, page, list },
      });
      setloader(false);
      setPatientList(response?.data?.patients);
      setTotalPages(response?.data?.totalPages);
    } catch (error) {
      console.error("Error fetching patient list:", error);
    }
  }, [branch?.id, searchTerm, page, list]);

  useEffect(() => {
    setloader(true);
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
    <>
      <div className="topbar m-5  p-8  bg-white ">
        <div className="flex justify-center w-full">
          <div className="flex justify-start w-full items-center">
            <h2 className="text-xl text-center uppercase font-bold py-5">
              Patient list - {branch?.type}
            </h2>
          </div>
          <div className="w-full flex justify-end">
            <div className="flex gap-5 justify-center items-center w-full">
              <Select_Branch_ID value={branch} onChange={setBranch} />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-[0.965rem] border border-gray-300 rounded mt-2 focus:outline-none focus:border-gray-300"
              />
            </div>
          </div>
        </div>

        <Table
          data={patientList}
          BranchID={branch?.id}
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
    </>
  );
};

export default PatientList;
