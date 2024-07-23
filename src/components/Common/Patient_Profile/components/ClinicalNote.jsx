import { usePatient } from "../../../../hooks/PatientContext";
import React, { useCallback, useMemo, useState } from "react";
import {
  IoIosArrowForward,
  IoIosArrowDown,
  IoIosArrowUp,
} from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import ClinicalNoteForm from "./Clinical_Note_Form";

const INITIAL_FORM_DATA = {
  date: "",
  chiefComplaint: "",
  historyOfPresentingIllness: "",
  pastMedicalHistory: "",
  notes: "",
  allergies: "",
};

const ClinicalNoteUser = () => {
  const { jobRole, clinicalHistory } = usePatient();
  const [editingIndex, setEditingIndex] = useState(null);
  const [visibleSections, setVisibleSections] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clinicalModelForm, setClinicalModelForm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleEditClick = (index, item) => {
    setEditingIndex(index);
    setEditData({ ...item });
    setModalIsOpen(true);
  };

  const handleDeleteClick = async (index, item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.delete(`/doctor/delete-clinicalNote/${patient?._id}`, {
            data: { clinicalNoteId: item?._id },
          });
          fetchClinicalNotes(); // Automatically update data
          Swal.fire(
            "Deleted!",
            "Your clinical note has been deleted.",
            "success"
          );
        } catch (err) {
          toast.error("Failed to delete clinical note");
          console.error("Error deleting clinical note:", err);
        }
      }
    });
  };

  const toggleSection = (index) => {
    setVisibleSections((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleFormSubmit = async (formdata) => {
    try {
      const data = [formdata];
      await Axios.post(`/doctor/add-clinicalNote/${patient?._id}`, { data });
      toast.success("Clinical Note added successfully");
      setClinicalModelForm(false);
      fetchClinicalNotes(); // Automatically update data
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="p-6 bg-white mt-4 w-full shadow-md rounded-md h-full overflow-x-auto">
        <h1 className="text-2xl font-semibold text-center">Clinical History</h1>
        <div className="flex items-center justify-between">
          {jobRole === "doctor" &&  (
            <h1
              className="text-sm font-semibold"
              onClick={() => setClinicalModelForm(true)}
            >
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-10 inline-block mr-1 cursor-pointer hover:text-blue-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </h1>
          )}
        </div>
        {/* listing history */}
        <div>
          {clinicalHistory.length === 0 ? (
            <p className="text-center text-gray-600 font-bold my-10">
              No history found
            </p>
          ) : null}

          {clinicalHistory.map((item, index) => (
            <div
              key={index}
              className="p-2 mb-4 border rounded my-7 bg-[#fceded]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-md  uppercase">
                    <strong>Chief Complaint:</strong> {item.chiefComplaint}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-7 ">
                  {jobRole === "doctor" && visibleSections[index] && (
                    <>
                      <p
                        className="cursor-pointer capitalize text-sm hover:underline hover:text-blue-600 text-gray-600"
                        onClick={() => handleEditClick(index, item)}
                      >
                        <FiEdit />
                      </p>
                      <p
                        className="cursor-pointer capitalize text-sm hover:underline hover:text-red-600 text-gray-600"
                        onClick={() => handleDeleteClick(index, item)}
                      >
                        <AiFillDelete />
                      </p>
                    </>
                  )}
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      toggleSection(index);
                      setEditingIndex(null);
                    }}
                  >
                    {visibleSections[index] ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </p>
                </div>
              </div>
              {visibleSections[index] && (
                <div className="my-2 uppercase text-sm">
                  <p>
                    <strong>History of Presenting Illness:</strong>{" "}
                    {item.historyOfPresentingIllness}
                  </p>
                  <p>
                    <strong>Past Medical History:</strong>{" "}
                    {item.pastMedicalHistory}
                  </p>
                  <p>
                    <strong>Notes:</strong> {item.notes}
                  </p>
                  <p>
                    <strong>Allergies:</strong> {item.allergies}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {modalIsOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-1/3">
            <div className="flex justify-between">
              <h1>Edit Clinical History</h1>
              <button onClick={() => setModalIsOpen(false)} className="text-xl">
                &times;
              </button>
            </div>
            <div className="my-4 flex flex-col gap-4">
              <p>
                <TextField
                  label="Chief Complaint"
                  type="text"
                  value={editData.chiefComplaint}
                  onChange={(e) =>
                    handleChange("chiefComplaint", e.target.value)
                  }
                  className="border p-2 mb-2 w-full"
                />
              </p>
              <p>
                <TextField
                  label="Date"
                  type="date"
                  value={editData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="border p-2 mb-2 w-full"
                />
              </p>
              <p>
                <TextField
                  label="History of Presenting Illness"
                  type="text"
                  value={editData.historyOfPresentingIllness}
                  onChange={(e) =>
                    handleChange("historyOfPresentingIllness", e.target.value)
                  }
                  className="border p-2 mb-2 w-full"
                />
              </p>
              <p>
                <TextField
                  label="Past Medical History"
                  type="text"
                  value={editData.pastMedicalHistory}
                  onChange={(e) =>
                    handleChange("pastMedicalHistory", e.target.value)
                  }
                  className="border p-2 mb-2 w-full"
                />
              </p>
              <p>
                <TextField
                  label="Notes"
                  type="text"
                  value={editData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="border p-4 mb-2 w-full"
                />
              </p>
              <p>
                <TextField
                  label="Allergies"
                  type="text"
                  value={editData.allergies}
                  onChange={(e) => handleChange("allergies", e.target.value)}
                  className="border p-2 mb-2 w-full"
                />
              </p>
              <button
                onClick={handleSaveClick}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* clinical note form */}
      <ClinicalNoteForm
        isOpen={clinicalModelForm}
        onClose={() => setClinicalModelForm(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};

export default ClinicalNoteUser;
