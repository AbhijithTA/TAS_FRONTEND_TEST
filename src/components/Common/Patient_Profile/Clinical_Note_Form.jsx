import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from '@mui/material';

const ClinicalNoteForm = ({ isOpen, onClose, formData, setFormData, onSubmit }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.chiefComplaint) newErrors.chiefComplaint = 'Chief Complaint is required';
    if (!formData.historyOfPresentingIllness) newErrors.historyOfPresentingIllness = 'History of Presenting Illness is required';
    if (!formData.pastMedicalHistory) newErrors.pastMedicalHistory = 'Past Medical History is required';
    if (!formData.notes) newErrors.notes = 'Notes are required';
    if (!formData.allergies) newErrors.allergies = 'Allergies are required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      onSubmit(formData);
      setFormData({
        date: '',
        chiefComplaint: '',
        historyOfPresentingIllness: '',
        pastMedicalHistory: '',
        notes: '',
        allergies: '',
      });
      setErrors({});
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle >Clinical Note Form</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                name="date"
                label="Date"
                value={formData.date}
                onChange={handleChange}
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="text"
                name="chiefComplaint"
                label="Chief Complaint"
                value={formData.chiefComplaint}
                onChange={handleChange}
                error={!!errors.chiefComplaint}
                helperText={errors.chiefComplaint}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="text"
                name="historyOfPresentingIllness"
                label="History of Presenting Illness"
                value={formData.historyOfPresentingIllness}
                onChange={handleChange}
                error={!!errors.historyOfPresentingIllness}
                helperText={errors.historyOfPresentingIllness}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="text"
                name="pastMedicalHistory"
                label="Past Medical History"
                value={formData.pastMedicalHistory}
                onChange={handleChange}
                error={!!errors.pastMedicalHistory}
                helperText={errors.pastMedicalHistory}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="notes"
                label="Notes"
                value={formData.notes}
                onChange={handleChange}
                error={!!errors.notes}
                helperText={errors.notes}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="text"
                name="allergies"
                label="Allergies"
                value={formData.allergies}
                onChange={handleChange}
                error={!!errors.allergies}
                helperText={errors.allergies}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button variant='contained' onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClinicalNoteForm;
