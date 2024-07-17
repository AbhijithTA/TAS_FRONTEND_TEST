const ClinicalNote = () => {
  return (
    <div className="max-w-5xl container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-center mb-4 uppercase">Clinical Note</h1>
        <div className="mb-6 border p-4 rounded">
          <label className="block text-gray-700 font-bold mb-2">
            Patient Information
          </label>
          <div className="w-full p-2 border rounded h-24 flex  justify-between items-center">
            <div className="flex flex-col w-1/2">
              <span>Patient ID:</span>
              <span>Name: </span>
              <span>Place: </span>
            </div>
            <div className="flex flex-col w-1/2 justify-center items-center">
              <span> Age:</span>
              <span>Gender: </span>
              <span>Phone: </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalNote;
