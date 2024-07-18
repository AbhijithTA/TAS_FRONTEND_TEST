/* eslint-disable react/prop-types */
import { useState } from "react";
import Logo from "../../../assets/Logo/Invoicelogo.png";
import { formatDate } from "../../../Utils/Datefn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import Axios from "../../../Config/axios";
import { useCallback } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
const DataTable = ({
  data,
  alldata,
  setFilterOpen,
  openFilter,
  summaries,
  globelSum,
}) => {
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
        // Cache fetched data
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
      setShowModal(true);
      setSelectedRow(row);
    },
    [fetchBranchDetails]
  );
  const printTable = async () => {
    try {
      const printWindow = window.open("", "_blank"); 
      const tableRows = alldata
        .map(
          (row) => `
      <tr>
        <td>${row.invoiceID}</td>
        <td>${moment(row.createdAt)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD")}<br />${moment(row.createdAt)
            .tz("Asia/Kolkata")
            .format("hh:mm A")}</td>
        <td>${row.BranchName}</td>
        <td>${row.DepartmentName}</td>
        <td>${row.DoctorName}</td>
        <td>${row.createdBy}</td>
        <td>${row.items.map((item) => item.procedure).join(", ")}</td>
        <td>${row.amountToBePaid}</td>
        <td>${row.paymentMethod.paymentMethod}</td>
      </tr>
    `
        )
        .join("");

      printWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
            }
            #actioncolumn, #td {
              display: none !important;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid black;
              text-align: left;
              padding: 8px;
            }
            #gst{
              border: 1px solid black;             
            }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Created Date</th>
                <th>Branch</th>
                <th>Department</th>
                <th>Doctor</th>
                <th>Created By</th>
                <th>Item</th>
                <th>Amount Paid</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `);

      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 100);
    } catch (err) {
      console.error(err);
    }
  };

  //download invoice as pdf
  const downloadpatientinvoicePDF = () => {
    const doc = new jsPDF();
    doc.text("Patient Invoice Report", 14, 10);
    doc.autoTable({
      head: [
        [
          "ID",
          "Created Date",
          "Branch",
          "Department",
          "Doctor",
          "Created By",
          "Item",
          "Amount Paid",
          "Payment Method",
        ],
      ],
      body: alldata.map((row) => [
        row.invoiceID,
        `${moment(row.createdAt)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD")} ${moment(row.createdAt)
          .tz("Asia/Kolkata")
          .format("hh:mm A")}`,
        row.BranchName,
        row.DepartmentName,
        row.DoctorName,
        row.createdBy,
        row.items.map((item) => item.procedure).join(", "),
        row.amountToBePaid,
        row.paymentMethod.paymentMethod,
      ]),
    });
    doc.save("patient-invoice-report.pdf");
  };

  //download patient invoice as excel
  const downloadpatientinvoiceExcel = () => {
    const ws_data = [
      [
        "ID",
        "Created Date",
        "Branch",
        "Department",
        "Doctor",
        "Created By",
        "Item",
        "Amount Paid",
        "Payment Method",
      ],
      ...alldata.map((row) => [
        row.invoiceID,
        `${moment(row.createdAt)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD")} ${moment(row.createdAt)
          .tz("Asia/Kolkata")
          .format("hh:mm A")}`,
        row.BranchName,
        row.DepartmentName,
        row.DoctorName,
        row.createdBy,
        row.items.map((item) => item.procedure).join(", "),
        row.amountToBePaid,
        row.paymentMethod.paymentMethod,
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    XLSX.utils.book_append_sheet(wb, ws, "Patient Invoice Report");
    XLSX.writeFile(wb, "patient-invoice-report.xlsx");
  };

  const invoicemodelprint = () => {
    const printWindow = window.open(" ", "_blank");
    document.getElementById("PrintButton").hidden = true;

    const invoice = document.querySelector("#invoicemodelid").outerHTML; // Adjust the selector to target your specific table
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
    }, 100);
    document.getElementById("PrintButton").hidden = false;
  };

  return (
    <div className="w-auto relative">
      <div className="flex gap-3 items-center justify-end my-7">
        <button
          onClick={printTable}
          className="flex justify-end items-center gap-2 px-3 py-1 no-print border border-[#387ADF] rounded uppercase font-semibold text-sm"
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width={30}
          >
            <g id="Layer_2" data-name="Layer 2">
              <g id="Layer_1-2" data-name="Layer 1">
                <circle cx="12.036" cy="12.015" fill="#1b75bc" r="11" />
                <path
                  d="m13.4795 4.9839-7 1a.5.5 0 0 0 -.4295.4951v11a.5.5 0 0 0 .4292.4951l7 1a.5.5 0 0 0 .5708-.4951v-13a.5.5 0 0 0 -.5705-.4951z"
                  fill="#fff"
                />
                <path
                  d="m15.8 5.979h-.5v12h.5a1.0013 1.0013 0 0 0 1-1v-10a1.0013 1.0013 0 0 0 -1-1z"
                  fill="#fff"
                />
                <path d="m0 0h24v24h-24z" fill="none" />
              </g>
            </g>
          </svg>
          print
        </button>
        <button
          onClick={downloadpatientinvoicePDF}
          className="flex items-center gap-2 px-3 py-1 rounded no-print border border-[#387ADF] uppercase font-semibold text-sm"
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width={30}
          >
            <g id="Layer_2" data-name="Layer 2">
              <g id="Layer_1-2" data-name="Layer 1">
                <circle cx="12.024" cy="12.016" fill="#a6adb5" r="11" />
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
          Download as PDF
        </button>
        <button
          onClick={downloadpatientinvoiceExcel}
          className="flex items-center gap-2 px-3 py-1 rounded no-print border border-[#387ADF] uppercase font-semibold text-sm"
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width={30}
          >
            <g id="Layer_2" data-name="Layer 2">
              <g id="Layer_1-2" data-name="Layer 1">
                <circle cx="11.995" cy="12.014" fill="#8dc63f" r="11" />
                <g fill="#fff">
                  <path d="m16.9956 11.0142h-5.5127a1 1 0 0 0 0 2h5.5127a1 1 0 0 0 0-2z" />
                  <path d="m11.4829 9.0142h5.5127a1 1 0 0 0 0-2h-5.5127a1 1 0 0 0 0 2z" />
                  <path d="m16.9956 15.0146h-5.5127a1 1 0 0 0 0 2h5.5127a1 1 0 1 0 0-2z" />
                  <path d="m7.5825 10.7642h-.1a1.2084 1.2084 0 0 0 -1.2 1.25 1.2934 1.2934 0 0 0 1.3 1.25 1.25 1.25 0 1 0 0-2.5z" />
                  <path d="m7.5825 6.7642h-.1a1.2084 1.2084 0 0 0 -1.2 1.25 1.2934 1.2934 0 0 0 1.3 1.25 1.25 1.25 0 0 0 0-2.5z" />
                  <path d="m7.5825 14.7646h-.1a1.2084 1.2084 0 0 0 -1.2 1.25 1.2934 1.2934 0 0 0 1.3 1.25 1.25 1.25 0 0 0 0-2.5z" />
                </g>
                <path d="m0 0h24v24h-24z" fill="none" />
              </g>
            </g>
          </svg>
          Download as EXCEL
        </button>
      </div>
      {setFilterOpen && (
        <button
          onClick={() => setFilterOpen(!openFilter)}
          className={`${
            !openFilter
              ? "bg-[#387ADF] px-4 py-2 rounded-md text-white text-sm uppercase absolute left-0 top-1 "
              : "hidden"
          }  `}
        >
          open filter
        </button>
      )}

      <div className=" overflow-x-auto" id="printInvoiceReport">
        <div className="flex justify-evenly space-x-4 mb-10">
          {summaries?.map((summ) => {
            return (
              <div
                key={summ._id}
                className={`bg-slate-100 border flex flex-col px-5 py-5 justify-center rounded w-full`}
                id="gst"
              >
                <span className="text-sm text-left text-[#387ADF] uppercase font-bold">
                  GST-
                  <span className="text-gray-700">
                    {" "}
                    {summ._id === null ? "N/a" : summ._id + "%"}
                  </span>
                </span>
                <span className=" text-sm text-left text-[#387ADF] uppercase font-bold">
                  Procedure -{" "}
                  <span className="text-gray-700">{summ.totalCount}</span>{" "}
                </span>
                <span className="text-sm text-left text-[#387ADF] uppercase font-bold">
                  BaseAmount -{" "}
                  <span className="text-gray-700">
                    {summ.totalBaseAmount.toFixed(2)}
                  </span>
                </span>
                <span className="text-sm text-left text-[#387ADF] border-b-2 mb-2 uppercase font-bold">
                  GST Amount -{" "}
                  <span className="text-gray-700">
                    {summ.totalGstAmount.toFixed(2)}
                  </span>
                </span>
                <span className="text-sm text-left text-[#387ADF] uppercase font-bold">
                  Total Amount -{" "}
                  <span className="text-gray-700">
                    {summ.totalAmountToBePaid}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
        <table className="border-collapse text-left bg-white min-w-full border-8">
          <thead>
            <tr className="text-sm leading-normal text-gray-600">
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                ID
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                created Date
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                Branch
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                Department
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                Doctor
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                created
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                item
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                Amount Paid
              </th>
              <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
                payment Method
              </th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="text-center font-bold text-red-600 py-4"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row) => {
                return (
                  <tr
                    key={row.invoiceID}
                    className="border-b border-gray-200 even:bg-slate-100 odd:bg-white"
                    onClick={() => handleRowClick(row)}
                  >
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.invoiceID}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {moment(row.createdAt)
                        .tz("Asia/Kolkata")
                        .format("YYYY-MM-DD")}{" "}
                      <br />
                      {moment(row.createdAt)
                        .tz("Asia/Kolkata")
                        .format("hh:mm A")}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.BranchName}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.DepartmentName}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.DoctorName}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.createdBy}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.items.map((item) => {
                        return (
                          <div
                            key={item._id}
                            className="px-6 py-1 border-gray-200 capitalize text-center"
                          >
                            <span>
                              {item.procedure} <br />
                            </span>
                          </div>
                        );
                      })}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.amountToBePaid}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                      {row.paymentMethod.paymentMethod}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Consolidate count */}

        {data.length == 0 ? (
          <div></div>
        ) : (
          <div className="w-full bg-slate-500 py-2 rounded-b uppercase">
            <div className="flex text-white justify-evenly">
              <div className="text-right font-bold text-sm lg:text-base flex text-blue-300">
                Count&nbsp;-&nbsp;
                <span className="text-white">{globelSum?.total}</span>
              </div>
              <div className="text-right font-bold text-sm lg:text-base text-blue-300">
                Total Amount&nbsp;-&nbsp;
                <span className="text-white">{globelSum?.totalAmountSum}</span>
              </div>
              <div className="text-right font-bold text-sm lg:text-base text-blue-300">
                Total Discount&nbsp;-&nbsp;
                <span className="text-white">
                  {globelSum?.totalDiscountSum}
                </span>
              </div>
              <div className="text-right font-bold text-sm lg:text-base text-blue-300">
                Total Amount To Be Paid&nbsp;-&nbsp;
                <span className="text-white">
                  {globelSum?.totalAmountToBePaidSum}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for detailed view */}
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
              <div className="p-5 bg-white">
                {/* Header with Logo and Company Address */}
                <div className="flex justify-between items-center border-b pb-4">
                  <img src={Logo} alt="Company Logo" className="h-20" />
                  <div className="text-xs text-right uppercase">
                    <p className="font-bold text-lg ">
                      Topmost Dental and skin clinic
                      {/* Topmost 
                      {branchDetails[selectedRow?.BranchID].branchName} */}
                    </p>
                    <span>
                      {branchDetails[selectedRow?.BranchID].address},{" "}
                    </span>
                    <span>{branchDetails[selectedRow?.BranchID].city}, </span>
                    <span>{branchDetails[selectedRow?.BranchID].state}, </span>
                    <br />
                    <span>
                      Pin:{branchDetails[selectedRow?.BranchID].pincode},{" "}
                    </span>
                    <span>
                      Phone:{branchDetails[selectedRow?.BranchID].phone},{" "}
                    </span>
                    <span className="lowercase">
                      {branchDetails[selectedRow?.BranchID].email}
                    </span>
                  </div>
                </div>

                {/* Patient Details and Invoice Info */}
                <div className="flex justify-between border-b py-2">
                  <div className="text-xs">
                    <p>
                      <strong>Patient Details:</strong>
                    </p>
                    <p>{selectedRow?.patientInfo?.Name}</p>
                    <p>
                      {selectedRow?.patientInfo?.Gender +
                        ", Age:" +
                        selectedRow?.patientInfo?.age}
                    </p>
                    <p>{selectedRow?.patientInfo?.address?.address}</p>
                  </div>
                  <div className="text-xs text-left ">
                    <p>
                      <strong>Invoice ID:</strong> {selectedRow?.invoiceID}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {moment(selectedRow.createdAt)
                        .tz("Asia/Kolkata")
                        .format("YYYY-MM-DD")}
                    </p>
                    <p>
                      <strong>Doctor:</strong> {selectedRow?.DoctorName}
                    </p>
                    <p>
                      <strong>Department:</strong> {selectedRow?.DepartmentName}
                    </p>
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
                            <span className=" flex-1 p-2">GST</span>
                            <span className=" flex-1 p-2">CGST</span>{" "}
                            <span className=" flex-1 p-2">SGST</span>{" "}
                          </div>
                        </th>
                        <th className="p-1 text-xs"> Taxable Value</th>
                        <th className="p-1 text-xs">GST</th>
                        <th className="p-1 text-xs">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRow.items.map((item, index) => (
                        <tr key={index + "i"} className="border-b">
                          <td className="p-1 text-xs">{index + 1}</td>
                          <td className="p-1 text-xs">{item?.procedure}</td>
                          <td className="p-1 text-xs">{item?.HSNCode}</td>
                          <td className="p-1 text-xs">{item?.quantity}</td>
                          <td className="p-1 text-xs">{item?.unitPrice}</td>
                          <td className="p-1 text-xs">
                            {item?.discount + " " + item?.discountType}
                          </td>
                          <td className="p-1 text-xs">
                            <div className="flex">
                              <span className="border-r p-2  flex-1">
                                {item?.GST}%
                              </span>{" "}
                              <span className="border-r p-2 flex-1">
                                {item?.GST / 2}%
                              </span>
                              <span className="flex-1 p-2">
                                {item?.GST / 2}%
                              </span>
                            </div>
                          </td>
                          <td className="p-1 text-xs">{item?.baseAmount}</td>
                          <td className="p-1 text-xs">{item?.gstAmount}</td>
                          <td className="p-1 text-xs ">
                            {item?.amountToBePaid}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer with Generated By, Total Amount, etc. */}
                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs">
                    <p>
                      <strong>Generated By:</strong> {selectedRow?.createdBy}
                    </p>
                    <p>
                      <strong>Printed On:</strong> {formatDate()}
                    </p>
                  </div>
                  <div className="text-xs text-right">
                    <p>
                      <strong>Total Amount:</strong> {selectedRow?.totalAmount}
                    </p>
                    <p>
                      <strong>Total Discount:</strong>{" "}
                      {selectedRow?.totalDiscount}
                    </p>
                    <p>
                      <strong>Amount to be Paid:</strong>{" "}
                      {selectedRow?.amountToBePaid}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    onClick={invoicemodelprint}
                    id="PrintButton"
                    className="print:hidden border bg-[#652D91] rounded-lg font-semibold w-[13%] py-1 text-white"
                  >
                    <FontAwesomeIcon icon={faPrint} /> Print
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
