/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import DynamicForm from "./AddTypeForm";
import Axios from "../../../Config/axios";
import showAlert from "../../../Utils/showAlert";  
const AddOptions = ({ buttonlist,fetchData }) => {

  const [selectedButton, setSelectedButton] = useState(buttonlist[0]);
  const [reset, setReset] = useState(false);
  const [backendError, setBackendError] = useState(null);

  const handleButtonClick = (button) => {
    setSelectedButton(button);
    setBackendError(null);
  };

  useEffect(() => {
    setSelectedButton(buttonlist[0]); 
  }, [buttonlist]);

  const handleFormSubmit = async (values) => {
    Axios.post(selectedButton.apiEndPoint, values)
      .then((resp) => {
        showAlert(selectedButton.name, resp?.data?.message, "success");
        setReset(true);
        fetchData()
      })
      .catch((err) => {
        setReset(false);
        if (err)
          showAlert(
            selectedButton?.name,
            err?.response?.data?.error,
            "warning"
          );

        if (err.response) {
          setBackendError(err?.response?.data?.errors);
        } else if (err?.request) {
          setBackendError("No response was received from the server");
        } else {
          setBackendError("Error in setting up the request");
        }
      });

    setReset(false);
  };

  return (
    <div className="m-auto w-auto">
      <div
        className={` ${
          buttonlist.length > 1
            ? " topbar  m-5 p-4 bg-white flex flex-wrap justify-center"
            : "hidden"
        }`}
      >
        {buttonlist.map((button, i) =>
          selectedButton?.name === button.name ? (
            <button
              key={i + button.name}
              className={`shadow-sm m-2 px-4 py-2 text-sm uppercase font-semibold  text-gray-700 bg-gray-200 border border-gray-300 rounded-md  ${
                selectedButton?.name === button.name ? "bg-gray-100" : ""
              }`}
              onClick={() => handleButtonClick(button)}
            >
              {button.name}
            </button>
          ) : (
            <button
              key={i + button.name}
              className={`shadow-sm m-2 px-4 py-2 text-sm uppercase font-semibold  text-gray-700 bg-white border border-gray-300 rounded-md  ${
                selectedButton?.name === button.name ? "bg-gray-100" : ""
              }`}
              onClick={() => handleButtonClick(button)}
            >
              {button.name}
            </button>
          )
        )}
      </div>
      <div className="bg-white w-auto min-h-[80vh] px-5">
        {selectedButton && (
          <DynamicForm
            formFields={{
              headText: selectedButton.name,
              subtitle: "Subtitle to describe the usage of form",
              fields: selectedButton.fields,
            }}
            reset={reset}
            setReset={setReset}
            onSubmit={handleFormSubmit}
            value={selectedButton}
          />
        )}

        <div
          className={`w-full  justify-center items-center mt-4 animate-pulse duration-100 flex`}
        >
          <div
            className={`flex justify-center items-ce nter m-4  max-w-2xl p-5 text-red-600   ${
              backendError ? "flex border" : "hidden"
            }`}
          >
            {backendError && (
              <div>
                An error occurred: {JSON.stringify(backendError)}{" "}
                {console.log(backendError)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOptions;


