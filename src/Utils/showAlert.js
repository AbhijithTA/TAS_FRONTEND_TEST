import Swal from "sweetalert2";
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1) 
};
const showAlert = (title, text, icon = "info", confirmButtonText = "Okay") => {
  const capitalizedTitle = capitalize(String(title));
  const capitalizedText = capitalize(String(text));
  Swal.fire({
    title:capitalizedTitle,
    text:capitalizedText,
    icon,
    confirmButtonText,
  });
};

export default showAlert;
