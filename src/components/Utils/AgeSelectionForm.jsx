/* eslint-disable react/prop-types */
import { useFormik } from 'formik';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const AgeSelectionForm = ({ ModalOpen, setModalOpen, Submit }) => {
  const formik = useFormik({
    initialValues: {
      StartAge: '',
      EndAge: '',
    },
    validate: values => {
    const errors = {};
    const { StartAge, EndAge } = values;

    if (!StartAge && !EndAge) {
      return errors; // No error if both fields are empty
    }

    if (StartAge && EndAge) {
      if (isNaN(StartAge) || isNaN(EndAge)) {
        errors.StartAge = 'Both ages must be numbers';
        errors.EndAge = 'Both ages must be numbers';
      } else if (Number(EndAge) < Number(StartAge)) {
        errors.EndAge = 'End age must be greater than start age';
      }
    } else {
      errors.StartAge = 'If selecting one age, fill both fields with the same age';
      errors.EndAge = 'If selecting one age, fill both fields with the same age';
    }

    return errors;
  },
    onSubmit: values => {
      Submit(values);
      setModalOpen(false);
    },
  });


  return (
    <Dialog open={ModalOpen} onClose={() => setModalOpen(false)}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Set Age Range</DialogTitle>
        <DialogContent>
        <TextField
            name="StartAge"
            label="Start Age"
            value={formik.values.StartAge}
            onChange={formik.handleChange}
            margin="dense"
            fullWidth
            error={formik.touched.StartAge && Boolean(formik.errors.StartAge)}
            helperText={formik.touched.StartAge && formik.errors.StartAge}
          />
          <TextField
            name="EndAge"
            label="End Age"
            value={formik.values.EndAge}
            onChange={formik.handleChange}
            margin="dense"
            fullWidth
            error={formik.touched.EndAge && Boolean(formik.errors.EndAge)}
            helperText={formik.touched.EndAge && formik.errors.EndAge}
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

export default AgeSelectionForm;




