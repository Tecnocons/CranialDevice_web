import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';

const EditTreatmentDialog = ({ open, onClose, onEditSubmit, treatment }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (treatment) {
      setName(treatment.name);
      setDescription(treatment.description);
    }
  }, [treatment]);

  const handleEdit = async () => {
    const updatedTreatment = { ...treatment, name, description };
    await onEditSubmit(updatedTreatment);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifica Trattamento</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Aggiorna i dettagli del trattamento.
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
        <Button onClick={handleEdit} color="primary">
          Aggiorna
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTreatmentDialog;
