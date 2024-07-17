/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Table from "./Table";

const ListofOptions = ({ tableData, refresh, setRefresh, initialPage = 1, page, limit = 10, loader, className }) => {
  const [selectedTable, setSelectedTable] = useState(tableData[0]?.name);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]); 


  
  useEffect(() => {
    filterData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedTable, tableData, limit, currentPage]);

  const filterData = () => {
    const selectedTableData = tableData.find((item) => item.name === selectedTable);
    if (selectedTableData) {
      const filtered = selectedTableData.data.filter((row) =>
        Object.entries(row).some(
          ([key, value]) =>
            key !== "createdBy" &&
            value.toString().toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
        )
      );
      setFilteredData(filtered);
      setTotalPages(Math.ceil(filtered.length / limit));
    }
  };

  const handleTableClick = (tableName) => {
    setSelectedTable(tableName);
    setCurrentPage(initialPage); // Reset to the initial page when the table changes
    setSearchQuery(""); // Reset search query when table changes
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const selectedTableData = tableData.find((item) => item.name === selectedTable);
  const paginatedData = filteredData.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className={`m-auto w-auto ${className}`}>
      <div className={` ${tableData.length > 1 ? "topbar m-5 p-4 bg-white flex flex-wrap justify-center" : "hidden"}`}>
        {tableData.map((item, i) => (
          <button
            key={i + item.name}
            onClick={() => handleTableClick(item.name)}
            className={`${selectedTable === item.name ? 'bg-gray-200' : ''} uppercase shadow-sm m-2 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-md`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="mx-5 px-4 bg-white w-auto">
        
        {selectedTable &&  (
          <>
            {!(selectedTable==="Doctors") && <div className="mb-4">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(initialPage); // Reset to the initial page when search query changes
                }}
                placeholder="Search..."
                className="px-4 py-2 border border-gray-300 rounded-md w-full outline-none focus:outline-none"
              />
            </div>}
            <Table
              columns={selectedTableData.columns}
              Head={selectedTableData.Head}
              endpoints={selectedTableData.endpoints}
              Data={paginatedData}
              selectedTable={selectedTable}
              refresh={refresh} setRefresh={setRefresh}
              page={currentPage}
              limit={limit}
              loader={loader}
              doctorPage={page}
            />
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-md ${currentPage === 1 ? ' bg-blue-200 text-white': 'bg-blue-500 text-white'}`}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-md ${currentPage === totalPages ? ' bg-blue-200 text-white': 'bg-blue-500 text-white'}`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListofOptions;
