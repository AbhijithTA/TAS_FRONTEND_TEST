import { useState } from "react";
import InvocetList from "../../../components/Reception/PatientInvoice/listInvoce";
import AddInvoice from "../../../components/Reception/PatientInvoice/addInvoice";
const ADDPatientInvoice = () => {
  const [refreshList, setRefreshList] = useState(false);
  return (
    <div className="m-auto">
      <h2 className="text-xl font-Inter font-bold uppercase mb-4 text-center py-10">
        Patient Invoice
      </h2>
      <div className="w-full px-10 py-10 bg-white  flex  flex-wrap justify-center">
        <AddInvoice setRefreshList={setRefreshList} />
      </div>
      <InvocetList refresh={refreshList} setRefresh={setRefreshList} list={10}/>
    </div>
  );
};

export default ADDPatientInvoice;
