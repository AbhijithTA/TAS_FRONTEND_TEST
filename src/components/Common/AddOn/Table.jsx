/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Axios from "../../../Config/axios";
import DynamicEditModal from "./EditModal";
import Doctorlist_Model from "../Doctor/Doctor_List_Modal";
import View_More_Modal from "./View_More_Modal";
import ProgressBar from "../../Utils/ProgressBar/ProgressBar";

function CustomTable({
  Head,
  columns,
  Data,
  endpoints,
  selectedTable,
  refresh,
  setRefresh,
  page,
  limit,
  loader,
  doctorPage
}) {
  const [showModal, setShowModal] = useState(false);
  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  const [data, setData] = useState(Data);
  const jobRole = localStorage.getItem("jobRole");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedViewMoreData, setSelectedViewMoreData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleToggleChange = (id, currentStatus) => {
    const newData = data.map((item) =>
      item._id === id ? { ...item, status: !currentStatus } : item
    );
    Axios.put(endpoints.update, { id, status: !currentStatus }).then(() => {
      setData(newData);
    });
    // Here you can also update the status in your backend or global state
  };

  const handleApprove = (id) => {
    const newData = data.map((item) =>
      item._id === id ? { ...item, isApproved: true, status: true } : item
    );
    Axios.put(endpoints.approve, { id }).then(() => {
      setData(newData);
    });
    // Here you can also update the status in your backend or global state
  };

  useEffect(() => {
    setData(Data); 
  }, [Data]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openDoctorModal = () => setShowModal(true);
  const openViewMoreModal = () => setShowViewMoreModal(true);

  const handleRowClick = (option, row) => {
    setSelectedRowData(row);
    openModal();
    setSelectedOption(option);
  };
  const handleDoctorRowClick = (row) => {
    setSelectedRowData(row);
    openDoctorModal();
  };
  const handleViewMoreClick = (row) => {
    setSelectedViewMoreData(row);
    openViewMoreModal();
  };

  return (
    <div className="flex flex-col justify-center  items-center mx-auto ">
      {isModalOpen && (
        <DynamicEditModal
          refresh={refresh}
          setRefresh={setRefresh}
          initialData={selectedRowData}
          selectedOptionName={selectedOption}
          open={isModalOpen}
          onClose={closeModal}
        />
      )}
      {showModal && (
        <Doctorlist_Model
          Data={selectedRowData}
          setShowModal={setShowModal}
          showModal={showModal}
          refresh={refresh}
          setRefresh={setRefresh} 
        />
      )}
      {showViewMoreModal && (
        <View_More_Modal
          data={selectedViewMoreData}
          setShowModal={setShowViewMoreModal}
          showModal={showViewMoreModal} 
        />
      )}
      <h1 className="text-xl text-center uppercase font-bold py-5">
         {selectedTable} Directory
      </h1>
      <table className="border-collapse text-left bg-white border-8 w-full capitalize">
        <thead>
          <tr className="text-sm leading-normal text-gray-600">
            <th className="px-3 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs">
              Sl.No
            </th>
            {Head?.map((Head, index) => (
              <th
                key={index}
                className="px-3 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs"
              >
                {Head}
              </th>
            ))} 
              <th className="px-3 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs">
                Action
              </th> 
          </tr>
        </thead>
        <tbody className="text-sm font-light">
          {loader ? ( <tr>
              <td colSpan="9" className="text-center font-bold text-red-600 py-4">
              <ProgressBar/>  
              </td>
            </tr>   ): (data.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center font-bold text-red-600 py-4">
                No data available
              </td>
            </tr>
          ) : (
            <>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 even:bg-slate-100 odd:bg-white"
                >
                  <td className="px-3 py-3 border-b border-gray-200">
                    {index + 1 + ((doctorPage || page ) - 1) * limit}
                  </td>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-3 py-3 border-b border-gray-200 cursor-pointer"
                    >
                      {column === "isApproved"
                        ? row[column]
                          ? "Approved"
                          : "Not Approved"
                        : row[column]}
                    </td>
                  ))}
                  <td className="px-3 py-3 border-b border-gray-200">
                    <div className="flex flex-col items-center lg:flex-row gap-4">
                      {(selectedTable === "Doctors" || selectedTable === "Main Department") && (
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            (selectedTable === "Doctors") ? handleDoctorRowClick(row) : (selectedTable === "Main Department" ? handleViewMoreClick(row) : " " )
                          }}
                        >
                          <svg
                            version="1.1"
                            id="Capa_1"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width={30}
                            viewBox="0 0 461.312 461.312"
                            style={{
                              enableBackground: "new 0 0 461.312 461.312",
                            }}
                          >
                            <g>
                              <g>
                                <path
                                  d="M230.656,156.416c-40.96,0-74.24,33.28-74.24,74.24s33.28,74.24,74.24,74.24s74.24-33.28,74.24-74.24
                        S271.616,156.416,230.656,156.416z M225.024,208.64c-9.216,0-16.896,7.68-16.896,16.896h-24.576
                        c0.512-23.04,18.944-41.472,41.472-41.472V208.64z"
                                />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path
                                  d="M455.936,215.296c-25.088-31.232-114.688-133.12-225.28-133.12S30.464,184.064,5.376,215.296
                        c-7.168,8.704-7.168,21.504,0,30.72c25.088,31.232,114.688,133.12,225.28,133.12s200.192-101.888,225.28-133.12
                        C463.104,237.312,463.104,224.512,455.936,215.296z M230.656,338.176c-59.392,0-107.52-48.128-107.52-107.52
                        s48.128-107.52,107.52-107.52s107.52,48.128,107.52,107.52S290.048,338.176,230.656,338.176z"
                                />
                              </g>
                            </g>
                          </svg>
                        </div>
                      )}
                      <button
                        title="Edit"
                        onClick={() => handleRowClick(selectedTable, row)}
                      >
                        <svg
                          height="20"
                          viewBox="0 -1 401.52289 401"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="#007BFF"
                            d="m370.589844 250.972656c-5.523438 0-10 4.476563-10 10v88.789063c-.019532 16.5625-13.4375 29.984375-30 30h-280.589844c-16.5625-.015625-29.980469-13.4375-30-30v-260.589844c.019531-16.558594 13.4375-29.980469 30-30h88.789062c5.523438 0 10-4.476563 10-10 0-5.519531-4.476562-10-10-10h-88.789062c-27.601562.03125-49.96875 22.398437-50 50v260.59375c.03125 27.601563 22.398438 49.96875 50 50h280.589844c27.601562-.03125 49.96875-22.398437 50-50v-88.792969c0-5.523437-4.476563-10-10-10zm0 0"
                          />
                          <path
                            fill="#007BFF"
                            d="m376.628906 13.441406c-17.574218-17.574218-46.066406-17.574218-63.640625 0l-178.40625 178.40625c-1.222656 1.222656-2.105469 2.738282-2.566406 4.402344l-23.460937 84.699219c-.964844 3.472656.015624 7.191406 2.5625 9.742187 2.550781 2.546875 6.269531 3.527344 9.742187 2.566406l84.699219-23.464843c1.664062-.460938 3.179687-1.34375 4.402344-2.566407l178.402343-178.410156c17.546875-17.585937 17.546875-46.054687 0-63.640625zm-220.257812 184.90625 146.011718-146.015625 47.089844 47.089844-146.015625 146.015625zm-9.40625 18.875 37.621094 37.625-52.039063 14.417969zm227.257812-142.546875-10.605468 10.605469-47.09375-47.09375 10.609374-10.605469c9.761719-9.761719 25.589844-9.761719 35.351563 0l11.738281 11.734375c9.746094 9.773438 9.746094 25.589844 0 35.359375zm0 0"
                          />
                        </svg>
                      </button>
                      {jobRole === "admin" && (
                        <>
                          {" "}
                          <div>
                            <label
                              className="flex items-center cursor-pointer"
                              title={`${!row.status ? "Block" : "UnBlock"}`}
                            >
                              <input
                                type="checkbox"
                                checked={row.status}
                                onChange={() =>
                                  handleToggleChange(row._id, row.status)
                                }
                                className="sr-only"
                              />
                              <div
                                className={`relative toggle w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                                  row.status ? "bg-[#28A745]" : "bg-[#6C757D]"
                                }`}
                              >
                                <span
                                  className={`absolute right-5 top-1 bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                                    row.status ? "translate-x-full" : ""
                                  }`}
                                  style={{
                                    transform: `translateX(${
                                      row.status ? "100%" : "0%"
                                    })`,
                                  }}
                                ></span>
                              </div>
                            </label>
                          </div>
                          <div className="flex">
                            {typeof row.isApproved !== "undefined" &&
                              (row.isApproved ? (
                                <button
                                  title={`${
                                    row.isApproved ? "Approved" : "Approve"
                                  }`}
                                  className="hover:cursor-default rounded-lg"
                                >
                                  <svg
                                    height="20"
                                    viewBox="0 0 520 520"
                                    width="20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g id="_7-Check" data-name="7-Check">
                                      <path d="m79.423 240.755a47.529 47.529 0 0 0 -36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515l250.787-403.892c.041-.067.084-.134.128-.2 2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0 -19.362 1.343q-.135.166-.278.327l-252.922 285.764a10.961 10.961 0 0 1 -15.585.843l-83.94-76.386a47.319 47.319 0 0 0 -31.939-12.438z" />
                                    </g>
                                  </svg>
                                </button>
                              ) : (
                                <input
                                  type="checkbox"
                                  title={`${
                                    row.isApproved ? "Approved" : "Approve"
                                  }`}
                                  checked={row.isApproved}
                                  onChange={() => handleApprove(row._id)}
                                  className="w-6 h-6 hover:cursor-pointer"
                                />
                              ))}
                          </div>{" "}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomTable;
