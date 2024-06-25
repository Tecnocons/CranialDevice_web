import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const AddPatientDialog = ({ open, onClose, onPatientAdded }) => {
  const { user } = useAuth();
  const [newPatient, setNewPatient] = useState({
    nominativo: '',
    eta: '',
    altezza: '',
    peso: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      console.log('Submitting patient data:', newPatient);

      const response = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newPatient),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Network response was not ok');
      }

      // Notifica il genitore che un nuovo paziente è stato aggiunto
      onPatientAdded();
      handleClose();
    } catch (error) {
      console.error('Error adding patient:', error.message);
      setError(error.message);
    }
  };

  const handleClose = () => {
    setNewPatient({
      nominativo: '',
      eta: '',
      altezza: '',
      peso: ''
    });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Aggiungi Paziente</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Compila i seguenti campi per aggiungere un nuovo paziente.
        </DialogContentText>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          autoFocus
          margin="dense"
          name="nominativo"
          label="Nominativo"
          type="text"
          fullWidth
          value={newPatient.nominativo}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="eta"
          label="Età"
          type="number"
          fullWidth
          value={newPatient.eta}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="altezza"
          label="Altezza"
          type="number"
          fullWidth
          value={newPatient.altezza}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="peso"
          label="Peso"
          type="number"
          fullWidth
          value={newPatient.peso}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Annulla
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Aggiungi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPatientDialog;
