/* eslint-disable react/prop-types */
const TextInput = ({ type, id, name, value, onChange, placeholder }) => {
  return (
    <div>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-[#cfcdcd] focus:outline-none rounded w-full px-3 py-2"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextInput;