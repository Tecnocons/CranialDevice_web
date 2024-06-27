import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';

const AddPathologyDialog = ({ open, onClose, onPathologyAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pathologies', {
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

      onPathologyAdded();
    } catch (error) {
      console.error('Error adding pathology:', error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Aggiungi Patologia</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Compila i seguenti campi per aggiungere una nuova patologia.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Nome"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          name="description"
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

export default AddPathologyDialog;
