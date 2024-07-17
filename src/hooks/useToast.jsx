import { useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useToast = () => {
  const showToast = useCallback((message, type) => {
    // Function to format the message
    const formatMessage = msg => {
      if (typeof msg === 'object' && msg !== null) {
        return Object.entries(msg).map(([key, value]) => `${key}:- ${value}`).join(', ');
      }
      return msg;
    };

    const formattedMessage = formatMessage(message);

    if (type === 'success') {
      toast.success(formattedMessage, { position: "bottom-right" });
    } else if (type === 'error') {
      toast.error(formattedMessage, { position: "bottom-right" });
    }
  }, []);

  return showToast;
};

export default useToast;
