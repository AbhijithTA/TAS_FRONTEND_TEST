/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Axios from "../../../Config/axios";
import moment from "moment-timezone";

const History = ({ showModal, setShowModal, Data }) => {
  const [history, setHistory] = useState([]);
  const closeModal = (e) => {
    if (e.target.id === "modal-backdrop-2") {
      setShowModal(false);
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (Data?._id) {
      Axios.get(`/admin/history-logs/${Data?._id}`).then((resp) => {
        setHistory(resp?.data);
      });
    }
  }, [Data?._id]);

  const formatValue = (value) => {
    if (Array?.isArray(value)) {
      return value?.map((item) => (
        <span key={item?._id}>
          <span>
            {item?.procedure} (Qty: {item?.quantity}, Price: {item?.unitPrice})
          </span>
          <br />
        </span>
      ));
    } else if (typeof value === "object") {
      return Object.entries(value)
        ?.filter(([key]) => key === "paymentMethod")
        .map(([key, val]) => (
          <span key={key}>
            <span>{`${val}`}</span> <br />
          </span>
        ));
    } else {
      return <span>{value}</span>;
    }
  };

  return (
    <div>
      {showModal && (
        <>
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeModal}
            id="modal-backdrop-2"
          >
            <div
              className="relative mx-auto w-full max-w-3xl"
              onClick={stopPropagation}
            >
              <div className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 scale-95 hover:scale-100">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {Data?.invoiceID}
                  </h2>
                  <button
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>
                <div
                  className="p-6 overflow-y-auto"
                  style={{ maxHeight: "60vh" }}
                >
                  {history.length > 0 ? (
                    history.map((his, index) => (
                      <div
                        key={index}
                        className="mb-6 border rounded-lg p-4 shadow-md bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-500 font-semibold">
                            {moment(his?.timestamp)
                              .tz("Asia/Kolkata")
                              .format("YYYY-MM-DD hh:mm A")}
                          </span>
                          <span className="font-semibold ">
                            <span className="text-gray-500">Changed by:-</span>{" "}
                            <span className="uppercase text-blue-800">
                              {his?.changedBy}
                            </span>
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-inner">
                          {his?.changes.map((change, i) => (
                            <div key={i} className="mb-4 last:mb-0">
                              <h3 className="font-semibold mb-2">
                                <span className="text-gray-500 capitalize">
                                  changed field:- {"  "}
                                </span>
                                <span className="uppercase text-lg text-blue-800">
                                  {change?.field}
                                </span>
                              </h3>
                              <div className="flex items-center justify-between text-sm">
                                <div className=" text-red-700 text-start">
                                  {change?.oldValue && (
                                    <> 
                                      <h4 className="font-semibold">Old Value</h4>
                                      {formatValue(change?.oldValue)}
                                    </>
                                  )}
                                </div>
                                <div className=" text-green-700 pl-2 text-end">
                                  <h4 className="font-semibold">New Value</h4>
                                  {formatValue(change?.newValue)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-600">
                      No History Found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default History;
