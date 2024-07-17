import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const settings = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { logoutBranch } = useAuth();
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl uppercase font-bold py-5">Settings</h1>
        <div className="space-y-5 gap-5 py-10 w-full justify-center text-center px-10">
        <Link to={'/profile'}>
            <div className="border cursor-pointer px-10 py-5 rounded-md border-blue-500 w-full">
            My Account
          </div></Link>
          <div className="border px-10 py-5 cursor-pointer rounded-md border-green-500 w-full">
            Reports
          </div>
          <div className="border px-10 py-5 cursor-pointer rounded-md border-red-500 w-full">
            Help
          </div>
          <div className="border px-10 py-5 cursor-pointer rounded-md border-orange-500 w-full" onClick={logoutBranch}  >
            Branch Logout
          </div>
          <div className="border px-10 py-5 cursor-pointer rounded-md border-yellow-500 w-full">
            User Logout
          </div>
        </div>
      </div>
    </>
  );
};

export default settings;
