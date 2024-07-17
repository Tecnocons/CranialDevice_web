import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, TextField, FormControlLabel, Switch } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './AssignDialogs.css';

const AssignTreatmentsDialog = ({ open, onClose, patient, onAssign }) => {
  const [allTreatments, setAllTreatments] = useState([]);
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);

  useEffect(() => {
    if (patient && open) {
      const fetchAllTreatments = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/treatments', {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setAllTreatments(data);
        } catch (error) {
          console.error('Error fetching treatments:', error);
        }
      };

      const fetchAssignedTreatments = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/patient_treatment/${patient.uuid}`, {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setSelectedTreatments(data.map(t => t.id));
        } catch (error) {
          console.error('Error fetching assigned treatments:', error);
        }
      };

      fetchAllTreatments();
      fetchAssignedTreatments();
    }
  }, [open, patient]);

  const handleToggleTreatment = (treatmentId) => {
    setSelectedTreatments((prevSelected) =>
      prevSelected.includes(treatmentId)
        ? prevSelected.filter(id => id !== treatmentId)
        : [...prevSelected, treatmentId]
    );
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_treatment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, treatment_ids: selectedTreatments }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      onAssign();
      onClose();
    } catch (error) {
      console.error('Error assigning treatments:', error);
    }
  };

  const filteredTreatments = allTreatments.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    t.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0 &&
    (!showOnlyAssigned || selectedTreatments.includes(t.id))
  );

  return (
    <Dialog open={open} onClose={onClose} className="assign-dialog">
      <DialogTitle className="assign-dialog-title">Assegna Trattamenti a {patient && patient.nominativo}</DialogTitle>
      <DialogContent className="assign-dialog-content">
        <div className="search-bar">
          <SearchIcon />
          <TextField
            label="Cerca trattamenti..."
            variant="outlined"
            fullWidth
            margin="dense"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <FormControlLabel
          control={
            <Switch
              checked={showOnlyAssigned}
              onChange={(e) => setShowOnlyAssigned(e.target.checked)}
              color="primary"
            />
          }
          label="Mostra solo assegnate"
          className="assign-dialog-switch"
        />
        <DialogContentText className="assign-dialog-text">
          Trattamenti
        </DialogContentText>
        <div className="pathology-list">
          {filteredTreatments.map((treatment) => (
            <div key={treatment.id} className={`pathology-item ${selectedTreatments.includes(treatment.id) ? 'selected' : ''}`}>
              <div className="checkbox" onClick={() => handleToggleTreatment(treatment.id)}>
                {selectedTreatments.includes(treatment.id) && <span className="checkmark">✔</span>}
              </div>
              <Typography className="pathology-name">{treatment.name}</Typography>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annulla
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Conferma
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignTreatmentsDialog;
