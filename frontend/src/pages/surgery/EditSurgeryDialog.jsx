import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';

const EditSurgeryDialog = ({ open, onClose, onEditSubmit, surgery }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (surgery) {
      setName(surgery.name);
      setDescription(surgery.description);
    }
  }, [surgery]);

  const handleEdit = async () => {
    try {
      await onEditSubmit({ ...surgery, name, description });
      onClose();
    } catch (error) {
      console.error('Error editing surgery:', error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifica Intervento</DialogTitle>
      <DialogContent>
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
        <Button onClick={handleEdit} color="primary">
          Salva
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSurgeryDialog;
