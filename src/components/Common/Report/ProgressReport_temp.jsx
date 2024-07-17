/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Axios from "../../../config/axios";
import NewVisitor from "./NewVisitor";
import ReVisitor from "./ReVisitor";
import html2pdf from "html2pdf.js";

const ProgressReport = ({ setloader }) => {
  const [newVisitor, setNewVisitor] = useState([]);
  const [reVisitor, setReVisitor] = useState([]);
  const [date, setDate] = useState(null);
  const branch = localStorage.getItem("branch");
  const BranchID = branch?.split(",")[1];

  useEffect(() => {
    Axios.get(
      `/admin/consolidated-progress-reports/?BranchID=${BranchID}`
    ).then((resp) => {
      // console.log(resp?.data.date)
      setDate(resp?.data.date);
      function transformData(aggregatedResults, branches) {
        const branchMap = new Map(
          branches.map((branch) => [branch?._id, branch?.branchName])
        );
        const structureMap = new Map();
        aggregatedResults.forEach((result) => {
          const {
            _id: { BranchID, MainDepartmentID },
            newVisitors,
            departmentName,
            mainDepartmentName,
          } = result;
          const branchName = branchMap?.get(BranchID);
          if (!structureMap.has(BranchID)) {
            structureMap.set(BranchID, {
              branchName,
              New_visitors: 0,
              mainDepartments: new Map(),
            });
          }

          const branch = structureMap.get(BranchID);
          branch.New_visitors += newVisitors; // Accumulate new visitors at the branch level

          if (!branch.mainDepartments.has(MainDepartmentID)) {
            branch.mainDepartments.set(MainDepartmentID, {
              mainDepartmentName,
              New_visitors: 0,
              departments: [],
            });
          }
          const mainDepartment = branch.mainDepartments.get(MainDepartmentID);
          mainDepartment.New_visitors += newVisitors; // Accumulate new visitors at the main department level
          mainDepartment.departments.push({
            departmentName,
            New_visitors: newVisitors,
          });
        });

        // Convert the Map to the desired array structure
        const structuredData = Array.from(structureMap.values()).map(
          (branch) => ({
            branchName: branch.branchName,
            New_visitors: branch.New_visitors,
            mainDepartments: Array.from(branch.mainDepartments.values()).map(
              (md) => ({
                mainDepartmentName: md.mainDepartmentName,
                New_visitors: md.New_visitors,
                departments: md.departments,
              })
            ),
          })
        );

        return structuredData;
      }

      const NewToday = transformData(
        resp.data.results.today,
        resp.data.branches
      );
      const NewThisMonth = transformData(
        resp.data.results.thisMonth,
        resp.data.branches
      );

      const NewResult = {
        Today: NewToday,
        thisMonth: NewThisMonth,
      };

      // setNewVisitor(NewResult);
      //=========================================================================================================

      const branchesMap = new Map(
        resp.data.branches.map((branch) => [
          String(branch._id),
          branch.branchName,
        ])
      );

      const mainDepartmentsMap = new Map(
        resp.data.MainDepartments.flatMap((mainDepartment) =>
          mainDepartment.departments.map((departmentId) => [
            String(departmentId),
            {
              mainDepartmentId: String(mainDepartment._id),
              mainDepartmentName: String(mainDepartment.Name),
              BranchID: String(mainDepartment.BranchID), // Convert to string if necessary
            },
          ])
        )
      );

      function transformVisitResults(
        visitResults,
        branchesMap,
        mainDepartmentsMap
      ) {
        const branchData = {};

        visitResults.forEach((result) => {
          const branchName = branchesMap.get(String(result.BranchID));

          const { mainDepartmentName } =
            mainDepartmentsMap.get(String(result.department)) || {};
          const departmentData = {
            departmentName: result.department,
            visitors: result.uniquePatients,
          };

          if (!branchData[branchName]) {
            branchData[branchName] = { visitors: 0, mainDepartments: {} };
          }

          const branch = branchData[branchName];
          branch.visitors += result.uniquePatients;

          if (!branch.mainDepartments[mainDepartmentName]) {
            branch.mainDepartments[mainDepartmentName] = {
              visitors: 0,
              departments: [],
            };
          }

          const mainDepartment = branch.mainDepartments[mainDepartmentName];
          mainDepartment.visitors += result.uniquePatients;

          const existingDepartmentIndex = mainDepartment.departments.findIndex(
            (dept) => dept.departmentName === departmentData.departmentName
          );
          if (existingDepartmentIndex > -1) {
            mainDepartment.departments[existingDepartmentIndex].visitors +=
              departmentData.visitors;
          } else {
            mainDepartment.departments.push(departmentData);
          }
        });

        return Object.entries(branchData).map(([branchName, data]) => ({
          branchName,
          visitors: data.visitors,
          mainDepartments: Object.entries(data.mainDepartments).map(
            ([mainDepartmentName, mdData]) => ({
              mainDepartmentName,
              visitors: mdData.visitors,
              departments: mdData.departments,
            })
          ),
        }));
      }

      const visitResults = {
        today: transformVisitResults(
          resp.data.vistorResults.today,
          branchesMap,
          mainDepartmentsMap
        ),
        thisMonth: transformVisitResults(
          resp.data.vistorResults.thisMonth,
          branchesMap,
          mainDepartmentsMap
        ),
      };

      setReVisitor(visitResults);
      setloader(false);
    });
  }, [BranchID]);
  //print new table function
  const printTable = () => {
    const printWindow = window.open("", "_blank");
    const tableHtml = document.getElementById("newReportPrint").innerHTML;
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
  const downloadnewPDF = () => {
    const element = document.getElementById("newReportPrint");
    const noPrintElements = document.querySelectorAll(".no-print");
    noPrintElements.forEach((el) => (el.style.display = "none")); // Hide "no-print" elements
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
      margin: 0,
      filename: "new_report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf()
      .from(tableHtml)
      .set(opt)
      .save(`new_report.pdf`)
      .then(() => {
        noPrintElements.forEach((el) => (el.style.display = "")); // Show "no-print" elements again
      });
  };
  //print visit table function
  const printVisitTable = () => {
    const printWindow = window.open("", "_blank");
    const tableHtml = document.getElementById("visitReportPrint").innerHTML;
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
  const downloadvisitPDF = () => {
    const element = document.getElementById("visitReportPrint");
    const noPrintElements = document.querySelectorAll(".no-print");
    noPrintElements.forEach((el) => (el.style.display = "none")); // Hide "no-print" elements

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
      margin: 0,
      filename: "visit_report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf()
      .from(tableHtml)
      .set(opt)
      .save(`visit_report.pdf`)
      .then(() => {
        noPrintElements.forEach((el) => (el.style.display = "")); // Show "no-print" elements again
      });
  };

  return (
    <div className="flex gap-2 justify-around flex-wrap w-auto">
      <div className="w-full lg:w-[45%] " id="newReportPrint">
        <div className="flex justify-between gap-7 items-center my-3">
          <h2 className="text-center font-bold text-xl p-2 uppercase">
            New patients
          </h2>
          <div className="flex gap-2">
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
              Print
            </button>
            <button
              onClick={downloadnewPDF}
              className="flex justify-end items-center gap-2 px-3 py-1 no-print border border-[#387ADF] rounded uppercase font-semibold text-sm"
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
        </div>
        <NewVisitor data={newVisitor.Today} Head={"Today"} />
        <NewVisitor
          data={newVisitor.thisMonth}
          Head={"Month "}
          date={date && `[${date?.lastMonthStart} - ${date.todayStartData}]`}
        />
      </div>

      <div className="w-full lg:w-[45%]" id="visitReportPrint">
        <div className="flex justify-between gap-7 items-center my-3">
          <h2 className="text-center font-bold text-xl p-2 uppercase">
            Visited patients
          </h2>
          <div className="flex gap-2">
            <button
              onClick={printVisitTable}
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
              Print
            </button>
            <button
              onClick={downloadvisitPDF}
              className="flex justify-end items-center gap-2 px-3 py-1 no-print border border-[#387ADF] rounded uppercase font-semibold text-sm"
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
        </div>
        <ReVisitor data={reVisitor.today} Head={"Today"} />
        <ReVisitor
          data={reVisitor.thisMonth}
          Head={"Month "}
          date={date && `[${date?.lastMonthStart} - ${date.todayStartData}]`}
        />
      </div>
    </div>
  );
};

export default ProgressReport;
