/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import Modal from "react-modal";

import Axios from "../../../Config/axios";
import SumReportTable from "./SumReportTable";
import ProgressReport from "./ProgressReport";
import Loader from "../../Utils/ProgressBar/FullLoader";
import DateSelectionForm from "./dateChanger";
Modal.setAppElement("#root");

const ConsolidatedReport = () => {
  const [loader, setloader] = useState(true);
  const [data, setData] = useState("");
  const [date, setDate] = useState("");
  const [doctorData, setDoctorData] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [dateModal, setDateModal] = useState(false);
  const [filterDate, setFilterDate] = useState({ StartDate: "", EndDate: "" });
  const branch = localStorage.getItem("branch");
  const BranchID = branch?.split(",")[1];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (doctor) => { 
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const closeModal = () => { 
    setSelectedDoctor(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    Axios.get(
      `/admin/consolidated-reports/?BranchID=${BranchID}&StartDate=${filterDate.StartDate}&EndDate=${filterDate.EndDate}`
    ).then((resp) => {
      setData(resp?.data);
      setDate(resp?.data.date);
      const transformedDoctorsCollection = transformDoctorsByBranches(
        resp?.data.DoctorsColloction,
        resp?.data.branches
      );
      setDoctorData(transformedDoctorsCollection);
    });
  }, [BranchID, filterDate]);

  const transformDoctorsByBranches = (doctorsResult, branches) => {
    const doctorsGroupedByBranch = doctorsResult.reduce((acc, doctor) => {
      const { branchId } = doctor;
      if (!acc[branchId]) {
        acc[branchId] = [];
      }
      acc[branchId].push(doctor);
      return acc;
    }, {});

    // Then, for each branch, aggregate doctors' information
    const branchesWithDoctors = Object.entries(doctorsGroupedByBranch).map(
      ([branchId, doctors]) => {
        const branchName =
          branches.find((branch) => branch._id === branchId)?.branchName ||
          "Unknown Branch";
        const doctorsAggregated = doctors.reduce((acc, cur) => {
          const { doctorName, procedure, totalInvoiceSum, procedureCount } =
            cur;
          if (!acc[doctorName]) {
            acc[doctorName] = {
              doctorName,
              procedures: [],
              totalInvoiceSum: 0,
            };
          }
          acc[doctorName].procedures.push({ procedure, procedureCount });
          acc[doctorName].totalInvoiceSum += totalInvoiceSum;
          return acc;
        }, {});

        return {
          branchId,
          branchName,
          doctors: Object.values(doctorsAggregated),
        };
      }
    );

    return branchesWithDoctors;
  };

  const setupCustomDate = (date) => {
    setFilterDate(date);
  };
  //printconsolidation report
  const printTable = () => {
    const printWindow = window.open("", "_blank");
    const tableHtml = document.getElementById(
      "consolidationReportPrint"
    ).innerHTML;
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Table</title>
        <style>
        body {
          font-family: 'Arial', sans-serif;
        }
        .no-print {
          display: none !important;
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
        ${tableHtml}  
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 100);
  };
  //download consolidation report
  const downloadconsolidatedPDF = () => {
    const element = document.getElementById("consolidationReportDownload");

    // Add a style block to ensure the width is applied
    const tableHtml = `
      <style>
        body {
          font-family: 'Arial', sans-serif;
        }
        .no-print {
          display: none !important;
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
      </style>
     <table> ${element.innerHTML} </table>`;

    const opt = {
      margin: 0,
      filename: "consolidated_report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(tableHtml).set(opt).save("consolidated_report.pdf");
  };

  //printbranch report
  const printBranchTable = (branchId) => {
    const printWindow = window.open("", "_blank");
    const tableHtml = document.getElementById(`branch-${branchId}`).innerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Branch Table</title>
          <style>
          body {
            font-family: 'Arial', sans-serif;
          }
          .no-print {
            display: none !important;
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
          ${tableHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 100);
  };
  //download branch report
  const downloadbranchPDF = (branchId) => {
    const element = document.getElementById(`branch-${branchId}`);
    const noPrintElements = document.querySelectorAll(".no-print");
    noPrintElements.forEach((el) => (el.style.display = "none")); // Hide "no-print" elements
    const tableHtml = `
    <style>
      body {
        font-family: 'Arial', sans-serif;
      }
      .no-print {
        display: none !important;
      }
      #actioncolumn, #td {
        display: none !important;
      }
      table {
        border-collapse: collapse;
        width: 100%;  /* Adjust the width here */
        
      }
      th, td {
        border: 1px solid black;
        text-align: left;
        padding: 8px;
      }
    </style>
    ${element.innerHTML}`;
    const opt = {
      margin: 20,
      filename: `branch_${branchId}_report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .from(tableHtml)
      .set(opt)
      .save(`branch_${branchId}_report.pdf`)
      .then(() => {
        noPrintElements.forEach((el) => (el.style.display = "")); // Show "no-print" elements again
      });
  };

  return (
    <div className="px-10 py-5">
      {loader && <Loader />}

      <div className="w-auto">
        <div className="overflow-x-auto" id="consolidationReportPrint">
          <h2 className="text-center font-bold text-2xl uppercase">
            Consolidated Report
          </h2>
          <div className="flex items-center gap-3 justify-end mb-5">
            <button className="flex justify-end items-center gap-2 px-3 py-1 no-print border border-[#387ADF] rounded uppercase font-semibold text-sm" onClick={printTable}>
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
              onClick={downloadconsolidatedPDF}
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
          </div>
          <DateSelectionForm
            ModalOpen={dateModal}
            setModalOpen={setDateModal}
            Submit={setupCustomDate}
          />
          <table
            className="w-full text-left border-8 uppercase "
            id="consolidationReportDownload"
          >
            <thead>
              <tr>
                <th className="border px-2 py-1">Branch</th>
                <th className="border px-2 py-1">Branch Total</th>
                <th className="border px-2 py-1">Invoice Count</th>
                <th className="border px-2 py-1">Department</th>
                <th className="border px-2 py-1">Department Total</th>
                <th className="border px-2 py-1">Sub Department</th>
                <th className="border px-2 py-1">Sub Department total</th>
                <th className="border px-2 py-1">Invoice Count</th>
              </tr>
            </thead>

            <tbody>
              <tr className="bg-gray-300">
                <th colSpan={10} className="text-center py-2">
                  Today -{" "}
                  <span className="text-blue-800">{date.todayStartData}</span>
                </th>
              </tr>
              {data.today?.length ? (
                <SumReportTable data={data?.today} />
              ) : (
                <tr>
                  <th className="text-red-400 text-center" colSpan={10}>
                    No data Available
                  </th>
                </tr>
              )}

              <tr className="bg-gray-300 ">
                <th colSpan={10} className="py-2 w-full">
                  <span className="flex justify-center items-center gap-1">
                    Month -
                    <span className="text-blue-800 flexitems-center gap-2">
                      {date &&
                        `${date.lastMonthStart}  -  ${date.lastMonthEnd}`}
                    </span>
                  </span>
                </th>
              </tr>
              <SumReportTable data={data?.asOfLastMonth} />
            </tbody>
          </table>

          <div className=" w-full flex justify-end items-center hover:cursor-pointer mt-5">
            <div className="w-fit">
              <button
                title="Custom Date"
                className="flex items-center gap-2 px-3 py-1 rounded no-print border border-[#387ADF] uppercase font-semibold text-sm"
                onClick={() => {
                  setDateModal(true);
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width={30}
                >
                  <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">
                      <circle cx="12.023" cy="12.008" fill="#faa61a" r="11" />
                      <g fill="#fff">
                        <path d="m18.2 8.1173-1.7676-1.7673a.3394.3394 0 0 0 -.4879.0071l-.4313.4313 2.2557 2.2557.4311-.4317a.3418.3418 0 0 0 0-.4951z" />
                        <path d="m7.9189 14.3682a.5794.5794 0 0 0 -.0778.12l-1.195 2.9628a.3487.3487 0 0 0 .0778.3748.3314.3314 0 0 0 .3748.0778c2.2652-.9078 1.6091-.6429 2.9628-1.195a.3188.3188 0 0 0 .12-.0778l6.88-6.88-2.2554-2.2557z" />
                        <path d="m14.5986 16.9561h-2.4526a.5.5 0 0 0 0 1h2.4526a.5.5 0 1 0 0-1z" />
                      </g>
                      <path d="m0 0h24v24h-24z" fill="none" />
                    </g>
                  </g>
                </svg>
                generate custom report
              </button>
            </div>
          </div>
        </div>

        <hr className="my-10" />

        <div>
          <h1 className="text-center font-bold text-2xl uppercase mb-5 text-blue-500">
            Visitor update report
          </h1>
          <ProgressReport setloader={setloader} />
        </div>

        <hr className="my-10" />

        <div className="w-full ">
          <h1 className="text-center font-bold text-2xl uppercase mb-10 text-blue-500">
            Doctor collection report{" "}
            <span className="text-lg text-black">
              ({date.lastMonthStart + " - " + date.lastMonthEnd})
            </span>
          </h1>
          <div className="w-full flex flex-wrap gap-10 justify-center">
            {doctorData.map((group) => (
              <div
                key={group.branchName}
                className="w-full md:w-[45%]"
                id={`branch-${group.branchId}`}
              >
                <div className="flex justify-between items-center space-x-3">
                  <h2 className="text-center font-bold text-xl uppercase">
                    {group.branchName}{" "}
                  </h2>

                  <div className="flex mb-5 mt-2 justify-center gap-3">
                    <button
                      onClick={() => printBranchTable(group.branchId)}
                      className="flex justify-end items-center gap-2 px-3 py-1 no-print border border-[#387ADF] rounded uppercase font-semibold text-sm"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        width={30}
                      >
                        <g id="Layer_2" data-name="Layer 2">
                          <g id="Layer_1-2" data-name="Layer 1">
                            <circle
                              cx="12.036"
                              cy="12.015"
                              fill="#1b75bc"
                              r="11"
                            />
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
                      Print
                    </button>
                    <button
                      onClick={() => downloadbranchPDF(group.branchId)}
                      className="flex justify-end items-center gap-2 px-3 py-1 no-print border border-[#387ADF] rounded uppercase font-semibold text-sm"
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
                      Download as PDF
                    </button>
                  </div>
                </div>
                <div className="max-w-full">
                  <div className="max-h-[500px] h-[500px] overflow-y-auto border-8">
                    <table className="text-sm text-left text-gray-500 w-full ">
                      <thead className="text-xs text-gray-700 bg-gray-200 text-center uppercase ">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Collection
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.doctors.map((doctor, i) => (
                          <tr
                            key={i}
                            className="odd:bg-white border text-center hover:bg-slate-200"
                            onClick={() => openModal(doctor)}
                          >
                            <td className="px-6 py-4">{doctor.doctorName}</td>
                            <td className="px-6 py-4">{`Rs ${doctor.totalInvoiceSum}/-`}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            style={{
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: "500px",
              },
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            {!!selectedDoctor && (
              <div className="w-full flex justify-around">
                <div className="w-full">
                  <h2 className="text-center font-bold text-2xl uppercase">
                    Detailed Report
                  </h2>
                  <div className="w-full border-2 border-black mt-5">
                    <div className="py-3 border-b-2 border-black">
                      <div className="flex flex-col mt-2">
                        <span className="text-lg text-center">
                          {selectedDoctor?.doctorName}
                        </span>
                        <span className="text-lg text-center">
                          Rs- {selectedDoctor?.totalInvoiceSum}/-{" "}
                          <span className="text-xs capitalize">
                            (Total Collection)
                          </span>
                        </span>
                      </div>
                    </div>
                    <table className="text-sm text-gray-500 w-full">
                      <thead className="text-xs text-gray-700 uppercase">
                        <tr className="border">
                          <th className="py-4">Procedure</th>
                          <th className="py-4">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDoctor?.procedures?.map((Procedure, i) => (
                          <tr
                            key={i}
                            className="odd:bg-white even:bg-gray-200 text-center"
                          >
                            <td className="py-4">
                              <span className="flex flex-col">
                                {Procedure.procedure}
                              </span>
                            </td>
                            <td className="py-4">{`  ${Procedure?.procedureCount} `}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedReport;
