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

const EditPatientDialog = ({ open, onClose, patient, onEditSubmit }) => {
  const [editedPatient, setEditedPatient] = useState({
    nominativo: '',
    eta: '',
    altezza: '',
    peso: '',
    sesso: ''
  });

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
    onEditSubmit(editedPatient);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifica Paziente</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="nominativo"
          label="Nominativo"
          type="text"
          fullWidth
          value={editedPatient.nominativo}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="eta"
          label="Età"
          type="number"
          fullWidth
          value={editedPatient.eta}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="altezza"
          label="Altezza (cm)"
          type="number"
          fullWidth
          value={editedPatient.altezza}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="peso"
          label="Peso (kg)"
          type="number"
          fullWidth
          value={editedPatient.peso}
          onChange={handleChange}
        />
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annulla
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Salva
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPatientDialog;
