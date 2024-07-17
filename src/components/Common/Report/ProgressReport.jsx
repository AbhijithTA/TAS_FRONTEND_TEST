/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Axios from "../../../Config/axios";
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
      function transformData(visits, mainDepartments) { 
        const mainDeptMap = new Map(mainDepartments.map(md => [md._id, { name: md.Name, branchID: md.BranchID }])); 
        const aggregateVisits = (accumulator, current) => { 
          const existingDept = accumulator.find(dept => dept.id === current.department.id);
          if (existingDept) {
            existingDept.count += current.count;
          } else {
            accumulator.push({
              subdepartment: current.department.name,
              id: current.department.id,
              count: current.count
            });
          }
          return accumulator;
        }; 
        const result = visits.reduce((branches, visit) => { 
          let branch = branches.find(br => br.Branch === visit.branch.name);
          if (!branch) {
            branch = {
              Branch: visit.branch.name,
              id: visit.branch.id,
              count: 0,
              MainDepartments: []
            };
            branches.push(branch);
          }
          branch.count += visit.count; 
          const mainDeptInfo = mainDeptMap.get(visit.department.mainDepartment) || { name: "Unknown" };
          let mainDept = branch.MainDepartments.find(md => md.id === visit.department.mainDepartment);
          if (!mainDept) {
            mainDept = {
              mainDepartment: mainDeptInfo.name,
              id: visit.department.mainDepartment,
              count: 0,
              subDepartments: []
            };
            branch.MainDepartments.push(mainDept);
          } 
          mainDept.subDepartments = aggregateVisits(mainDept.subDepartments, visit);
          mainDept.count += visit.count;
      
          return branches;
        }, []);      
        return result;
      } 

      const VisitToday = transformData(resp.data.Visit.today,resp.data.MainDepartments); 
      const VisitThisMonth = transformData(resp.data.Visit.thisMonth,resp.data.MainDepartments); 

      const NewToday = transformData(resp.data.NewVisit.today,resp.data.MainDepartments); 
      const NewThisMonth = transformData(resp.data.NewVisit.thisMonth,resp.data.MainDepartments); 
 

      const NewResult = {
        Today: NewToday,
        thisMonth: NewThisMonth,
      };  
      const VistResult = {
        Today: VisitToday,
        thisMonth: VisitThisMonth,
      };  
      setReVisitor(VistResult)
      setNewVisitor(NewResult)
       
      setloader(false);
    });
  }, [BranchID, setloader]); 


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
        <ReVisitor data={reVisitor.Today} Head={"Today"} />
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
