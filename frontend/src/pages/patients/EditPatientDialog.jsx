import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem
} from '@mui/material';
import { Person as PersonIcon, CalendarToday as CalendarTodayIcon, Height as HeightIcon, FitnessCenter as FitnessCenterIcon, Wc as WcIcon, Warning as WarningIcon } from '@mui/icons-material';
import './EditPatientDialog.css';

const EditPatientDialog = ({ open, onClose, patient, onEditSubmit }) => {
  const [editedPatient, setEditedPatient] = useState({
    nominativo: '',
    eta: '',
    altezza: '',
    peso: '',
    sesso: ''
  });

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    if (patient) {
      setEditedPatient({
        nominativo: patient.nominativo,
        eta: patient.eta,
        altezza: patient.altezza,
        peso: patient.peso,
        sesso: patient.sesso
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirm = () => {
    onEditSubmit(editedPatient);
    onClose();
    setConfirmDialogOpen(false);
  };

  const handleConfirmClose = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle className="dialog-title">Modifica Paziente</DialogTitle>
        <DialogContent className="dialog-content">
          <div className="text-field-container">
            <PersonIcon className="text-field-icon" />
            <TextField
              margin="dense"
              name="nominativo"
              label="Nominativo"
              type="text"
              fullWidth
              value={editedPatient.nominativo}
              onChange={handleChange}
            />
          </div>
          <div className="text-field-container">
            <CalendarTodayIcon className="text-field-icon" />
            <TextField
              margin="dense"
              name="eta"
              label="Età"
              type="number"
              fullWidth
              value={editedPatient.eta}
              onChange={handleChange}
            />
          </div>
          <div className="text-field-container">
            <HeightIcon className="text-field-icon" />
            <TextField
              margin="dense"
              name="altezza"
              label="Altezza (cm)"
              type="number"
              fullWidth
              value={editedPatient.altezza}
              onChange={handleChange}
            />
          </div>
          <div className="text-field-container">
            <FitnessCenterIcon className="text-field-icon" />
            <TextField
              margin="dense"
              name="peso"
              label="Peso (kg)"
              type="number"
              fullWidth
              value={editedPatient.peso}
              onChange={handleChange}
            />
          </div>
          <div className="text-field-container">
            <WcIcon className="text-field-icon" />
            <TextField
              margin="dense"
              name="sesso"
              label="Sesso"
              select
              fullWidth
              value={editedPatient.sesso}
              onChange={handleChange}
            >
              <MenuItem value="maschio">Maschio</MenuItem>
              <MenuItem value="femmina">Femmina</MenuItem>
            </TextField>
          </div>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={onClose} color="primary">
            Annulla
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Salva
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={handleConfirmClose}>
        <DialogTitle>
          <WarningIcon style={{ color: 'red', marginRight: 8 }} />
          Sei sicuro di voler modificare le informazioni?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Annulla
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Conferma
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditPatientDialog;
