import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  MenuItem
} from '@mui/material';

const EditPatientDialog = ({ open, onClose, onEditSubmit, patient }) => {
  const [editedPatient, setEditedPatient] = useState({
    nominativo: patient.nominativo,
    eta: patient.eta,
    altezza: patient.altezza,
    peso: patient.peso,
    sesso: patient.sesso, // Aggiungi questo campo
  });

  const handleEditChange = (e) => {
    setEditedPatient({ ...editedPatient, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = () => {
    onEditSubmit({ ...editedPatient, uuid: patient.uuid });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifica Paziente</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Modifica le informazioni del paziente {patient?.nominativo}.
        </DialogContentText>
        <TextField
          margin="dense"
          name="nominativo"
          label="Nominativo"
          type="text"
          fullWidth
          value={editedPatient.nominativo}
          onChange={handleEditChange}
        />
        <TextField
          margin="dense"
          name="eta"
          label="Età"
          type="number"
          fullWidth
          value={editedPatient.eta}
          onChange={handleEditChange}
        />
        <TextField
          margin="dense"
          name="altezza"
          label="Altezza"
          type="number"
          fullWidth
          value={editedPatient.altezza}
          onChange={handleEditChange}
        />
        <TextField
          margin="dense"
          name="peso"
          label="Peso"
          type="number"
          fullWidth
          value={editedPatient.peso}
          onChange={handleEditChange}
        />
        <TextField
          margin="dense"
          name="sesso"
          label="Sesso"
          select
          fullWidth
          value={editedPatient.sesso}
          onChange={handleEditChange}
        >
          <MenuItem value="maschio">Maschio</MenuItem>
          <MenuItem value="femmina">Femmina</MenuItem>
          <MenuItem value="altro">Altro</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annulla
        </Button>
        <Button onClick={handleEditSubmit} color="primary">
          Salva
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPatientDialog;
