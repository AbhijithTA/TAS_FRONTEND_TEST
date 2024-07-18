/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import moment from "moment-timezone";
import Swal from "sweetalert2";
import History from "./History";
import Axios from "../../../Config/axios";
import { formatDate } from "../../../Utils/Datefn";
import Logo from "../../../assets/Logo/Invoicelogo.png";
import Invoive_Edit_Modal from "../../Utils/Patient_Invoice_Editmodal";
import ProgressBar from "../../Utils/ProgressBar/ProgressBar";
import { v4 as uuidv4 } from "uuid";

import html2pdf from "html2pdf.js"; 
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../../Config/aws';

const InvoiceTable = ({ data, fetchData, loader }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [branchDetails, setBranchDetails] = useState({});
  const [invoice, setInvoice] = useState(null);
  const [invoice_data, setInvoice_data] = useState(null);

  const [customPhoneNumber, setCustomPhoneNumber] = useState("");
  const [isCustomNumber, setIsCustomNumber] = useState(false);
  const [uploadLocation, setUploadLocation] = useState(null);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);

  const patientNumber = selectedRow?.patientID?.phone;

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

  const handleEditClick = (invoice) => {
    setInvoice(invoice);
    setShowEditModal(true);
  };

  const History_click = (data) => {
    setInvoice_data(data);
    setShowHistoryModal(true);
  };

  const handleDeleteClick = async (invoice) => {
    const invoiceCreatedAt = moment(invoice.createdAt);
    const now = moment();
    const hoursDiff = now.diff(invoiceCreatedAt, "hours");
    const daysDiff = now.diff(invoiceCreatedAt, "days");
    const jobRole = localStorage.getItem("jobRole");
    let canDelete = false;
    if (jobRole === "user" && hoursDiff <= 8) {
      canDelete = true;
    } else if (jobRole === "admin" && daysDiff <= 4) {
      canDelete = true;
    }

    if (canDelete) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Axios.delete(`/delete-invoice/${invoice._id}`)
            .then(() => {
              fetchData();
              Swal.fire("Deleted!", "The invoice has been deleted.", "success");
            })
            .catch((error) => {
              console.error("Failed to delete invoice:", error);
              Swal.fire("Failed!", "Failed to delete the invoice.", "error");
            });
        }
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "You are not allowed to delete this invoice.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const invoicemodelprint = () => {
    const printWindow = window.open(" ", "_blank");
    const printButton = document.getElementById("PrintButton");
    const patientButton = document.getElementById("PatientButton");
    const customButton = document.getElementById("CustomButton");
    const downloadButton = document.getElementById("DownloadButton");

    printButton.style.display = "none";
    patientButton.style.display = "none";
    customButton.style.display = "none";
    downloadButton.style.display = "none";

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
      patientButton.style.display = "inline-block";
      customButton.style.display = "inline-block";
      downloadButton.style.display = "inline-block";
    }, 100);
  };


  useEffect(() => {
    if (showModal) {
      generatePDFBlob();
    }
  }, [showModal]);

  const generatePDFBlob = async () => {
    const element = document.querySelector("#invoice");
    if (!element) {
      console.error("Element with ID 'invoice' not found.");
      return;
    }
    const opt = {
      margin: 0,
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    return await html2pdf().from(element).set(opt).outputPdf("blob");
  };

  const uploadToS3 = async (pdfBlob, key) => {
    const params = {
      Bucket: "tas-invoice",
      Key: key,
      Body: pdfBlob,
      ContentType: "application/pdf",
    };
    try {
      const command = new PutObjectCommand(params);
      const data = await s3Client.send(command);
      const fileUrl = `https://${params.Bucket}.s3.${import.meta.env.VITE_S3_REGION}.amazonaws.com/${params.Key}`; 
      return fileUrl;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  };

  const sendWhatsapp = (uploadLocation, phoneNumber) => {
    const message = `Here is Your invoice : ${uploadLocation}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/91${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  const handleSendWhatsapp = async (phoneNumber) => {
    try {
      const printButtons = document.querySelectorAll(
        "#PrintButton, #CustomButton, #PatientButton, #DownloadButton"
      );
      printButtons.forEach((button) => button.classList.add("hidden"));

      const pdfBlob = await generatePDFBlob();
      
      const patientName = selectedRow?.patientID?.Name;
      const firstName = patientName.split(' ')[0].replace(/\s+/g, '');
      const key = `${uuidv4()}_${firstName}.pdf`; 

      setShowModal(false);
      const toastContainer = document.createElement("div");

      toastContainer.innerHTML = `
      <div class="toast-container fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white p-6 rounded-lg shadow-2xl border-gray-500 z-50 text-center">
        <div class="text-2xl font-bold mb-4 text-gray-800">Send Invoice</div>
        <div class="text-lg font-semibold mb-4 text-gray-600">Do you want to send the invoice to the patient's WhatsApp?</div>
        <div class="flex justify-center gap-4">
          <button id="sendInvoiceBtn" class="toast-button bg-green-500 text-white rounded px-6 py-2 font-medium transition duration-300 ease-in-out hover:bg-green-600 shadow-md">Send</button>
          <button id="closeToastBtn" class="toast-button bg-red-500 text-white rounded px-6 py-2 font-medium transition duration-300 ease-in-out hover:bg-red-600 shadow-md">Close</button>
        </div>
      </div>
    `;

      // Insert the style tag separately
      const style = document.createElement("style");
      style.innerHTML = `
      .toast-container {
        animation: slide-in 0.5s ease-out;
      }
      @keyframes slide-in {
        from {
          transform: translate(-50%, -100%);
          opacity: 0;
        }
        to {
          transform: translate(-50%, -50%);
          opacity: 1;
        }
      }
    `;

      document.head.appendChild(style);
      document.body.appendChild(toastContainer);

      const sendInvoiceBtn = toastContainer.querySelector("#sendInvoiceBtn");
      const closeToastBtn = toastContainer.querySelector("#closeToastBtn");

      sendInvoiceBtn.addEventListener("click", async () => {
        const location = await uploadToS3(pdfBlob, key);
        setUploadLocation(location);
        sendWhatsapp(location, phoneNumber);
        document.body.removeChild(toastContainer);
      });

      closeToastBtn.addEventListener("click", () => {
        document.body.removeChild(toastContainer);
      });
    } catch (error) {
      console.error("Error in handleSendWhatsapp function:", error);
    }
  };

  const handleCustomSendWhatsapp = async () => {
    try {
      const printButtons = document.querySelectorAll(
        "#PrintButton, #CustomButton, #CloseButton, #PatientButton, #DownloadButton"
      );
      printButtons.forEach((button) => button.classList.add("hidden"));

      const pdfBlob = await generatePDFBlob();
      const patientName = selectedRow?.patientID?.Name;
      const firstName = patientName.split(' ')[0].replace(/\s+/g, '');
      const key = `${uuidv4()}_${firstName}.pdf`; 

      const showCustomWhatsAppForm = () => {
        setShowModal(false);
        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
          <div class="toast-container fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30rem] bg-white p-6 rounded-lg shadow-2xl border-gray-500 z-50">
              <button id="closeFormBtn" class="absolute top-0 right-0 mr-4 mt-2 text-2xl font-bold text-gray-500 hover:text-gray-700 cursor-pointer">&times;</button>
              <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">Send WhatsApp Message</h2>
              <label for="whatsappNumber" class="block text-gray-700 text-sm font-semibold mb-2">Enter Custom WhatsApp number:</label>
              <input type="text" id="whatsappNumber" name="whatsappNumber" class="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter WhatsApp number">
              <button id="sendWhatsAppBtn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Send WhatsApp Message</button>
          </div>
      `;
        // Insert the style tag separately
        const style = document.createElement("style");
        style.innerHTML = `
        .toast-container {
          animation: slide-in 0.5s ease-out;
        }
        @keyframes slide-in {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        }
      `;

        const sendWhatsAppBtn = formContainer.querySelector("#sendWhatsAppBtn");
        const closeFormBtn = formContainer.querySelector("#closeFormBtn");

        sendWhatsAppBtn.addEventListener("click", async () => {
          const phoneNumber =
            formContainer.querySelector("#whatsappNumber").value;
          if (phoneNumber) {
            await sendWhatsAppMessage(phoneNumber, pdfBlob, key);

            document.body.removeChild(formContainer);
            printButtons.forEach((button) => button.classList.remove("hidden"));
          }
        });

        closeFormBtn.addEventListener("click", () => {
          document.body.removeChild(formContainer);
          printButtons.forEach((button) => button.classList.remove("hidden"));
        });

        document.body.appendChild(formContainer);
      };

      showCustomWhatsAppForm();
    } catch (error) {
      console.error("Error in handleSendWhatsapp function:", error);
    }
  };

  const sendWhatsAppMessage = async (phoneNumber, pdfBlob, key) => {
    try {
      const location = await uploadToS3(pdfBlob, key);
      setUploadLocation(location);
      const message = `Here is Your invoice : ${location}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappURL, "_blank");
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
    }
  };

  const invoiceDownload = async () => {
    const printButtons = document.querySelectorAll(
      "#PrintButton, #CustomButton, #CloseButton, #PatientButton, #DownloadButton"
    );

    printButtons.forEach((button) => {
      button.classList.add("hidden");
    });

    const element = document.querySelector("#invoice");

    const opt = {
      margin: 0,
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().from(element).set(opt).save();
    printButtons.forEach((button) => {
      button.classList.remove("hidden");
    });
    setShowModal(false);
  };

  return (
    <div className="overflow-x-auto mt-6 ">
      <table className="border-collapse text-left bg-white min-w-full border-8">
        <thead>
          <tr className="text-sm leading-normal text-gray-600">
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              ID
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Date
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Patient Name
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Procedure
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Doctor
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Total Discount
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Amount Paid
            </th>
            <th className="px-6 py-3 bg-gray-100 font-semibold uppercase border-b border-gray-200 text-xs text-center">
              Action
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
          ) : data.length === 0 ? (
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
                className="border-b border-gray-200 even:bg-slate-100 odd:bg-white   "
                onClick={() => handleRowClick(invoice)}
              >
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.invoiceID}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.createdAtIST}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.patientID?.Name}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.items?.map((item, i) => (
                    <span key={i}>
                      {item.procedure}
                      <br />
                    </span>
                  ))}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.doctorID?.name}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.totalDiscount}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 capitalize text-center">
                  {invoice?.amountToBePaid}
                </td>
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className={`px-6 py-3  border-gray-200 capitalize flex gap-3 justify-center items-center  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={20}
                    viewBox="0 0 24 24"
                    width={20}
                    fill="#387ADF"
                    onClick={() => {
                      handleEditClick(invoice);
                    }}
                    className="cursor-pointer hover:scale-125 duration-300"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>

                  <svg
                    onClick={() => {
                      index === 0
                        ? handleDeleteClick(invoice)
                        : Swal.fire({
                            title: "Error!",
                            text: "You are not allowed to delete this invoice.",
                            icon: "error",
                            confirmButtonText: "OK",
                          });
                    }}
                    className="cursor-pointer hover:scale-125 duration-300"
                    id="Layer_1"
                    enableBackground="new 0 0 512 512"
                    height="20"
                    viewBox="0 0 512 512"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    fill={` ${index === 0 ? "#387ADF" : "#FF0000"} `}
                  >
                    <path d="m320.99 435.003 20.021-273.71c.362-4.958 4.688-8.692 9.632-8.319 4.958.362 8.683 4.675 8.319 9.632l-20.021 273.71c-.346 4.734-4.294 8.344-8.966 8.344-.221 0-.442-.008-.666-.024-4.957-.364-8.682-4.676-8.319-9.633zm-155.463 1.312c.346 4.734 4.294 8.344 8.966 8.344.221 0 .443-.008.666-.024 4.958-.362 8.683-4.675 8.319-9.632l-20.021-273.71c-.362-4.957-4.693-8.688-9.632-8.319-4.958.362-8.683 4.675-8.319 9.632zm85.078 8.344c4.971 0 9-4.029 9-9v-275.883c0-4.971-4.029-9-9-9s-9 4.029-9 9v275.883c0 4.971 4.03 9 9 9zm222.237-331.5c-.945 4.924-5.755 8.065-10.536 7.142l-21.601-4.147-36.156 320.514c-2.292 20.321-10.735 39.03-23.773 52.68-13.954 14.607-32.602 22.652-52.511 22.652h-152.061c-19.909 0-38.558-8.045-52.511-22.652-13.038-13.65-21.481-32.358-23.773-52.68l-36.929-327.364c-.287-2.546.524-5.095 2.232-7.006 1.707-1.91 4.148-3.003 6.711-3.003h280.959l-306.593-58.862c-4.881-.938-8.078-5.654-7.142-10.536.937-4.881 5.651-8.076 10.536-7.142l143.697 27.588 4.626-24.094c1.624-8.46 6.466-15.795 13.634-20.653 7.168-4.859 15.777-6.637 24.234-5.016l65.072 12.493c8.46 1.624 15.795 6.466 20.654 13.634 4.858 7.167 6.64 15.773 5.016 24.233l-4.626 24.094 143.699 27.589c4.881.938 8.078 5.654 7.142 10.536zm-50.38 4.136h-340.455l35.8 317.355c3.941 34.944 27.955 59.35 58.397 59.35h152.061c30.442 0 54.456-24.405 58.397-59.35zm-211.393-63.558 93.255 17.904 4.626-24.094c.718-3.738-.077-7.553-2.237-10.74-2.161-3.188-5.41-5.338-9.148-6.056l-65.073-12.493c-3.736-.719-7.553.076-10.74 2.237-3.188 2.16-5.338 5.409-6.056 9.147z" />
                  </svg>
                  <span
                    className="rounded-full border px-2 text-blue-300 border-blue-300 lowercase cursor-pointer hover:scale-125 duration-300"
                    onClick={() => {
                      History_click(invoice);
                    }}
                  >
                    i
                  </span>
                </td>
                <td
                  className={`${
                    invoice.updatedBy && "border-r-8 border-red-200"
                  }`}
                ></td>
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
              <div className="p-5 bg-white" id="invoice">
                {/* Header with Logo and Company Address */}
                <div className="flex justify-between items-center border-b pb-4">
                  <img src={Logo} alt="Company Logo" className="h-20" />
                  <div className="text-xs text-right uppercase">
                    <p className="font-bold text-lg ">
                      Topmost Dental and skin clinic
                      {/* Topmost {branchDetails[selectedRow?.BranchID].branchName} */}
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
                    <p className="capitalize">{selectedRow?.patientID?.Name}</p>
                    <p>
                      {selectedRow?.patientID?.Gender +
                        ", Age:" +
                        selectedRow?.patientID?.age}
                    </p>
                    <p>{selectedRow?.patientID?.address?.address}</p>
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
                      <strong>Doctor:</strong> {selectedRow?.doctorID?.name}
                    </p>
                    <p>
                      <strong>Department:</strong>{" "}
                      {selectedRow?.DepartmentID?.Name}
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
                          <td className="p-1 text-xs">
                            {item?.ProcedureID?.HSNCode}
                          </td>
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
                <div className="flex justify-end mt-5 gap-2">
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
                  <button
                    onClick={() => handleSendWhatsapp(patientNumber)}
                    id="PatientButton"
                    className="print:hidden  border border-[#652D91] rounded-lg font-semibold py-1 px-3 text-[#652D91] flex justify-center text-sm items-center gap-2"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      width={30}
                    >
                      <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                          <circle
                            cx="12.023"
                            cy="12.01"
                            fill="#8dc63f"
                            r="11"
                          />
                          <path
                            d="m14.2769 17.9946a18.949 18.949 0 0 1 -.7627-3.1929.2511.2511 0 0 0 -.1509-.1938c-.4546-.1909-.9214-.3628-1.39-.5117a17.2573 17.2573 0 0 1 0-4.1567c.47-.15.937-.3223 1.39-.5122a.25.25 0 0 0 .15-.1938 19.2432 19.2432 0 0 1 .7725-3.2251c.0643-.2928-.0894-.546-.5146-.5879-.0566-.0034-1.3892-.0835-2.0566-.0933a1.1277 1.1277 0 0 0 -1.0576.7261 16.8784 16.8784 0 0 0 -.0049 11.915 1.1385 1.1385 0 0 0 1.0552.74h.0166c.6572-.01 1.7666-.0635 2.042-.0923a.4936.4936 0 0 0 .511-.6214z"
                            fill="#fff"
                          />
                          <path d="m0 0h24v24h-24z" fill="none" />
                        </g>
                      </g>
                    </svg>{" "}
                    Send to Paitent Whatsapp
                  </button>
                  <button
                    onClick={handleCustomSendWhatsapp}
                    id="CustomButton"
                    className="print:hidden border border-[#652D91] rounded-lg font-semibold py-1 px-3 text-[#652D91] flex justify-center text-sm items-center gap-2"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      width={30}
                    >
                      <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                          <circle cx="12.012" cy="12" fill="#8dc63f" r="11" />
                          <path
                            d="m13.9435 7h-3.863a4.5288 4.5288 0 0 0 -4.335 4.6912 4.5661 4.5661 0 0 0 3.6954 4.64v2.15a.5187.5187 0 0 0 .8921.3583l2.353-2.4572h1.2575a4.5289 4.5289 0 0 0 4.335-4.6913 4.5288 4.5288 0 0 0 -4.335-4.691zm-4.8317 6.0049a1.0438 1.0438 0 0 1 -1.05-1 .9587.9587 0 0 1 .95-1h.1a1 1 0 1 1 0 2zm3 0a1.0438 1.0438 0 0 1 -1.05-1 .9587.9587 0 0 1 .95-1h.1a1 1 0 0 1 0 2zm3 0a1.0438 1.0438 0 0 1 -1.05-1 .9587.9587 0 0 1 .95-1h.1a1 1 0 0 1 0 2z"
                            fill="#fff"
                          />
                          <path d="m0 0h24v24h-24z" fill="none" />
                        </g>
                      </g>
                    </svg>{" "}
                    Send to Custom whatsapp
                  </button>
                  <button
                    onClick={invoiceDownload}
                    id="DownloadButton"
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
                            cx="12.043"
                            cy="12.01"
                            fill="#1b75bc"
                            r="11"
                          />
                          <path
                            d="m18.5 7h-13a.5.5 0 0 0 -.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0 -.5-.5zm-11.3066 3h2.6694a.5.5 0 1 1 0 1h-2.6694a.5.5 0 0 1 0-1zm4.6694 5h-4.6694a.5.5 0 0 1 0-1h4.6694a.5.5 0 1 1 0 1zm0-2h-4.6694a.5.5 0 0 1 0-1h4.6694a.5.5 0 1 1 0 1zm6.1338-2.4985a.5.5 0 0 1 -.5.5h-1.3032a.5.5 0 0 1 -.5-.5v-1.9976a.5.5 0 0 1 .5-.5h1.3032a.5.5 0 0 1 .5.5z"
                            fill="#fff"
                          />
                          <path d="m0 0h24v24h-24z" fill="none" />
                        </g>
                      </g>
                    </svg>{" "}
                    Download Invoice
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <History
        showModal={showHistoryModal}
        setShowModal={setShowHistoryModal}
        Data={invoice_data}
      />
      <Invoive_Edit_Modal
        fetchData={fetchData}
        invoice={invoice}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
      />
    </div>
  );
};

export default InvoiceTable;
