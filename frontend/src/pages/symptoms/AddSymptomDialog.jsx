
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

const AddSymptomDialog = ({ open, onClose, onSymptomAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      onSymptomAdded();
      onClose();
    } catch (error) {
      console.error('Error adding symptom:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Aggiungi Sintomo</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Inserisci i dettagli del nuovo sintomo.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Nome sintomo"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Descrizione sintomo"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annulla
        </Button>
        <Button onClick={handleAdd} color="primary">
          Aggiungi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSymptomDialog;
