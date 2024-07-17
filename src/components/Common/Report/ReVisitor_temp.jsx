/* eslint-disable react/prop-types */

const ReVisitor = ({ data, Head, date }) => {
  return (
    <>
    <div className="max-w-full h-[300px] mx-auto rounded-md">
    <div className="max-h-[300px] h-[300px] overflow-y-auto border-8">
          <table className="text-sm text-gray-500  w-full ">
            <thead className="text-xs text-gray-700 uppercase ">
              <tr className="bg-gray-200 border-8">
                <th colSpan={10}>
                  {Head} <span className="text-blue-800">{date}</span>
                </th>
              </tr>
              <tr className="border-5">
                <th className="py-4 px-2 text-left">Branch</th>
                <th className="py-4 px-2 text-left">Count</th>
                <th className="py-4 px-2 text-left">Department</th>
                <th className="py-4 px-2 text-left">Count</th>
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
                const totalSubDeptsInBranch = branch.mainDepartments.reduce(
                  (acc, dept) => acc + dept.departments.length,
                  0
                );

                return branch.mainDepartments.map((department, deptIndex) => {
                  const totalSubDeptsInMainDept = department.departments.length;

                  return department.departments.map((subDept, subDeptIndex) => (
                    <tr
                      key={`${index}-${deptIndex}-${subDeptIndex}`}
                      className="border"
                    >
                      {deptIndex === 0 && subDeptIndex === 0 && (
                        <>
                          <td
                            rowSpan={totalSubDeptsInBranch}
                            className="border-t uppercase my-auto px-2 py-1"
                          >
                            {branch.branchName}
                          </td>
                          <td
                            rowSpan={totalSubDeptsInBranch}
                            className="border px-2 py-1"
                          >
                            {branch.visitors}
                          </td>
                        </>
                      )}
                      {subDeptIndex === 0 && (
                        <>
                          <td
                            rowSpan={totalSubDeptsInMainDept}
                            className="border px-2 py-1 uppercase"
                          >
                            {department.mainDepartmentName}
                          </td>
                          <td
                            rowSpan={totalSubDeptsInMainDept}
                            className="border px-2 py-1"
                          >
                            {department.visitors}
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

export default ReVisitor;
