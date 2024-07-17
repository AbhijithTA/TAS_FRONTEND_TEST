const SumReportTable = ({ data }) => {
    return data?.map((branch, index) => {
      // Calculate total sub-departments for the branch rowSpan
      const totalSubDeptsInBranch = branch.mainDepartments.reduce((acc, dept) => acc + dept.departments.length, 0);
  
      return branch.mainDepartments.map((department, deptIndex) => {
        // Calculate the rowSpan for the main department cells
        const totalSubDeptsInMainDept = department.departments.length;
  
        return department.departments.map((subDept, subDeptIndex) => (
          <tr key={`${index}-${deptIndex}-${subDeptIndex}`} className="border  ">
            {deptIndex === 0 && subDeptIndex === 0 && (
              <>
                <td
                  rowSpan={totalSubDeptsInBranch} // Correct rowSpan for branch name
                  className="border-t my-auto px-2 py-1 uppercase"
                  >
                  {branch.branchName} 
                </td>
                <td
                  rowSpan={totalSubDeptsInBranch} // Correct rowSpan for branch sum
                  className="border px-2 py-1"
                >
                  <span className="text-red-800">Rs</span> {branch.branchSum}/-
                </td>
              </>
            )}
            {subDeptIndex === 0 && (
              <>
                <td
                  rowSpan={totalSubDeptsInMainDept} // rowSpan for main department invoice count
                  className="border px-2 py-1"
                >
                  {department.mainDepartmentInvoiceCount}
                </td>
                <td
                  rowSpan={totalSubDeptsInMainDept} // rowSpan for main department name
                  className="border px-2 py-1 uppercase"
                >
                  {department.mainDepartmentName}
                </td>
                <td
                  rowSpan={totalSubDeptsInMainDept} // rowSpan for main department total sum
                  className="border  px-2 py-1"
                >
                  <span className="text-red-800">Rs</span> {department.mainDepartmentSum}/-
                </td>
              </>
            )}
            <td className="border px-2 py-1 uppercase">{subDept.departmentName}</td>
            <td className="border px-2 py-1 "><span className="text-red-800">Rs</span> {subDept.departmentSum}/-</td>
            <td className="border px-2 py-1">{subDept.departmentInvoiceCount}</td>
          </tr>
        ));
      });
    });
  };

  export default SumReportTable