/* eslint-disable */
import axios from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import useToast from "../../../hooks/useToast";
import { useAuth } from "../../../hooks/useAuth";
import logo from "../../../assets/Logo/TASlogo.png";
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useState } from "react";

const PasswordModal = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        <p>
          Please contact the admin panel for assistance with updating your
          password.
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SignIn = () => {
  const [loader, setLoader] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { loginBranch } = useAuth();

  const formik = useFormik({
    initialValues: {
      loginId: "",
      password: "",
      passwordVisible: false,
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
      if (!navigator.onLine) {
        toast("No internet connection", "error");
        setLoader(false);
        return;
      }
      try {
        axios
          .post(`${import.meta.env.VITE_BASEURL}/branch/login`, {
            loginId: values.loginId,
            password: values.password,
          })
          .then(({ data }) => {
            loginBranch(data.token);
            localStorage.setItem("branch", [
              data?.Branch?.branchName,
              data?.Branch?._id,
            ]);
            setLoader(false);
            navigate("/user-login");
          })
          .catch((err) => {
            setLoader(false);
            if (!err.response) {
              toast("Cannot connect to the server", "error");
            } else {
              toast(err.response.data.error, "error");
            }
          });
      } catch (error) {
        setLoader(false);
        console.log("err", error);
      }
    },
  });

  const togglePasswordVisibility = () => {
    formik.setFieldValue("passwordVisible", !formik.values.passwordVisible);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex md:flex-row flex-col items-center justify-center md:gap-10 py-10 w-3/4">
        <div className="flex flex-col justify-center md:items-end items-center md:w-auto w-full">
          <img src={logo} alt="" />
          <h1 className="md:text-right text-center uppercase xl:text-2xl text-lg font-bold mb-3">
            ACCESS YOUR BRANCH
          </h1>
          <p className="text-sm md:text-right text-center w-[15rem]">
            Your gateway to seamless connectivity. Please enter your
            credentials.
          </p>
        </div>
        <div className="p-8 md:w-[50rem] w-full">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
            <div>
              <input
                type="text"
                className="w-full border border-[#cfcdcd] py-2 px-4 rounded-md outline-none"
                placeholder="Login ID"
                id="loginId"
                name="loginId"
                onChange={formik.handleChange}
                value={formik.values.loginId}
              />
              {formik.errors.loginId && formik.touched.loginId && (
                <div className="text-red-500 text-left">
                  {formik.errors.loginId}
                </div>
              )}
            </div>
            <div>
              <div className="relative">
                <input
                  type={formik.values.passwordVisible ? "text" : "password"}
                  className="w-full border border-[#cfcdcd] py-2 px-4 rounded-md pr-10 outline-none"
                  placeholder="Password"
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-black cursor-pointer"
                >
                  {formik.values.passwordVisible ? "Hide" : "Show"}
                </button>
              </div>
              {formik.errors.password && formik.touched.password && (
                <div className="text-red-500 text-left">
                  {formik.errors.password}
                </div>
              )}
              <div className="text-right mt-3">
                <a
                  href="#"
                  className="text-[#387ADF]"
                  onClick={handleModalOpen}
                >
                  Forgot your password?!
                </a>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#387ADF] text-white py-2 rounded-md uppercase"
            >
              <span className="flex justify-center items-center gap-2">
                Sign In{" "}
                {loader && (
                  <span className="inline-flex justify-center items-center">
                    <CircularProgress size={20} color="inherit" />
                  </span>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
      <PasswordModal open={modalOpen} handleClose={handleModalClose} />
    </div>
  );
};

export default SignIn;
