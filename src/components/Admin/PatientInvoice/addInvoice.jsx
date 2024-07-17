/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import CompanyLogo from "../../../assets/Logo/Invoicelogo.png";
import SelectBox from "../../Utils/SelectBox";
import TextFieldInput from "../../Utils/inputbox";
import Axios from "../../../Config/axios";
import { useLocation } from "react-router-dom";
import NewItemRow from "./addNewRow";
import showAlert from "../../../Utils/showAlert";
import Select_Branch_ID from "../../Utils/BranchIDSelection";
import useToast from "../../../hooks/useToast";

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
const InvoicePage = ({ setRefreshList }) => {
  const tost = useToast();
  const [branch, setBranch] = useState("");
  const location = useLocation();
  const PatientID = new URLSearchParams(location.search).get("PatientID");
  const BranchID = new URLSearchParams(location.search).get("BranchID");

  const [company, setCompany] = useState({ Logo: CompanyLogo });
  const [searchTerm, setSearchTerm] = useState("");
  const [patientList, setPatientList] = useState([]);
  const [getInvoiceData, setGetInvoiceData] = useState({});
  const [formData, setFormData] = useState(initialValue);
  const [doctor, setDoctor] = useState({ name: "", doctor: "" });
  const [procedure, setProcedure] = useState([]);
  const [getData, setGetData] = useState(initialValue);
  const [consultation,setConsultation]= useState(false)

  // selecting branch first....
  useEffect(() => {
    setBranch((prev) => {
      return { ...prev, id: BranchID };
    });
  }, [BranchID, location.search]);


useEffect(()=>{
  setConsultation(false)
  if(formData.patient){
    const today = new Date(); 
  const lastConsultationDate = new Date(formData?.patient?.lastConsultationFeeDate);
  const daysSinceLastConsultation = Math.floor((today - lastConsultationDate) / (1000 * 60 * 60 * 24)); 
  if(formData?.patient?.lastConsultationFeeDate === undefined ){
    setConsultation(true)
  }else if(daysSinceLastConsultation > 30 ){
    setConsultation(true)
  }
  } 
},[formData.patient, formData.patient?.lastConsultationFeeDate])

  useEffect(() => {
    setDoctor("");
    setProcedure([]);
    setFormData((prev) => ({
      ...prev,
      doctorID: "",
      DepartmentID: "",
    }));
  }, [branch]);

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
      }
    },
    [getData?.Doctors, getData?.Procedures]
  );

  // search Patient ......
  const fetchData = useCallback(async () => {
    try {
      const response = await Axios.get(`/patient-list/${branch?.id}`, {
        params: { search: searchTerm },
      });
      setPatientList(response?.data?.patients);
    } catch (error) {
      console.error("Error fetching patient list:", error);
    }
  }, [branch?.id, searchTerm]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      if (searchTerm.length > 0) {
        if (branch?.id) {
          fetchData();
        } else {
          tost("Please select Branch", "error");
        }
      }
    }, 500);
    return () => clearTimeout(debounceFetch);
  }, [searchTerm, fetchData, branch?.id, tost]);

  const fetchInvoiceData = useCallback(async () => {
    try {
      const response = await Axios.get(
        `/add-invoice?BranchID=${branch?.id}&PatientID=${PatientID}`
      );
      const data = response?.data;
      setGetData(data);
      setFormData((prev) => ({
        ...prev,
        patient: data?.Patients,
        invoiceID: data?.nextInvoceID,
      }));
      setCompany((prev) => ({ ...prev, ...data?.branch }));

      const extractPatientTypes = (patientTypes) => {
        return patientTypes?.map((type) => type?.type);
      };

      const extractPaymentMethods = (paymentMethods) => {
        return paymentMethods?.map((method) => method?.Method);
      };

      setGetInvoiceData({
        Doctors: data?.Doctors.map((doctor) => doctor.name),
        patientTypes: extractPatientTypes(data?.PatientTypes),
        VisitorTypes: extractPatientTypes(data?.VisitorTypes),
        paymentMethods: extractPaymentMethods(data?.paymentMethods),
        invoiceID: data?.nextInvoceID,
        createdBy: data?.createdBy,
      });
    } catch (error) {
      console.error("Fetching invoice data failed:", error);
    }
  }, [branch?.id, PatientID]);

  useEffect(() => {
    if (branch?.id) {
      fetchInvoiceData();
    }
  }, [branch?.id, fetchInvoiceData]);

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
        ...initialValue, // Reset to initial values
        doctorID: doctor.doctor._id,
        DepartmentID: doctor?.doctor?.DepartmentID?._id,
        MainDepartmentID:doctor?.doctor?.DepartmentID?.MainDepartmentID,
        patient: prev.patient,
        invoiceID: prev?.invoiceID,
      }));
    } 
  }, [doctor]);

  const resetForm = () => {
    setFormData(initialValue);
    setSearchTerm("");
    setDoctor("");
    fetchInvoiceData();
    setRefreshList(true);
  };

  const onSubmit = () => {
    if (!formData?.invoiceID) {
      showAlert("Invoice ID", "", "warning");
      return;
    }
    if (!formData?.patient) {
      showAlert(
        "Patient",
        "Please make sure - select a patient first",
        "warning"
      );
      return;
    }
    if (!formData?.doctorID) {
      showAlert("Doctor", "Please make sure - select Doctor", "warning");
      return;
    }
    if (formData?.items.length <= 0) {
      showAlert("Procedure", "Please add Procedure/Services ", "warning");
      return;
    }
    if (!formData?.paymentMethod || !formData?.paymentMethodID) {
      showAlert(
        "paymentMethod",
        "Please Choose Your Payment Method",
        "warning"
      );
      return;
    }

    Axios.post("/add-invoice", { ...formData, BranchID: branch?.id })
      .then(() => {
        setFormData(initialValue);
        showAlert("Success", "Invoice Added", "success");
        resetForm();
      })
      .catch(({ response }) => {
        showAlert(response.data.error, "", "warning");
      });
  };

  const addNewItem = (item) => {
    if (doctor) {
      setFormData((prev) => {
        const discountAmount = item.totalAmount - item.amountToBePaid;
        const newTotelDiscount = prev.totalDiscount + discountAmount;
        const newTotalAmount = prev.totalAmount + item.totalAmount;
        const newAmountToBePaid = prev.amountToBePaid + item.amountToBePaid;
        return {
          ...prev,
          items: [...prev.items, item],
          totalDiscount: newTotelDiscount,
          totalAmount: newTotalAmount,
          amountToBePaid: newAmountToBePaid,
        };
      });
    } else {
      showAlert("Doctor", "Please make sure - select Doctor", "warning");
    }
  };

  const deleteItem = (index) => {
    const updatedItems = formData?.items?.filter(
      (_, itemIndex) => itemIndex !== index
    );

    // Recalculate totals
    let newTotalAmount = 0;
    let newTotalDiscount = 0;
    let newAmountToBePaid = 0;

    updatedItems?.forEach((item) => {
      newTotalAmount += item.totalAmount;
      const discountAmount = item.totalAmount - item.amountToBePaid;
      newTotalDiscount += discountAmount;
      newAmountToBePaid += item.amountToBePaid;
    });

    // Update state with the new values
    setFormData({
      ...formData,
      items: updatedItems,
      totalAmount: newTotalAmount,
      totalDiscount: newTotalDiscount,
      amountToBePaid: newAmountToBePaid,
    });
  };

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
    <div className="bg-white w-full">
      <div className="flex justify-end items-center"> 
        <div className="w-1/2">
          {!BranchID && (
            <Select_Branch_ID value={branch} onChange={setBranch} />
          )}
        </div>
      </div>
      <div className=" bg-white">
        <div className="flex justify-between items-center py-5">
          {(!company.Logo ? <div className="h-20 bg-gray-300 w-48 rounded animate-pulse"></div> :  <img src={company.Logo} alt="Company Logo" className="h-20" />   )}
          <div className="text-xs text-right uppercase">
          {(company?.branchName ? <><p className="font-bold text-lg ">
          Topmost Dental and skin clinic
            {/* Topmost 
            <span>{company?.branchName}</span> */}
            </p>
            <span>{company?.address}, </span>
            <span>{company?.city}, </span>
            <span>{company?.state}, </span>
            <br />
            <span>Pin:{company?.pincode}, </span>
            <span>Phone:{company?.phone}, </span>
            <span className="lowercase">{company?.email}</span></> : <div className="text-xs text-right uppercase">
            <p className="font-bold text-lg ">Topmost <span className="ml-2  rounded-full animate-pulse bg-gray-300 px-20"></span></p>
            <span >  </span>
            <span>  </span>
            <span>  </span>
            <br />
            <span>Pin: <span className="ml-2  rounded-full animate-pulse bg-gray-300 px-6"> ,</span>  </span>
            <span>Phone: <span className="ml-2  rounded-full animate-pulse bg-gray-300 px-10">  </span>, </span>
            <span className="lowercase ml-2  rounded-full animate-pulse bg-gray-300 px-12"> </span>
          </div> )}
          </div>
        </div>

        <hr className="my-5" />

        {/* Patient Details and Invoice Info */}
        <div className="flex justify-between border-b py-4">
          <div className="text-sm">
            <p>
              <strong>Patient Details:</strong>
            </p>
            {formData?.patient ? (
              <div className="flex flex-row-reverse ">
              <div>
              {!PatientID && <svg
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
              </svg>}
              </div>
              <div>
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
              </div>
            </div>
            ) : ( PatientID ? 
              <>
              <span className="rounded-full animate-pulse bg-gray-300 px-16"> </span> 
                <p><span className="rounded-full animate-pulse  bg-gray-300 px-8"> </span> , Age: <span className="rounded-full animate-pulse bg-gray-300 px-4"> </span></p>
                <p>`VisitorType:` <span className="rounded-full animate-pulse bg-gray-300 px-6"> </span></p>
                <p>`PatientType:` <span className="rounded-full animate-pulse bg-gray-300 px-6"> </span></p>
              </>
               :
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
          </div>
          <div className="text-center ">
           
            <p className="text-2xl font-bold uppercase">Invoice</p>
          </div>
          <div className="text-sm xl:w-1/6">
            <div className="text-right">
              <p>
                <strong>Invoice ID:</strong> {getInvoiceData?.invoiceID}
              </p>
              <p>
                <strong>Date:</strong> {date}
              </p>
            </div>
            <div className="w-full  text-left">
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
                <th className="p-2 text-sm font-medium">HSNCode</th>
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
                    key={item.ProcedureID}
                    className="border-b border-black text-center"
                  >
                    <td className="p-2 text-sm border-r border-black">
                      {index + 1}
                    </td>
                    <td className="p-2 text-sm border-r border-black">
                      {item?.procedure}
                    </td>
                    <td className="p-2 text-sm border-r border-black">
                      {item?.HSNCode}
                    </td>
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


           
          {consultation && <div className="text-red-500 animate-pulse ps-8">Patient  Consultation Fee Required</div> }
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
              className="bg-[#387ADF] px-5 py-2 mt-4 rounded-lg w-full text-white uppercase font-bold"
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

export default InvoicePage;
