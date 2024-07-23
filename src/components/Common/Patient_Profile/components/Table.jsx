import { useEffect, useState } from "react";
import ProgressBar from "../../../Utils/ProgressBar/ProgressBar.jsx";

const Table_invoices = ({ Data }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  console.log(Data,"data");

  return (
    <>
      <div>
        <table className="border-collapse text-left bg-white min-w-full border-2 rounded-lg shadow-lg">
          <thead>
            <tr>
              <th className="px-6 py-3 font-semibold uppercase border-b border-gray-300 text-xs text-center rounded-tl-lg">
                ID
              </th>
              <th className="px-6 py-3 font-semibold uppercase border-b border-gray-300 text-xs text-center rounded-tl-lg">
                Date
              </th>
              <th className="px-6 py-3 font-semibold uppercase border-b border-gray-300 text-xs text-center rounded-tl-lg">
                Created By
              </th>
              <th className="px-6 py-3 font-semibold uppercase border-b border-gray-300 text-xs text-center rounded-tl-lg">
                Procedure
              </th>
              <th className="px-6 py-3 font-semibold uppercase border-b border-gray-300 text-xs text-center rounded-tl-lg">
                Quantity
              </th>
              <th className="px-6 py-3 font-semibold uppercase border-b border-gray-300 text-xs text-center rounded-tl-lg">
                Total Discount
              </th>
              <th className="px-6 py-3 font-semibold uppercase border-b border-gray-300 text-xs text-center rounded-tl-lg">
                Amount Paid
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center font-bold text-red-600 py-4"
                >
                  <ProgressBar />
                </td>
              </tr>
            ) : Data.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center font-bold text-red-600 py-4"
                >
                  No Invoice for this Patient
                </td>
              </tr>
            ) : (
              Data.map((invoice, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-300 even:bg-slate-100 odd:bg-white"
                >
                  <td className="px-6 py-3 border-b border-gray-300 capitalize text-center">
                    {invoice.invoiceID}
                  </td>
                  <td className="px-6 py-3 border-b border-gray-300 capitalize text-center">
                    {new Date(invoice.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-6 py-3 border-b border-gray-300 capitalize text-center">
                    {invoice.createdBy}
                  </td>
                  <td className="px-6 py-3 border-b border-gray-300 capitalize text-center">
                    {invoice.items?.map((item, i) => (
                      <span key={i}>
                        {item.procedure}
                        <br />
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-3 border-b border-gray-300 capitalize text-center">
                  {invoice.items?.map((item, i) => (
                      <span key={i}>
                        {item.quantity}
                        <br />
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-3 border-b border-gray-300 capitalize text-center">
                    {invoice.totalDiscount}
                  </td>
                  <td className="px-6 py-3 border-b border-gray-300 capitalize text-center">
                    {invoice.amountToBePaid}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table_invoices;
