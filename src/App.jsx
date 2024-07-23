/* eslint-disable react/prop-types */
import { Route, Routes } from "react-router-dom";

// Logins
import Branch_Login from "./Pages/Common/Logins/Branch_Login";
import Employee_Login from "./Pages/Common/Logins/Employee_Login";

// Common
import AddOptions from "./Pages/Common/AddOn/Add-on";
import ListofOptions from "./Pages/Common/AddOn/Add-on-list";
import AddDoc from "./Pages/Common/Doctor/Add-Doc";
import DoctorsList from "./Pages/Common/Doctor/Doctors-List";

import Patient_invoice_report from "./Pages/Common/Report/Patient_invoice_Report";
import Consolidate_Report from "./Pages/Common/Report/Consolidated_Report";

// Reception panel
import Reception_Panel_Template from "./Pages/Reception/Template/Template";
import AddPatient from "./Pages/Reception/Patients/addPatient";
import AddInvoice from "./Pages/Reception/PatientInvoice/addInvoice";
import PatientInvoiceList from "./Pages/Reception/PatientInvoice/PatientInvoiceList";
import ReceptionHome from "./Pages/Reception/Homepage/Home";
import Patient_Master_List from "./Pages/Reception/Patients/PatientList";
import Calander from "./Pages/Reception/Appointments/Calander";
import Profile from "./Pages/Reception/Profile/Profile";
import Settings from "./Pages/Reception/Settings/Settings";

// Admin panel
import Admin_Panel_Template from "./Pages/Admin/Template/Template";
import Add_Patient from "./Pages/Admin/Patients/addPatient";
import Patient_List from "./Pages/Admin/Patients/PatientList";
import Add_Patient_Invoice from "./Pages/Admin/PatientInvoice/add_Patient_Invoice";
import Patient_Invoice_List from "./Pages/Admin/PatientInvoice/PatientInvoiceList";
import ReviewHome from "./Pages/Admin/Homepage/Home";
import Admin_Profile from "./Pages/Admin/Profile/Profile";
import Admin_Settings from "./Pages/Admin/Settings/Settings";

// Doctor panel
import Doctor_Panel_Template from "./Pages/Doctor/Template/Template";
import Doctors_Home from "./Pages/Doctor/Homepage/Home";

//Route Helper
import PublicRoute from "./RouteHelpers/PublicRoute";
import UserAuthRoute from "./RouteHelpers/UserAuthRoute";
import RoleBasedRoute from "./RouteHelpers/RolebasedProtectedRoute";
import ClinicalNote from "./components/Doctor/ClinicalNote/ClinicalNote";
import Deleted_Invoice_List from "./components/Admin/Activity/Deleted_Invoices";

import PatientProfile from "./Pages/Common/Patient_Profile/Patient_Profile";
import Appointments from "./components/Common/Patient_Profile/components/Appointments";
import Invoices from "./components/Common/Patient_Profile/components/Invoices";
import ClinicalNoteForm from "./components/Common/Patient_Profile/components/Clinical_Note_Form";
import PaymentCredits from "./components/Common/Patient_Profile/components/PaymentCredits";
import ConsentForms from "./components/Common/Patient_Profile/components/ConsentForms";
import ClinicalNoteUser from "./components/Common/Patient_Profile/components/ClinicalNote";

function App() {
  return (
    <>
      <Routes>
        {/* Branch */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Branch_Login />
            </PublicRoute>
          }
        />
        {/* User */}
        <Route
          path="/user-login"
          element={
            <UserAuthRoute>
              {" "}
              <Employee_Login />{" "}
            </UserAuthRoute>
          }
        />

        {/* Reception panel */}
        <Route
          path="/"
          element={
            <RoleBasedRoute requiredRole={import.meta.env.VITE_ROLE_USER}>
              {" "}
              <Reception_Panel_Template />{" "}
            </RoleBasedRoute>
          }
        >
          <Route index element={<ReceptionHome />} />
          <Route path="Add-Patient/" element={<AddPatient />} />
          <Route
            path="Patient-master-list/"
            element={<Patient_Master_List />}
          />
          <Route path="patient-invoice/" element={<AddInvoice />} />
          <Route
            path="Patient-Invoice-list/"
            element={<PatientInvoiceList />}
          />
          <Route path="add-Doc/" element={<AddDoc />} />
          <Route path="add-on/" element={<AddOptions />} />
          <Route path="add-on-list/" element={<ListofOptions />} />
          <Route path="Doctors-list/" element={<DoctorsList />} />
          <Route
            path="Patient-invoice-report/"
            element={<Patient_invoice_report />}
          />
          <Route path="consolidate-report/" element={<Consolidate_Report />} />
          <Route path="settings/" element={<Settings />} />
          <Route path="profile/" element={<Profile />} />
          <Route path="calendar/" element={<Calander />} />
          <Route path="Patient-Profile/:id" element={<PatientProfile />}>
            <Route path="appointments" element={<Appointments />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="clinicalNotes" element={<ClinicalNoteForm />} />
            <Route path="paymentCredits" element={<PaymentCredits />} />
            <Route path="consentForms" element={<ConsentForms />} />
          </Route>
          <Route path="help" element={<Wraper value={"Help"} />} />
        </Route>

        {/* Review panel */}
        <Route
          path="review-panel/"
          element={
            <RoleBasedRoute requiredRole={import.meta.env.VITE_ROLE_ADMIN}>
              {" "}
              <Admin_Panel_Template />{" "}
            </RoleBasedRoute>
          }
        >
          <Route index element={<ReviewHome />} />
          <Route path="add-Doc/" element={<AddDoc />} />
          <Route path="add-on/" element={<AddOptions />} />
          <Route path="add-on-list/" element={<ListofOptions />} />
          <Route path="Doctors-list/" element={<DoctorsList />} />
          <Route path="Add-Patient/" element={<Add_Patient />} />
          <Route path="Patient-master-list/" element={<Patient_List />} />
          <Route path="patient-invoice/" element={<Add_Patient_Invoice />} />
          <Route
            path="Patient-Invoice-list/"
            element={<Patient_Invoice_List />}
          />
          <Route
            path="Patient-invoice-report/"
            element={<Patient_invoice_report />}
          />
          <Route path="consolidate-report/" element={<Consolidate_Report />} />
          <Route path="deleted-invoices/" element={<Deleted_Invoice_List />} />
          <Route path="Patient-Profile/:id" element={<PatientProfile />}>
            <Route path="appointments" element={<Appointments />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="clinicalNotes" element={<ClinicalNoteUser/>} />
            <Route path="paymentCredits" element={<PaymentCredits />} />
            <Route path="consentForms" element={<ConsentForms />} />
          </Route>

          <Route path="settings/" element={<Admin_Settings />} />
          <Route path="profile/" element={<Admin_Profile />} />
          <Route path="help" element={<Wraper value={"Help"} />} />
        </Route>

        <Route
          path="doctor-panel/"
          element={
            <RoleBasedRoute requiredRole={import.meta.env.VITE_ROLE_DOCTOR}>
              {" "}
              <Doctor_Panel_Template />{" "}
            </RoleBasedRoute>
          }
        >
          <Route index element={<Doctors_Home />} />
          <Route path="patient-profile/:id" element={<PatientProfile />} />
          <Route path="ClinicalNote/" element={<ClinicalNote />} />
        </Route>
      </Routes>
    </>
  );
}
export default App;

const Wraper = ({ value }) => {
  return (
    <div className="text-2xl uppercase text-center p-10 font-Poppins font-bold">
      {value}
    </div>
  );
};
