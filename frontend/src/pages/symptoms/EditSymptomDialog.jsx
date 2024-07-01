
import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button
} from '@mui/material';

const EditSymptomDialog = ({ open, onClose, onEditSubmit, symptom }) => {
  const [editedSymptom, setEditedSymptom] = useState({
    name: symptom.name,
    description: symptom.description,
  });

  const handleEditChange = (e) => {
    setEditedSymptom({ ...editedSymptom, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = () => {
    onEditSubmit({ ...editedSymptom, id: symptom.id });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifica Sintomo</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Modifica le informazioni del sintomo {symptom?.name}.
        </DialogContentText>
        <TextField
          margin="dense"
          name="name"
          label="Nome"
          type="text"
          fullWidth
          value={editedSymptom.name}
          onChange={handleEditChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Descrizione"
          type="text"
          fullWidth
          value={editedSymptom.description}
          onChange={handleEditChange}
        />
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

export default EditSymptomDialog;
