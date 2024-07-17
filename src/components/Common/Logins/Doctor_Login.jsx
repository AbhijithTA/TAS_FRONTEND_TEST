/* eslint-disable react/prop-types */
import TextInput from "../../Utils/TextInput";
import PasswordInput from "../../Utils/PasswordInput";
import logo from "../../../assets/Logo/TASlogo.png";
import { CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import Axios from "../../../Config/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "../../../hooks/useToast";
import { useAuth } from "../../../hooks/useAuth";
import Doct from "../../../assets/svg/Doct";
// import swal from "sweetalert";

const Doctor_Login = ({ User_Form, Doctor_Form, isFlipped }) => {
  const [loader, setLoader] = useState(false);
  const {loginUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [accounts,setAccounts] = useState([])
  const [selectedAccount,setSelectedAccount] = useState('')
  const [doctor_token,setDoctor_Token] = useState('')
  const navigate = useNavigate();
  const toast = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }; 
  const formik = useFormik({
    initialValues: {
      loginId: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};
      // Validate loginId format
      if (!values.loginId) {
        errors.loginId = "Login ID is Required";
      } else if (values.loginId.length < 5) {
        errors.loginId = "Login ID must be at least 5 characters";
      }

      // Validate password
      if (!values.password) {
        errors.password = "Password is Required";
      } else if (values.password.length < 5) {
        errors.password = "Password must be at least 5 characters";
      }
      return errors;
    },
    onSubmit: (values) => {
      setLoader(true);
      Axios.post("/doctor/doctor-login", { ...values })
        .then(({ data }) => {
          setLoader(false); 
         setAccounts(data?.Doctor)
         setDoctor_Token(data?.token) 
         setSelectedAccount(data?.primary_account)
        })
        .catch(({ message, response }) => {
          setLoader(false);
          if (response) return toast(response.data.err, "error");
          toast(message, "error");
        });
    },
  });


  const onProceed = () =>{
console.log(doctor_token)
console.log(selectedAccount)
Axios.post('/doctor/doctor-branch_change',{id:selectedAccount},{
  headers: {
    'Authorization': `${doctor_token}`,
    'Content-Type': 'application/json'
  }
}).then(({data})=>{
  console.log(data?.Doctor?.role?.roleType) 
  localStorage.setItem("jobRole", data?.Doctor?.role?.roleType);
  localStorage.setItem("LoggedInUser", data?.Doctor?.name);  
  if (data?.Doctor?.role?.roleType === import.meta.env.VITE_ROLE_DOCTOR ) {
    navigate("/doctor-panel");
     
  }  
  loginUser(data?.token, data?.Doctor?.role?.roleType);
})


  }

 

  return (
    <>
      <div
        className="flex flex-col justify-center items-center gap-2 pb-6"
        style={{ backfaceVisibility: "hidden" }}
      >
        <img src={logo} alt="Logo" className="max-w-full h-auto " />
        <h1 className="font-semibold uppercase text-center">Welcome back!</h1>
        <span className="font-bold text-xl text-center uppercase text-[#387ADF] flex">
          <Doct /> Doctor Login
        </span>
        <p className="text-center">
          Please sign in to access your account and get connected
        </p>
      </div>

      <div className="flex justify-center items-center w-full mb-4">
        <div className="border border-white flex justify-center items-center w-full rounded-lg">
          <div
            className={`w-1/2 text-center border-white border-r-2 p-2 cursor-pointer ${
              !isFlipped ? "bg-slate-300" : "hover:bg-slate-200"
            }`}
            onClick={User_Form}
          >
            User Login
          </div>
          <div
            className={`w-1/2 text-center p-2 cursor-pointer  ${
              !isFlipped ? "hover:bg-slate-200" : "bg-slate-300"
            }`}
            onClick={Doctor_Form}
          >
            Doctor Login
          </div>
        </div>
      </div>
      <div className="flex items-center justify-start p-4 w-full">
        <div className="w-full">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <div>
              <TextInput
                label="loginId"
                type="text"
                id="loginId"
                name="loginId"
                placeholder="Login ID"
                value={formik.values.loginId}
                onChange={formik.handleChange}
              />
              {formik.touched.loginId && formik.errors.loginId && (
                <div className="text-[#ff4b4b] text-left">
                  {formik.errors.loginId}
                </div>
              )}
            </div>
            <div>
              <PasswordInput
                label="Password"
                id="password"
                name="password"
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="Password"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-[#ff4b4b] text-left">
                  {formik.errors.password}
                </div>
              )}
              <p className="text-[#387ADF] text-right mt-3">
                Forgot your password?!
              </p>
            </div>

            { (!accounts.length > 0)  && <button
              type="submit"
              className="bg-[#387ADF] text-white font-bold py-2 px-4 rounded focus:outline-none text-sm w-full"
            >
              <span className="flex justify-center items-center gap-2">
                Login 
                {loader && (
                  <span className="inline-flex justify-center items-center">
                    <CircularProgress size={20} color="inherit" />
                  </span>
                )}
              </span>
            </button>}
            
            
          </form>
          <div>
              {!!accounts.length && 
             <>
              <select
                onChange={(e)=>{setSelectedAccount(e.target.value)}}
                value={selectedAccount}
                className="border border-[#cfcdcd] focus:outline-none rounded
                w-full px-3 py-2 my-2"
              >
                {accounts?.map((account)=>{
                  return(<option key={account?._id} value={account?._id} >   
                     {account?.BranchID?.branchName} 
                     </option>)
                })}
                 
              </select>
              <button 
              onClick={onProceed}
              className="bg-[#387ADF] text-white font-bold py-2 px-4 rounded focus:outline-none text-sm w-full"
            >
              <span className="flex justify-center items-center gap-2">
                Proceed 
                {loader && (
                  <span className="inline-flex justify-center items-center">
                    <CircularProgress size={20} color="inherit" />
                  </span>
                )}
              </span>
            </button>
             </>}
              
            </div>
        </div>
      </div>
    </>
  );
};

export default Doctor_Login;
