import InvoiceList from "../../../components/Admin/PatientInvoice/listInvoce"

const Patient_Invoice_List = () => {
  return (
    <div> 
      <InvoiceList refresh={false} setRefresh={()=>{}} list={20}/>
    </div>
  )
}

export default Patient_Invoice_List
