import PatientProfile from "../../../components/Common/Patient_Profile/Patient_Profile"
import {useParams } from "react-router-dom";
const Patient_Profile = () => {
    const { id } = useParams();
    const branch = localStorage.getItem("branch");
    const BranchID = branch?.split(",")[1];
    return(<PatientProfile id={id} BranchID={BranchID}/>)
}

export default Patient_Profile
