/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import CompanyLogo from "../../../assets/Logo/Invoicelogo.png";
import SelectBox from "../../Utils/SelectBox";
import Axios from "../../../Config/axios";
import NewItemRow from "./addNewRow";
import showAlert from "../../../Utils/showAlert";
import useToast from "../../../hooks/useToast";
import TextFieldInput from "../../Utils/inputbox";
import Swal from "sweetalert2";

const initialValue = {
  invoiceID: "",
  patient: null,
  doctorID: "",
  DepartmentID: "",
  MainDepartmentID:"",
  paymentMethod: "",
  items: [],
  paymentMethodID: "",
  totalAmount: 0.0,
  totalDiscount: 0.0,
  amountToBePaid: 0.0,
};

const date = new Date().toLocaleDateString();
const InvoiceEditPage = ({ invoice, fetchData, setShowEditModal }) => {
  const tost = useToast();
  const [patientList, setPatientList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [company, setCompany] = useState({ Logo: CompanyLogo });
  const [getInvoiceData, setGetInvoiceData] = useState({});
  const [formData, setFormData] = useState(initialValue);
  const [doctor, setDoctor] = useState({ name: "", doctor: "" });
  const [procedure, setProcedure] = useState([]);
  const [getData, setGetData] = useState(initialValue);

  const calculateTotals = (items) => {
    return items.reduce(
      (acc, item) => {
        const discountAmount =
          item.discountType === "INR"
            ? item.discount
            : (item.discount / 100) * item.unitPrice * item.quantity;

        const totalItemAmount = item.quantity * item.unitPrice;
        const amountToBePaid = totalItemAmount - discountAmount;

        // Update accumulator
        acc.totalAmount += totalItemAmount;
        acc.totalDiscount += discountAmount;
        acc.amountToBePaid += amountToBePaid;

        return acc;
      },
      { totalAmount: 0, totalDiscount: 0, amountToBePaid: 0 }
    );
  };

  // select Doctor Here ....
  const doctorHandle = useCallback(
    (name) => {
      const selectedDoctor = getData?.Doctors?.find((obj) => obj.name === name);
      if (selectedDoctor) {
        setDoctor({ name: selectedDoctor.name, doctor: selectedDoctor });
        const filterdProcedure = getData?.Procedures?.filter((obj) =>
          selectedDoctor.procedureIds.includes(obj._id)
        );

        setProcedure(filterdProcedure);

        const filteredItems = formData.items.filter((item) =>
          selectedDoctor.procedureIds.includes(item.ProcedureID._id)
        );

        const recalculateTotals = calculateTotals(filteredItems);
        // Update form data with the filtered items
        setFormData((prev) => ({
          ...prev,
          items: filteredItems,
          totalAmount: recalculateTotals.totalAmount,
          totalDiscount: recalculateTotals.totalDiscount,
          amountToBePaid: recalculateTotals.amountToBePaid,
        }));
      }
    },
    [getData?.Doctors]
  );
  useEffect(() => {
    if (invoice) {
      setFormData((prev) => {
        return {
          ...prev,
          invoiceID: invoice?.invoiceID,
          patient: invoice?.patientID?._id,
          doctorID: invoice?.doctorID._id,
          DepartmentID: invoice?.DepartmentID?._id,
          MainDepartmentID: invoice?.DepartmentID?.MainDepartmentID || invoice?.MainDepartmentID ,
          paymentMethod: invoice?.paymentMethod.paymentMethod,
          items: invoice?.items,
          paymentMethodID: invoice?.paymentMethod.paymentMethodID,
          totalAmount: invoice?.totalAmount,
          totalDiscount: invoice?.totalDiscount,
          amountToBePaid: invoice?.amountToBePaid,
        };
      });
    }
  }, [invoice]);

  useEffect(() => {
    doctorHandle(invoice?.doctorID?.name);
  }, [doctorHandle, invoice?.doctorID?.name]);

  const fetchInvoiceData = useCallback(async () => {
    try {
      const response = await Axios.get(
        `/add-invoice?BranchID=${invoice?.BranchID}&PatientID=${invoice?.patientID._id}`
      );
      invoice?.invoiceID;
      const data = response.data;

      setGetData(data);
      setFormData((prev) => ({
        ...prev,
        patient: data?.Patients,
        invoiceID: invoice?.invoiceID,
      }));

      setCompany((prev) => ({ ...prev, ...data?.branch }));

      const extractPatientTypes = (patientTypes) => {
        return patientTypes.map((type) => type.type);
      };

      const extractPaymentMethods = (paymentMethods) => {
        return paymentMethods.map((method) => method.Method);
      };

      setGetInvoiceData({
        Doctors: data?.Doctors.map((doctor) => doctor.name),
        patientTypes: extractPatientTypes(data?.PatientTypes),
        VisitorTypes: extractPatientTypes(data?.VisitorTypes),
        paymentMethods: extractPaymentMethods(data?.paymentMethods),
        invoiceID: invoice?.invoiceID,
        createdBy: data?.createdBy,
      });
    } catch (error) {
      console.error("Fetching invoice data failed:", error);
    }
  }, [invoice?.BranchID, invoice?.invoiceID, invoice?.patientID._id]);

  useEffect(() => {
    if (invoice?.BranchID) {
      fetchInvoiceData();
    }
  }, [invoice?.BranchID, fetchInvoiceData]);

  const handlePaymentMethod = (Method) => {
    setFormData((prev) => {
      const data = getData.paymentMethods.find((obj) => obj.Method === Method);
      return {
        ...prev,
        paymentMethodID: data?._id,
        paymentMethod: Method,
      };
    });
  };

  //add doctor data
  useEffect(() => {
    if (doctor?.doctor?._id) {
      setFormData((prev) => ({
        ...prev,
        doctorID: doctor.doctor._id,
        DepartmentID: doctor?.doctor?.DepartmentID?._id,
        MainDepartmentID:doctor?.doctor?.DepartmentID?.MainDepartmentID,
        patient: prev.patient,
        invoiceID: invoice?.invoiceID,
      }));
    }
  }, [doctor, invoice?.invoiceID]);

  const resetForm = () => {
    setFormData(initialValue);
    setDoctor("");
    fetchInvoiceData();
  };

  const onSubmit = () => {
    if (!formData?.invoiceID) {
      showAlert("Invoice ID", "", "warning");
      return;
    }
    if (!formData?.patient) {
      showAlert(
        "Patient",
        "Patient Details Required.!",
        "warning"
      );
      return;
    }
    if (!formData?.doctorID) {
      showAlert("Doctor", "Doctor Required.!", "warning");
      return;
    }
    if (formData?.items.length <= 0) {
      showAlert("Procedure", "Procedure Required.!", "warning");
      return;
    }
    if (!formData?.paymentMethod || !formData?.paymentMethodID) {
      showAlert(
        "payment Method",
        "Please Choose your Payment Method",
        "warning"
      );
      return;
    }
    showAlert("Success", "Invoice Added", "success");

    const updatedItems = formData.items.map((item) => {
      const isProcedureIdObject =
        typeof item.ProcedureID === "object" &&
        item.ProcedureID !== null &&
        "_id" in item.ProcedureID;
      return isProcedureIdObject
        ? { ...item, ProcedureID: item.ProcedureID._id }
        : { ...item };
    });

    const updatedData = {
      ...formData,
      items: updatedItems,
      BranchID: invoice.BranchID,
    };

    Axios.post("/edit-invoice", { ...updatedData })
      .then(() => {
        setShowEditModal(false);
        showAlert("Success", "Invoice Added", "success");
        resetForm();
        fetchData();
      })
      .catch((err) => {
        Swal.fire({
          title: "Permission Denied!",
          text: "You aren't permitted to edit this.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setShowEditModal(false);
        console.log(err, "err");
      });
  };

  const addNewItem = (newItem) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items, newItem];
      const recalculatedTotals = calculateTotals(updatedItems);
      return {
        ...prev,
        items: updatedItems,
        totalAmount: recalculatedTotals.totalAmount,
        totalDiscount: recalculatedTotals.totalDiscount,
        amountToBePaid: recalculatedTotals.amountToBePaid,
      };
    });
  };

  const deleteItem = (index) => {
    const updatedItems = formData.items.filter(
      (_, itemIndex) => itemIndex !== index
    );
    const recalculateTotals = calculateTotals(updatedItems);

    // Update the state with the new values
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      totalAmount: recalculateTotals.totalAmount,
      totalDiscount: recalculateTotals.totalDiscount,
      amountToBePaid: recalculateTotals.amountToBePaid,
    }));
  };

  // search Patient ......
  const fetchUserData = useCallback(async () => {
    try {
      const response = await Axios.get(`/patient-list/${invoice?.BranchID}`, {
        params: { search: searchTerm },
      });
      setPatientList(response?.data?.patients);
    } catch (error) {
      console.error("Error fetching patient list:", error);
    }
  }, [invoice?.BranchID, searchTerm]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      if (searchTerm.length > 0) {
        if (invoice?.BranchID) {
          fetchUserData();
        } else {
          tost("Please select Branch", "error");
        }
      }
    }, 500);
    return () => clearTimeout(debounceFetch);
  }, [searchTerm, invoice?.BranchID, tost, fetchUserData]);

  const handlePatient = (patient) => {
    setFormData((prev) => {
      return {
        ...prev,
        patient: patient,
      };
    });
    setSearchTerm("");
  };

  const changeUser = () => {
    setFormData((prev) => {
      return {
        ...prev,
        patient: null,
      };
    });
  };

  return (
    <div className="bg-white px-10 py-2">
      <div className=" bg-white">
        <div className="flex justify-between items-center border-b pb-4">
          <img src={company.Logo} alt="Company Logo" className="h-20" />
          <div className="text-xs text-right uppercase">
            <p className="font-bold text-lg ">
            Topmost Dental and skin clinic
              {/* Topmost {company?.branchName} */}
              </p>
            <span>{company?.address}, </span>
            <span>{company?.city}, </span>
            <span>{company?.state}, </span>
            <br />
            <span>Pin:{company?.pincode}, </span>
            <span>Phone:{company?.phone}, </span>
            <span className="lowercase">{company?.email}</span>
          </div>
        </div>

        {/* Patient Details and Invoice Info */}
        <div className="flex justify-between border-b py-4">
          <div className="text-sm">
            <p className="flex gap-2">
              <strong>Patient Details:</strong>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={20}
                viewBox="0 0 24 24"
                width={20}
                fill="#387ADF"
                onClick={(e) => {
                  e.stopPropagation();
                  changeUser();
                }}
                className="cursor-pointer hover:scale-125 duration-300"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </p>

            <>
              {formData?.patient ? (
                <>
                  <p>{formData?.patient?.Name}</p>
                  <p>{`${formData?.patient?.Gender}, Age: ${formData?.patient?.age}`}</p>
                  <p>{formData?.patient?.Address?.city}</p>
                  <p>{`VisitorType: ${
                    formData?.patient?.VisitorTypeID?.type
                      ? formData?.patient?.VisitorTypeID?.type
                      : "N/A"
                  }`}</p>
                  <p>{`PatientType: ${
                    formData?.patient?.patientTypeID?.type
                      ? formData?.patient?.patientTypeID?.type
                      : "N/A"
                  }`}</p>
                </>
              ) : (
                <div className="max-w-md mx-auto relative">
                  <TextFieldInput
                    label="Search Patient"
                    name="searchBox"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {!!patientList.length && !!searchTerm.length && (
                    <div className="absolute top-[4rem] z-30 left-0 w-full bg-white border rounded-lg shadow mt-2">
                      {patientList.map((patient, index) => (
                        <div
                          key={index}
                          className="p-4 border-b hover:bg-slate-200 rounded-lg "
                          onClick={() => {
                            handlePatient(patient);
                          }}
                        >
                          <p>{patient?.PatientID}</p>
                          <p>{patient?.Name}</p>
                          <p>{patient?.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          </div>
          <div className="text-center ">
            <p className="text-2xl font-bold uppercase">Invoice</p>
          </div>
          <div className="text-sm text-right xl:w-1/6">
            <p>
              <strong>Invoice ID:</strong> {getInvoiceData?.invoiceID}
            </p>
            <p>
              <strong>Date:</strong> {date}
            </p>
            <div>
              <SelectBox
                id="Doctors"
                label="Doctors"
                options={getInvoiceData.Doctors ? getInvoiceData.Doctors : []}
                fullWidth
                onChange={(name) => doctorHandle(name)}
                value={doctor?.name || null}
              />
            </div>
            <p>
              <strong>Department:</strong>{" "}
              {doctor && doctor?.doctor?.DepartmentID?.Name}
            </p>
          </div>
        </div>
        {/* Invoice Title */}

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead className="border-b border-black ">
              <tr className="text-center">
                <th className="p-2 text-sm font-medium">No</th>
                <th className="p-2 text-sm font-medium">Procedure/Services</th>
                {/* <th className="p-2 text-sm font-medium">HSNCode</th> */}
                <th className="p-2 text-sm font-medium">Qty</th>
                <th className="p-2 text-sm font-medium">Unit Rate</th>
                <th className="p-2 text-sm font-medium ">Discount</th>

                <th className="p-2 text-sm font-medium  ">
                  <div className="flex">
                    <span className=" flex-1 p-2">GST</span>
                    <span className=" flex-1 p-2">CGST</span>{" "}
                    <span className=" flex-1 p-2">SGST</span>{" "}
                  </div>
                </th>

                <th className="p-2 text-sm font-medium truncate">
                  Taxable Value
                </th>
                <th className="p-2 text-sm font-medium truncate">GST</th>

                <th className="p-2 text-sm font-medium truncate">
                  Total Amount
                </th>
                <th className="p-2 text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData &&
                formData?.items.map((item, index) => (
                  <tr
                    key={item?.ProcedureID?._id || index}
                    className="border-b border-black text-center"
                  >
                    <td className="p-2 text-sm border-r border-black">
                      {index + 1}
                    </td>
                    <td className="p-2 text-sm border-r border-black">
                      {item?.procedure}
                    </td>
                    {/* <td className="p-2 text-sm border-r border-black">
                      {item?.HSNCode}
                    </td> */}
                    <td className="p-2 text-sm border-r border-black">
                      {item?.quantity}
                    </td>
                    <td className="p-2 text-sm border-r border-black">
                      {item?.unitPrice}
                    </td>
                    <td className="p-2 text-sm border-r border-black ">
                      {item?.discount} {item?.discountType}
                    </td>

                    <td className="p-2 text-sm border-r  border-black">
                      <div className="flex">
                        <span className="border-r p-2  flex-1">
                          {item?.GST}%
                        </span>{" "}
                        <span className="border-r p-2 flex-1">
                          {item?.GST / 2}%
                        </span>
                        <span className="flex-1 p-2">{item?.GST / 2}%</span>
                      </div>
                    </td>
                    <td className="p-2 text-sm border-r border-black">
                      {item?.amountToBePaid && item?.GST !== undefined
                        ? (item.amountToBePaid / (1 + item.GST / 100)).toFixed(
                            2
                          )
                        : "N/A"}
                    </td>
                    <td className="p-2 text-sm border-r border-black">
                      {item?.amountToBePaid && item?.GST !== undefined
                        ? (
                            item.amountToBePaid -
                            item.amountToBePaid / (1 + item.GST / 100)
                          ).toFixed(2)
                        : "N/A"}
                    </td>

                    <td className="p-2 text-sm border-r w-[10%] border-black">
                      {item?.amountToBePaid}
                    </td>
                    <td className="p-2">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteItem(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              {/* New Item Row */}
              <NewItemRow
                procedures={procedure}
                onAdd={addNewItem}
                sl={formData?.items.length + 1}
              />
            </tbody>
          </table>
        </div>

        {/* Footer with Generated By, Total Amount, etc. */}
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm">
            <p>
              <strong>Generated By:</strong>{" "}
              <span className="capitalize">{getData.createdBy}</span>
            </p>
            <p>
              <strong>Printed On:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="text-right w-2/12">
            <p>
              <strong>Total Amount:</strong> {Number(formData?.totalAmount)}
            </p>
            <p>
              <strong>Total Discount:</strong> {formData?.totalDiscount}
            </p>
            <p>
              <strong>Amount to be Paid:</strong> {formData?.amountToBePaid}
            </p>
            <div className="">
              <SelectBox
                id="Method"
                label="Payment Method"
                options={
                  getInvoiceData?.paymentMethods
                    ? getInvoiceData?.paymentMethods
                    : []
                }
                fullWidth
                onChange={(method) => handlePaymentMethod(method)}
                value={formData?.paymentMethod || null}
              />
            </div>
            <button
              className="bg-slate-400 px-4 py-3 mt-4 rounded-lg "
              onClick={onSubmit}
            >
              {" "}
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditPage;
