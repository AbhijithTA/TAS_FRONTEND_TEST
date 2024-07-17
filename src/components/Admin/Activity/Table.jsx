/* eslint-disable react/prop-types */
import { useCallback, useState } from "react";
import moment from "moment-timezone";
import Axios from "../../../Config/axios";
import { formatDate } from "../../../Utils/Datefn";
import Logo from "../../../assets/Logo/Invoicelogo.png";
import ProgressBar from "../../Utils/ProgressBar/ProgressBar";

const InvoiceTable = ({ data,loader }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [branchDetails, setBranchDetails] = useState({}); 

  const fetchBranchDetails = useCallback(
    async (BranchID) => {
      if (branchDetails[BranchID]) {
        return branchDetails[BranchID];
      }
      try {
        const { data } = await Axios.get(`/get-branch/${BranchID}`);
        setBranchDetails((prev) => ({
          ...prev,
          [BranchID]: data,
        }));
        return data;
      } catch (error) {
        console.error("Failed to fetch branch details:", error);
        return null;
      }
    },
    [branchDetails]
  );

  const handleRowClick = useCallback(
    async (row) => {
      await fetchBranchDetails(row.BranchID);
      setSelectedRow(row);
      setShowModal(true);
    },
    [fetchBranchDetails]
  );

  const invoicemodelprint = () => {
    const printWindow = window.open(" ", "_blank");
    const printButton = document.getElementById("PrintButton"); 

    printButton.style.display = "none"; 

    const invoice = document.querySelector("#invoicemodelid").outerHTML;
    const tailwindCssLink =
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">';

    printWindow.document.write(`
    <html>
      <head> 
        ${tailwindCssLink}  
      </head>
      <body>
        ${invoice}  
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      printButton.style.display = "inline-block"; 
    }, 100);
  };

  return (
    <div className="overflow-x-auto mt-6 ">
      <table className="border-collapse text-left bg-white min-w-full border-8">
        <thead>
          <tr className="text-sm leading-normal text-gray-600">
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Invoice ID
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Created Date
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Deleted Date
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Deleted By
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Doctor Name
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Patient Name
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Amount Paid
            </th>
          </tr>
        </thead>
        <tbody className="text-sm font-light">
          {loader ? (
            <tr>
              <td
                colSpan="9"
                className="text-center font-bold text-red-600 py-4"
              >
                <ProgressBar />
              </td>
            </tr>
          ) : data?.length === 0 ? (
            <tr>
              <td
                colSpan="9"
                className="text-center font-bold text-red-600 py-4"
              >
                No data available
              </td>
            </tr>
          ) : (
            data?.map((invoice, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 even:bg-slate-100 odd:bg-white  font-bold "
                onClick={() => handleRowClick(invoice?.file)}
              >
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.file?.invoiceID}
                </td>

                <td className="px-6 py-3 border-b border-gray-200 uppercase text-center ">
                  <span>
                    {moment(invoice?.file.createdAt)
                      .tz("Asia/Kolkata")
                      .format("YYYY-MM-DD")}
                  </span>
                  <span className="px-1"></span>
                  <span>
                  {moment(invoice?.file.createdAt)
                      .tz("Asia/Kolkata")
                      .format("h:mm a")}
                  </span>
                </td>
                <td className="px-6 py-3 border-b border-gray-200  text-center uppercase ">
                  <span>
                    {moment(invoice?.timestamp)
                      .tz("Asia/Kolkata")
                      .format("YYYY-MM-DD")}
                  </span>
                  <span className="px-1"></span>
                  <span>
                    {moment(invoice?.timestamp)
                      .tz("Asia/Kolkata")
                      .format("h:mm a")}
                  </span>
                </td>

                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.changedBy}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.file?.doctorID?.name}
                </td>

                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                {invoice?.file?.patientID?.Name}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                {invoice?.file?.amountToBePaid}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showModal && (
        <div className=" selectcolumn fixed inset-0 flex h-auto  items-center justify-center z-[99]">
          <div
            className="bg-black bg-opacity-50 absolute inset-0"
            onClick={() => {
              setSelectedRow(null);
              setShowModal(false);
            }}
            ></div>
            
          <div
            id="invoicemodelid"
            className="relative bg-white p-4  mx-auto z-10 rounded shadow-md print:w-full print:h-full w-[75%] "
          >
            {/* Display detailed view content */}
            {selectedRow && (
              <div className="relative p-5 bg-white" id="invoice">
              {/* Watermark */}
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
                <span className="text-8xl text-red-800 uppercase transform -rotate-45 ">Deleted</span>
              </div>
              
              {/* Main Content */}
              <div className="relative z-10">
                {/* Header with Logo and Company Address */}
                <div className="flex justify-between items-center border-b pb-4">
                  <img src={Logo} alt="Company Logo" className="h-20" />
                  <div className="text-xs text-right uppercase">
                    <p className="font-bold text-lg">
                      Topmost Dental and Skin Clinic
                    </p>
                    <span>{branchDetails[selectedRow?.BranchID].address}, </span>
                    <span>{branchDetails[selectedRow?.BranchID].city}, </span>
                    <span>{branchDetails[selectedRow?.BranchID].state}, </span>
                    <br />
                    <span>Pin: {branchDetails[selectedRow?.BranchID].pincode}, </span>
                    <span>Phone: {branchDetails[selectedRow?.BranchID].phone}, </span>
                    <span className="lowercase">{branchDetails[selectedRow?.BranchID].email}</span>
                  </div>
                </div>
        
                {/* Patient Details and Invoice Info */}
                <div className="flex justify-between border-b py-2">
                  <div className="text-xs">
                    <p><strong>Patient Details:</strong></p>
                    <p className="capitalize">{selectedRow?.patientID?.Name}</p>
                    <p>{selectedRow?.patientID?.Gender + ", Age:" + selectedRow?.patientID?.age}</p>
                    <p>{selectedRow?.patientID?.address?.address}</p>
                  </div>
                  <div className="text-xs text-left">
                    <p><strong>Invoice ID:</strong> {selectedRow?.invoiceID}</p>
                    <p><strong>Date:</strong> {moment(selectedRow.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD")}</p>
                    <p><strong>Doctor:</strong> {selectedRow?.doctorID?.name}</p>
                    <p><strong>Department:</strong> {selectedRow?.DepartmentID?.Name}</p>
                  </div>
                </div>
        
                {/* Invoice Title */}
                <div className="text-center my-4">
                  <p className="text-xl font-bold uppercase">Invoice</p>
                </div>
        
                {/* Items Table */}
                <div className="mb-4">
                  <table className="min-w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-1 text-xs">No</th>
                        <th className="p-1 text-xs">Item</th>
                        <th className="p-1 text-xs">HSNCode</th>
                        <th className="p-1 text-xs">Qty</th>
                        <th className="p-1 text-xs">Unit Rate</th>
                        <th className="p-1 text-xs">Discount</th>
                        <th className="p-1 text-xs">
                          <div className="flex">
                            <span className="flex-1 p-2">GST</span>
                            <span className="flex-1 p-2">CGST</span>
                            <span className="flex-1 p-2">SGST</span>
                          </div>
                        </th>
                        <th className="p-1 text-xs">Taxable Value</th>
                        <th className="p-1 text-xs">GST</th>
                        <th className="p-1 text-xs">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRow.items.map((item, index) => (
                        <tr key={index + "i"} className="border-b">
                          <td className="p-1 text-xs">{index + 1}</td>
                          <td className="p-1 text-xs">{item?.procedure}</td>
                          <td className="p-1 text-xs">{item?.ProcedureID?.HSNCode}</td>
                          <td className="p-1 text-xs">{item?.quantity}</td>
                          <td className="p-1 text-xs">{item?.unitPrice}</td>
                          <td className="p-1 text-xs">{item?.discount + " " + item?.discountType}</td>
                          <td className="p-1 text-xs">
                            <div className="flex">
                              <span className="border-r p-2 flex-1">{item?.GST}%</span>
                              <span className="border-r p-2 flex-1">{item?.GST / 2}%</span>
                              <span className="flex-1 p-2">{item?.GST / 2}%</span>
                            </div>
                          </td>
                          <td className="p-1 text-xs">{item?.baseAmount}</td>
                          <td className="p-1 text-xs">{item?.gstAmount}</td>
                          <td className="p-1 text-xs">{item?.amountToBePaid}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
        
                {/* Footer with Generated By, Total Amount, etc. */}
                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs">
                    <p><strong>Generated By:</strong> {selectedRow?.createdBy}</p>
                    <p><strong>Printed On:</strong> {formatDate()}</p>
                  </div>
                  <div className="text-xs text-right">
                    <p><strong>Total Amount:</strong> {selectedRow?.totalAmount}</p>
                    <p><strong>Total Discount:</strong> {selectedRow?.totalDiscount}</p>
                    <p><strong>Amount to be Paid:</strong> {selectedRow?.amountToBePaid}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-5 gap-2 ">
                  <button
                    onClick={invoicemodelprint}
                    id="PrintButton"
                    className="print:hidden border border-[#652D91] rounded-lg font-semibold py-1 px-3 text-[#652D91] flex justify-center text-sm items-center gap-2"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      width={30}
                    >
                      <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                          <circle
                            cx="12.024"
                            cy="12.016"
                            fill="#a6adb5"
                            r="11"
                          />
                          <path
                            d="m15 16h-3v-7.4687a.5.5 0 0 0 -.2734-.4458l-2.1375-1.0855h5.4109v3h1v-3.5a.5.5 0 0 0 -.5-.5h-8l-.0111.0023c-.0148 0-.0281.007-.0428.0086a.4877.4877 0 0 0 -.179.0541c-.0091.0048-.02.0034-.0287.0087-.0123.0076-.0175.0217-.029.03a.4859.4859 0 0 0 -.1154.12.4752.4752 0 0 0 -.0359.0532.4894.4894 0 0 0 -.0581.2231v10a.4875.4875 0 0 0 .0662.2346.4634.4634 0 0 0 .0351.0521.4879.4879 0 0 0 .1447.134c.0106.0065.0154.0189.0265.0245l4 2.0425a.5.5 0 0 0 .7275-.4452v-1.5425h3.5a.5.5 0 0 0 .5-.5v-3.5h-1z"
                            fill="#fff"
                          />
                          <path
                            d="m20.2334 11.0845-2.4395-1.772a.5.5 0 0 0 -.7939.4043v1.272h-2.9614a.5.5 0 0 0 0 1h2.9614v1.272a.5.5 0 0 0 .7939.4043l2.4395-1.772a.5.5 0 0 0 0-.8086z"
                            fill="#fff"
                          />
                          <path d="m0 0h24v24h-24z" fill="none" />
                        </g>
                      </g>
                    </svg>
                    Print Invoice
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;
