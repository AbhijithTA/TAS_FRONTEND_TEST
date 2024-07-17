/* eslint-disable react/prop-types */
import { useFormik } from 'formik';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const DateSelectionForm = ({ ModalOpen, setModalOpen, Submit }) => {
  const formik = useFormik({
    initialValues: {
      StartDate: '',
      EndDate: '',
    },
    validate: values => {
    const errors = {};
    const { StartDate, EndDate } = values;

    if (!StartDate && !EndDate) {
      return errors; // No error if both fields are empty
    }

    if (StartDate && EndDate) {       
    if ( EndDate <  StartDate) {
        errors.EndDate = 'End Date must be greater than start Date';
      }
    } else {
      errors.StartDate = 'If selecting one Date, fill both fields with the same Date';
      errors.EndDate = 'If selecting one Date, fill both fields with the same Date';
    }

    return errors;
  },
    onSubmit: values => {
      Submit(values);
      setModalOpen(false);
    },
  });


  return (
    <Dialog open={ModalOpen} onClose={() => setModalOpen(false)} 
     PaperProps={{
      style: {
        width: '400px', // set your desired width
        height: '300px', // set your desired height
        overflow: 'hidden', // optional: to prevent content overflow
      },
    }}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle> Custom Date</DialogTitle>
        <DialogContent>
        <TextField
            name="StartDate"
            label="Start Date"
            type='Date'
            variant="outlined"
            
            margin="normal"
            InputLabelProps={{
              shrink: true, // This ensures the label doesn't overlap with the date value
            }}
            value={formik.values.StartDate}
            onChange={formik.handleChange}
             
            fullWidth
            error={formik.touched.StartDate && Boolean(formik.errors.StartDate)}
            helperText={formik.touched.StartDate && formik.errors.StartDate}
          />
          <TextField
            name="EndDate"
            label="End Date"
            type='Date'
            variant="outlined"
            
            margin="normal"
            InputLabelProps={{
              shrink: true, // This ensures the label doesn't overlap with the date value
            }}
            value={formik.values.EndDate}
            onChange={formik.handleChange}
           fullWidth
            error={formik.touched.EndDate && Boolean(formik.errors.EndDate)}
            helperText={formik.touched.EndDate && formik.errors.EndDate}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary">OK</Button>
          <Button onClick={() => setModalOpen(false)} color="primary">Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DateSelectionForm;




