import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, TextField, FormControlLabel, Switch } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './AssignDialogs.css';

const AssignSymptomsDialog = ({ open, onClose, patient, onAssign }) => {
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);

  useEffect(() => {
    if (patient && open) {
      const fetchAllSymptoms = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/symptoms', {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setAllSymptoms(data);
        } catch (error) {
          console.error('Error fetching symptoms:', error);
        }
      };

      const fetchAssignedSymptoms = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/patient_symptom/${patient.uuid}`, {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setSelectedSymptoms(data.map(s => s.id));
        } catch (error) {
          console.error('Error fetching assigned symptoms:', error);
        }
      };

      fetchAllSymptoms();
      fetchAssignedSymptoms();
    }
  }, [open, patient]);

  const handleToggleSymptom = (symptomId) => {
    setSelectedSymptoms((prevSelected) =>
      prevSelected.includes(symptomId)
        ? prevSelected.filter(id => id !== symptomId)
        : [...prevSelected, symptomId]
    );
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_symptom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, symptom_ids: selectedSymptoms }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      onAssign();
      onClose();
    } catch (error) {
      console.error('Error assigning symptoms:', error);
    }
  };

  const filteredSymptoms = allSymptoms.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    s.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0 &&
    (!showOnlyAssigned || selectedSymptoms.includes(s.id))
  );

  return (
    <Dialog open={open} onClose={onClose} className="assign-dialog">
      <DialogTitle className="assign-dialog-title">Assegna Sintomi a {patient && patient.nominativo}</DialogTitle>
      <DialogContent className="assign-dialog-content">
        <div className="search-bar">
          <SearchIcon />
          <TextField
            label="Cerca sintomi..."
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
          Sintomi
        </DialogContentText>
        <div className="pathology-list">
          {filteredSymptoms.map((symptom) => (
            <div key={symptom.id} className={`pathology-item ${selectedSymptoms.includes(symptom.id) ? 'selected' : ''}`}>
              <div className="checkbox" onClick={() => handleToggleSymptom(symptom.id)}>
                {selectedSymptoms.includes(symptom.id) && <span className="checkmark">✔</span>}
              </div>
              <Typography className="pathology-name">{symptom.name}</Typography>
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

export default AssignSymptomsDialog;
