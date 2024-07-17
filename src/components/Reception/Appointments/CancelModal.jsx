import { useEffect, useRef, useState } from "react";
import useToast from "../../../hooks/useToast";

 
/* eslint-disable react/prop-types */ 
 const CancelModal =  ({ showModal, setShowModal,id,Cancel_appoinment }) => {
  const [defaultReason, setDefaultReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const tost = useToast()

  const textareaRef = useRef(null);

  useEffect(() => {
    if (defaultReason !== 'Other') {
      setCustomReason('');
      if (textareaRef.current) {
        textareaRef.current.disabled = true;
      }
    } else {
      if (textareaRef.current) {
        textareaRef.current.disabled = false;
      }
    }
  }, [defaultReason]);

 
    
    
    const closeModal = (e) => {
        if (e.target.id === "modal-backdrop_4") {
          setShowModal(false);
        }
      };
    
      // Function to stop event propagation from modal content
      const stopPropagation = (e) => {
        e.stopPropagation();
      };
    
      const onHandleSubmit =(id)=>{ 
        if(!(customReason || defaultReason)){
          return tost("Reason required","error")
        }
        const finalReason = defaultReason === 'Other' ? customReason : defaultReason; 
        Cancel_appoinment(finalReason,id);   
        setCustomReason('');
       
      }
     
      
  return (
    <div>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none "
            onClick={closeModal}
            id="modal-backdrop_4"
          >
            <div
              className="relative  my-6 mx-auto w-[75%] max-w-3xl "
              onClick={stopPropagation}
            >
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="p-1">
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-[#6a696977] float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>
                {/*body*/}
                <div className="relative px-10 pb-10 flex-auto  bg-white rounded-xl">
                  <div className="flex flex-col gap-8 ">
                    <h1 className="text-2xl font-bold">Enter Reason for Cancel</h1>
                   <hr />
                   {/* <input type="text"  /> */}
                   <label htmlFor="reason_1" className="font-bold text-lg mx-0"> <input className="mr-2"  onChange={(e) => setDefaultReason(e.target.value)} type="radio" id="reason_1" name="reason" value={'Not disclosed'} />  Not disclosed</label>
                   <label htmlFor="reason_1" className="font-bold text-lg mx-0"> <input className="mr-2"  onChange={(e) => setDefaultReason(e.target.value)} type="radio" id="reason_1" name="reason" value={'By Mistake'} />By Mistake</label>
                   <label htmlFor="reason_2" className="font-bold text-lg mx-0"> <input className="mr-2"  onChange={(e) => setDefaultReason(e.target.value)} type="radio" id="reason_2" name="reason" value={'Miscommunication About Appointment Time'} /> Miscommunication About Appointment Time</label>
                   <label htmlFor="reason_3" className="font-bold text-lg mx-0"> <input className="mr-2"  onChange={(e) => setDefaultReason(e.target.value)} type="radio" id="reason_3" name="reason" value={'Procedure No Longer Needed'} /> Procedure No Longer Needed</label>
                   <label htmlFor="reason_4" className="font-bold text-lg mx-0"> <input className="mr-2"  onChange={(e) => setDefaultReason(e.target.value)} type="radio" id="reason_4" name="reason" value={'Personal Emergency'} /> Personal Emergency</label>
                   <label htmlFor="reason_5" className="font-bold text-lg mx-0"> <input className="mr-2"  onChange={(e) => setDefaultReason(e.target.value)} type="radio" id="reason_5" name="reason" value={'Other'} /> Other</label>
                   <textarea className="border outline-none p-2" ref={textareaRef} name="reason" id="reason" value={customReason}  onChange={(e)=>{setCustomReason(e.target.value)}} rows="5" ></textarea>
                  <div className="flex justify-end items-center gap-4">

                  <button onClick={()=>{ setShowModal(false);}} className="border w-fit px-3 text-xl font-bold rounded py-2 bg-slate-300">Cancel</button>
                  <button onClick={()=>{onHandleSubmit(id)}} className="border w-fit px-3 text-xl font-bold rounded py-2 bg-yellow-500">Cancel Appointment</button>
                  </div>
                    
                        
                         
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-40 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  )
}


export default CancelModal;
