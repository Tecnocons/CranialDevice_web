import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';

const AddTreatmentDialog = ({ open, onClose, onTreatmentAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/treatments', {
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

      onTreatmentAdded();
    } catch (error) {
      console.error('Error adding treatment:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Aggiungi Trattamento</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Compila i campi seguenti per aggiungere un nuovo trattamento.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Nome"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Descrizione"
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

export default AddTreatmentDialog;
