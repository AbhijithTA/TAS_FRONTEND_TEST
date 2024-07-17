import { useEffect, useState } from "react";
import ListofOptions from "../../../components/Common/AddOn/ListofOptions";
import Axios from "../../../Config/axios";
import { Pagination } from "@mui/material"; 
const initialData = [
  {
    name: "Doctors",
    endpoints: {
      update: "/admin/Doctor/updateStatus",
      toggleVisibility: "/admin/Department/toggleVisibility",
      approve: "/admin/Doctor/approve",
    },
    columns: [
      "name",
      "Gender",
      "specialization",
      "BranchName",
      "DepartmentName",
      "phone",
      "createdBy",
      "isApproved",
    ],
    Head: [
      "Doctor Name",
      "Gender",
      "Specialization",
      "Branch",
      "Department",
      "Phone",
      "created",
      "status",
    ],
    data: [],
  },
];
const limit = 10;
const DoctorsList = () => {
  const [loader,setloader]=useState(true)
  const [refresh, setRefresh] = useState(false);
  const [tableData, setTableData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const branch = localStorage.getItem("branch");
  const BranchID = branch?.split(",")[1];

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (searchTerm) setPage(1)
    setloader(true)
    Axios.get("admin/list-doctors", {
      params: { search: searchTerm, page: page, limit: limit,BranchID },
    }).then((resp) => {
      setTotalPages(resp?.data?.totalPages);
      setloader(false)
      const data = resp.data;
      const updatedData = initialData?.map((table) => ({
        ...table,
        data: data[table.name] || [],
      }));
      setTableData(updatedData); 
    });
  }, [BranchID, page, refresh, searchTerm]);
  
  return (
    <>
      <div className="px-10 pt-5">
        <input
          type="text"
          placeholder="Search ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded w-full"
        />
      </div>
      <ListofOptions
        limit={limit}
        page={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        refresh={refresh}
        setRefresh={setRefresh}
        tableData={tableData}
        loader={loader}
        setloader={setloader}
        className={"pb-3"}
      />
      <Pagination
        className="ms-5"
        count={totalPages}
        page={page}
        onChange={handlePageChange}
      />
    </>
  );
};

export default DoctorsList;
