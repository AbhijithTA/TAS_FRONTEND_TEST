import { usePatient } from "../../../../hooks/PatientContext";

const PaymentCredits = () => {
  const { patientCredit } = usePatient();

  // Conditional rendering based on the value of patientCredit
  const displayMessage = patientCredit === null || patientCredit === 0
    ? "There is no credit for the patient."
    : `Patient Credit: RS:${patientCredit}`;

  return (
    <>
    <div className="p-6 bg-white h-full">
      <h1 className="text-2xl font-bold mb-4 text-center">Payment Credits</h1>
      <p className="text-center text-xl font-semibold">{displayMessage}</p>
      </div>
    </>
  );
}

export default PaymentCredits;
