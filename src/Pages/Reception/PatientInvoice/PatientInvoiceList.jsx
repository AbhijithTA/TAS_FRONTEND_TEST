import InvoiceList from "../../../components/Reception/PatientInvoice/listInvoce"

const PatientInvoiceList = () => {
  return (
    <div>
      <InvoiceList setRefresh={()=>{}} refresh={false}  list={20}/>
    </div>
  )
}

export default PatientInvoiceList
