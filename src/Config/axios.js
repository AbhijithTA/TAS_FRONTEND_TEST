import axios from "axios"; 
import Swal from "sweetalert2";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle token expiration
instance.interceptors.response.use(
  response => response,
  error => {
    console.log(error)
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Your session has expired. Please log in again.',
          confirmButtonText: 'Ok'
        }).then(() => {          
           window.location.href = '/user-login';
        });
    }
    return Promise.reject(error);
  }
);
export default instance;
