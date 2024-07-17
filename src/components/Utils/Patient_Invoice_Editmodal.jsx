/* eslint-disable react/prop-types */
import InvoiceEditPage from "../Admin/PatientInvoice/editInvoice";
const Invoive_Edit_Modal = ({
  showEditModal,
  fetchData,
  setShowEditModal,
  invoice,
}) => {
  // Function to close modal when background is clicked
  const closeModal = (e) => {
    if (e.target.id === "modal-backdrop") {
      setShowEditModal(false);
    }
  };

  // Function to stop event propagation from modal content
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      {showEditModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            onClick={closeModal}
            id="modal-backdrop"
          >
            <div
              className="relative w-auto my-6 mx-auto max-w-6xl h-[90%]"
              onClick={stopPropagation}
            >
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="p-1">
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-[#6a696977] float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowEditModal(false)}
                  >
                    ×
                  </button>
                </div>
                {/*body*/}
                <InvoiceEditPage
                  fetchData={fetchData}
                  invoice={invoice}
                  setShowEditModal={setShowEditModal}
                />
              </div>
            </div>
          </div>
          <div className="opacity-40 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

export default Invoive_Edit_Modal;
