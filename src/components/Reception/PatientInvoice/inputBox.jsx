/* eslint-disable react/prop-types */
const InputBox = ({value,onChange,name,type,label,classname,...props}) => { 
  return (
   <div className={classname}>
     <div className="relative">
    <label
      htmlFor={name}
      className={`block text-base font-normal text-gray-600 absolute truncate -top-3 left-3 bg-white px-1  `}
    >
      {label}
    </label>
    <input 
      name={name}
        type={type}
      className={`block w-full py-4 px-4 rounded-md text-base border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          "border-gray-400"
      } mt-2`}
      value={value} 
      {...props}      
      onChange={(e) => onChange(name, Number(e.target.value))}
      placeholder=" "
    /> 
  </div>
   </div>
  )
}

export default InputBox
