/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { CircularProgress } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import TextInput from "../../Utils/TextInput";
import PasswordInput from "../../Utils/PasswordInput";
import useToast from "../../../hooks/useToast";
import axios from "../../../Config/axios";
import { useAuth } from "../../../hooks/useAuth";

import logo from "../../../assets/Logo/TASlogo.png";
import loginimg from "../../../assets/Login/user.jpg";

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

const SignupModal = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Sign up for an account?</DialogTitle>
      <DialogContent>
        <p>
          Please contact the admin panel for assistance with creating a new
          account.
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

const Login = () => {
  const [loader, setLoader] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const { isBranchLoggedIn, loginUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handlePasswordModalOpen = () => {
    setPasswordModalOpen(true);
  };

  const handlePasswordModalClose = () => {
    setPasswordModalOpen(false);
  };

  const handleSignupModalOpen = () => {
    setSignupModalOpen(true);
  };

  const handleSignupModalClose = () => {
    setSignupModalOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roleType = localStorage.getItem("jobRole");

    if (token && roleType) {
      if (roleType === import.meta.env.VITE_ROLE_ADMIN) {
        navigate("/review-panel");
      } else if (
        roleType === import.meta.env.VITE_ROLE_USER &&
        isBranchLoggedIn
      ) {
        navigate("/");
      } else if (roleType === import.meta.env.VITE_ROLE_DOCTOR) {
        navigate("/doctor-panel");
      }
    } else {
      navigate("/user-login");
    }
  }, [navigate, isBranchLoggedIn]);

  const formik = useFormik({
    initialValues: {
      loginId: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.loginId) {
        errors.loginId = "Login ID is Required";
      } else if (values.loginId.length < 5) {
        errors.loginId = "Login ID must be at least 5 characters";
      }

      if (!values.password) {
        errors.password = "Password is Required";
      } else if (values.password.length < 5) {
        errors.password = "Password must be at least 5 characters";
      }
      return errors;
    },
    onSubmit: (values) => {
      setLoader(true);
      axios
        .post("/login", { ...values })
        .then(({ data }) => {
          setLoader(false);
          const LoggedInUser =
            data?.Employee?.firstName + " " + data?.Employee?.lastName;
          localStorage.setItem("jobRole", data?.Employee?.role?.roleType);
          localStorage.setItem("LoggedInUser", LoggedInUser);
          if (
            data?.Employee?.role?.roleType === import.meta.env.VITE_ROLE_ADMIN
          ) {
            navigate("/review-panel");
            if (isBranchLoggedIn) {
              localStorage.removeItem("branchToken");
              localStorage.removeItem("branch");
            }
          } else if (
            data?.Employee?.role?.roleType === import.meta.env.VITE_ROLE_USER
          ) {
            if (!isBranchLoggedIn) {
              showSweetAlert();
            } else {
              navigate("/");
            }
          }
          loginUser(data?.token, data?.Employee?.role?.roleType);
        })
        .catch(({ message, response }) => {
          setLoader(false);
          if (response) return toast(response.data.err, "error");
          toast(message, "error");
        });
    },
  });

  const showSweetAlert = () => {
    swal({
      title: "Branch Access Denied",
      text: "Please Login Branch",
      icon: "warning",
      buttons: {
        confirm: true,
      },
      dangerMode: true,
    }).then(() => {
      setLoader(false);
      navigate("/login");
    });
  };

  return (
    <div className="flex h-screen justify-center">
      <div className="flex items-center justify-center p-5">
        <div className="max-w-md">
          <img src={loginimg} alt="Illustration" className="w-full" />
        </div>
      </div>

      <div className="bg-white flex flex-col justify-center items-center p-5 w-[30%]">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <img src={logo} alt="Logo" className="mx-auto h-12 w-auto" />
            <h2 className="mt-4 text-3xl font-extrabold uppercase text-gray-900">
              Login
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md space-y-5">
              <div>
                <label htmlFor="loginId" className="sr-only">
                  Login ID
                </label>
                <TextInput
                  id="loginId"
                  name="loginId"
                  type="text"
                  autoComplete="loginId"
                  required
                  placeholder="Login ID"
                  value={formik.values.loginId}
                  onChange={formik.handleChange}
                />
                {formik.touched.loginId && formik.errors.loginId && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.loginId}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  placeholder="Password"
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.password}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={handlePasswordModalOpen}
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {loader && <CircularProgress size={20} color="inherit" />}
                </span>
                Login
              </button>
            </div>
          </form>
          <p className="mt-2 text-center text-sm text-gray-600">
            {`Don't have an account?`}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              onClick={handleSignupModalOpen}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
      <PasswordModal
        open={passwordModalOpen}
        handleClose={handlePasswordModalClose}
      />
      <SignupModal
        open={signupModalOpen}
        handleClose={handleSignupModalClose}
      />
    </div>
  );
};

export default Login;
