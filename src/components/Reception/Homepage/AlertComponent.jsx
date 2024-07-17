import { useEffect, useState } from "react";
import Axios from "../../../Config/axios";

const AlertComponent = () => {
  const [alerts, setAlerts] = useState([]);
  const branch = localStorage.getItem("branch");
  const BranchID = branch?.split(",")[1];

  useEffect(() => {
    Axios.get(`/get-alert/${BranchID}`).then((resp) => {
      setAlerts(resp.data);
    });
  }, [BranchID]);
  const getAlertClass = (type) => {
    switch (type) {
      case "Warning":
        return "bg-yellow-200 border-yellow-600 text-yellow-800";
      case "Info":
        return "bg-gray-200 border-gray-600 text-gray-800";
      case "Error":
        return "bg-red-200 border-red-600 text-red-800";
      case "Success":
        return "bg-green-200 border-green-600 text-green-800";
      default:
        return "";
    }
  };

  return (
    <div className="overflow-auto h-[450px] shadow-md rounded-md border border-blue-500 ">
      <div className=" w-full flex h-12 justify-start items-center pl-10 border-b border-blue-500 ">
        <h4 className="font-bold uppercase">{`Today's Notification`}</h4>
      </div>
      {alerts.length ? (
        alerts?.map((alert, index) => (
          <div
            key={index + alert.type}
            className={`border-l-4 p-5 my-3 ${getAlertClass(alert.type)} `}
          >
            <p className="text-base">{alert.msg}</p>
          </div>
        ))
      ) : (
        <div className="h-full w-full flex justify-center items-center flex-col gap-5">
          <svg
            id="Layer_4"
            enableBackground="new 0 0 24 24"
            height="50"
            viewBox="0 0 24 24"
            width="50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path d="m22 10.882c-.552 0-1-.448-1-1 0-2.805-1.092-5.441-3.075-7.425-.391-.391-.391-1.023 0-1.414s1.023-.391 1.414 0c2.361 2.361 3.661 5.5 3.661 8.839 0 .552-.448 1-1 1z" />
            </g>
            <g>
              <path d="m2 10.882c-.552 0-1-.448-1-1 0-3.339 1.3-6.478 3.661-8.839.391-.391 1.023-.391 1.414 0s.391 1.023 0 1.414c-1.983 1.983-3.075 4.62-3.075 7.425 0 .552-.448 1-1 1z" />
            </g>
            <g>
              <path d="m21.379 16.913c-1.512-1.278-2.379-3.146-2.379-5.125v-2.788c0-3.519-2.614-6.432-6-6.92v-1.08c0-.553-.448-1-1-1s-1 .447-1 1v1.08c-3.387.488-6 3.401-6 6.92v2.788c0 1.979-.867 3.847-2.388 5.133-.389.333-.612.817-.612 1.329 0 .965.785 1.75 1.75 1.75h16.5c.965 0 1.75-.785 1.75-1.75 0-.512-.223-.996-.621-1.337z" />
              <path d="m12 24c1.811 0 3.326-1.291 3.674-3h-7.348c.348 1.709 1.863 3 3.674 3z" />
            </g>
          </svg>
          <h3 className="uppercase font-bold tracking-wide ">
            No Notification For Today
          </h3>
        </div>
      )}
    </div>
  );
};
export default AlertComponent;
