import Table_invoices from "./Table";
import { usePatient } from "../../../../hooks/PatientContext";

const Invoices = () => {
 const { invoiceData } = usePatient();

 console.log(invoiceData);

  return (
    <>
      <div className="p-6 bg-white h-full">
        <h1 className="text-2xl font-semibold mb-4 uppercase text-center ">
          Invoices
        </h1>
        <Table_invoices Data={invoiceData} />
      </div>
    </>
  );
};

export default Invoices;
