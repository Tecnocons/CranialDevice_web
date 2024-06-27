import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';

const EditPathologyDialog = ({ open, onClose, onEditSubmit, pathology }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (pathology) {
      setName(pathology.name);
      setDescription(pathology.description);
    }
  }, [pathology]);

  const handleEdit = () => {
    onEditSubmit({ ...pathology, name, description });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifica Patologia</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Modifica i seguenti campi per aggiornare la patologia.
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
        <Button onClick={handleEdit} color="primary">
          Salva
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPathologyDialog;
