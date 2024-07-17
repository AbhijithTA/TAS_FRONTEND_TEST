/* eslint-disable react/prop-types */
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  showPassword,
  togglePasswordVisibility,
  placeholder,
  className,
}) => {
  return (
    <div className={`relative  ${className}`}>
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`border rounded border-[#cfcdcd] focus:outline-none w-full px-3 py-2 `}
        placeholder={placeholder}
      />
      {togglePasswordVisibility && (
        <button
          type="button"
          className="absolute right-0 bottom-3 mt-3 mr-4"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );
};

export default PasswordInput;