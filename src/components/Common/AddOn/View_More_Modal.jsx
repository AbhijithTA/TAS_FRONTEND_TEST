/* eslint-disable react/prop-types */
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import Axios from "../../../Config/axios"

const View_More_Modal = ({ showModal, setShowModal, data }) => {
    const [viewData,setViewData] = useState(data) 

    useEffect(()=>{
Axios.get(`/admin/Viw_MainDepartment/${data?._id}`).then((resp)=>{
    setViewData((prev)=>({
        ...prev,
        departments:resp?.data?.departments
    }))
})
    },[data?._id]) 
    const closeModal = (e) => {
        if (e.target.id === "modal-backdrop") {
          setShowModal(false);
        }
      };
    
      // Function to stop event propagation from modal content
      const stopPropagation = (e) => {
        e.stopPropagation();
      };
    
      // Array of Tailwind CSS background color classes
      const bgColors = [
        "bg-red-300",
        "bg-green-300",
        "bg-blue-300",
        "bg-yellow-300",
        "bg-indigo-300",
        "bg-pink-300",
        "bg-orange-300",
        "bg-teal-300",
        "bg-purple-500",
      ];
    
      // Function to randomly select a background color class
      const getRandomBgColor = () => {
        const randomIndex = Math.floor(Math.random() * bgColors.length);
        return bgColors[randomIndex];
      };
  return (
    <div>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            onClick={closeModal}
            id="modal-backdrop"
          >
            <div
              className="relative  my-6 mx-auto w-[40%] max-w-3xl"
              onClick={stopPropagation}
            >
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="p-1">
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-[#6a696977] float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>

                {/*body*/}

                <div className="relative px-10 pb-10 flex-auto bg-white rounded-xl">
                  <div className="flex flex-col gap-8">
                    <div className="flex justify-center gap-10">
                      <div className=" flex flex-col justify-center">
                        <h1 className="text-3xl font-bold text-black uppercase">
                          {data?.Name}
                        </h1>
                        <h2 className="text-lg text-gray-700"> 
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-col gap-5 uppercase">
                      <hr className="border-t border-gray-300" />

                      <div className="flex gap-20">
                        <div className="text-gray-800  font-sans w-[50%]">
                          <div className="flex justify-between my-2">
                            <p className=" font-bold">Name:</p>
                            <p> {data?.Name}</p>
                          </div>

                          <div className="flex justify-between my-2">
                            <p className="capitalize font-bold">Branch:</p>
                            <p>{data?.BranchName}</p>
                          </div>

                         
                        </div>

                        <div className="text-gray-800 font-sans w-[50%]">
                         

                          <div className="flex justify-between my-2">
                            <p className="font-bold">Created by:</p>
                            <p>{data?.createdBy}</p>
                          </div>
                          <div className="flex justify-between my-2">
                            <p className="font-bold">Created At:</p>
                            <p>
                              {moment(data?.createdAt)
                                .tz("Asia/Kolkata")
                                .format("DD-MM-YYYY")}
                            </p>
                          </div>
                          <div className="flex justify-between my-2">
                            <p className="font-bold">Status:</p>
                            <p>
                              {data?.isApproved ? "Approved" : "Not Approved"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <hr className="border-t border-gray-300" />

                      <div>
                        <h1 className="mb-5 font-bold uppercase text-xl">
                          Departments:
                        </h1>
                        <div className="flex flex-wrap gap-5 justify-center items-center">
                          {(viewData?.departments.length > 0) ? viewData?.departments.map((departments, index) => (
                            <h1
                              key={index}
                              className={`border px-4 py-2 rounded-md text-center ${getRandomBgColor()}`}
                            >
                             <span className="text-lg font-semibold">{departments?.Name}</span>  <br />
                              <span className="text-xs">{departments?.BranchID?.branchName}</span>
                            </h1>
                          )):"No Data"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-40 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  )
}

export default View_More_Modal

