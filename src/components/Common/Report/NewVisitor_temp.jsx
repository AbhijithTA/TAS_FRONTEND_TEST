/* eslint-disable react/prop-types */

const NewVisitor = ({ data, Head, date }) => {
  return (
    <>
      <div className="max-w-full h-[300px] mx-auto rounded-md">
        <div className="max-h-[300px] h-[300px] overflow-y-auto border-8">
          <table className="text-sm text-gray-500  w-full ">
            <thead className="text-xs text-gray-700 uppercase ">
              <tr className="bg-gray-200 border-8">
                <th colSpan={10}>
                  {" "}
                  {Head} <span className="text-blue-800">{date}</span>{" "}
                </th>
              </tr>
              <tr className="border">
                <th className="py-4  px-2  text-left">Branch</th>
                <th className="py-4  px-2 text-left">Count</th>
                <th className="py-4  px-2 text-left">Department</th>
                <th className="py-4  px-2 text-left">Count</th>
              </tr>
            </thead>

            <tbody className="h-[38px]">
              {!data?.length && (
                <tr>
                  <th className="text-red-400 text-center" colSpan={10}>
                    No data Available {Head}
                  </th>
                </tr>
              )}
              {data?.map((branch, index) => {
                // Calculate total sub-departments for the branch rowSpan
                const totalSubDeptsInBranch = branch.mainDepartments.reduce(
                  (acc, dept) => acc + dept.departments.length,
                  0
                );
                return branch.mainDepartments.map((department, deptIndex) => {
                  // Calculate the rowSpan for the main department cells
                  const totalSubDeptsInMainDept = department.departments.length;

                  return department.departments.map((subDept, subDeptIndex) => (
                    <tr
                      key={`${index}-${deptIndex}-${subDeptIndex}`}
                      className="border "
                    >
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
                            {branch.New_visitors}
                          </td>
                        </>
                      )}
                      {subDeptIndex === 0 && (
                        <>
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
                            {department.New_visitors}
                          </td>
                        </>
                      )}
                    </tr>
                  ));
                });
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default NewVisitor;
