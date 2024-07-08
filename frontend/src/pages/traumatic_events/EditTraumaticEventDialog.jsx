import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button
} from '@mui/material';

const EditTraumaticEventDialog = ({ open, onClose, onEditSubmit, event }) => {
  const [editedEvent, setEditedEvent] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (event) {
      setEditedEvent({
        name: event.name,
        description: event.description,
      });
    }
  }, [event]);

  const handleEditChange = (e) => {
    setEditedEvent({ ...editedEvent, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = () => {
    onEditSubmit({ ...editedEvent, id: event.id });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifica Evento Traumatico</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Modifica le informazioni dell'evento traumatico {event?.name}.
        </DialogContentText>
        <TextField
          margin="dense"
          name="name"
          label="Nome"
          type="text"
          fullWidth
          value={editedEvent.name}
          onChange={handleEditChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Descrizione"
          type="text"
          fullWidth
          value={editedEvent.description}
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

export default EditTraumaticEventDialog;
