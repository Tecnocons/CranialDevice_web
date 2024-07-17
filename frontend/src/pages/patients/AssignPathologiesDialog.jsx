import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, TextField, FormControlLabel, Switch } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './AssignDialogs.css';

const AssignPathologiesDialog = ({ open, onClose, patient, onAssign }) => {
  const [allPathologies, setAllPathologies] = useState([]);
  const [selectedPathologies, setSelectedPathologies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);

  useEffect(() => {
    if (patient && open) {
      const fetchAllPathologies = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/pathologies', {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setAllPathologies(data);
        } catch (error) {
          console.error('Error fetching pathologies:', error);
        }
      };

      const fetchAssignedPathologies = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/patient_pathology/${patient.uuid}`, {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setSelectedPathologies(data.map(p => p.id));
        } catch (error) {
          console.error('Error fetching assigned pathologies:', error);
        }
      };

      fetchAllPathologies();
      fetchAssignedPathologies();
    }
  }, [open, patient]);

  const handleTogglePathology = (pathologyId) => {
    setSelectedPathologies((prevSelected) =>
      prevSelected.includes(pathologyId)
        ? prevSelected.filter(id => id !== pathologyId)
        : [...prevSelected, pathologyId]
    );
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_pathology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, pathology_ids: selectedPathologies }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      onAssign();
      onClose();
    } catch (error) {
      console.error('Error assigning pathologies:', error);
    }
  };

  const filteredPathologies = allPathologies.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    p.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0 &&
    (!showOnlyAssigned || selectedPathologies.includes(p.id))
  );

  return (
    <Dialog open={open} onClose={onClose} className="assign-dialog">
      <DialogTitle className="assign-dialog-title">Assegna Patologie a {patient && patient.nominativo}</DialogTitle>
      <DialogContent className="assign-dialog-content">
        <div className="search-bar">
          <SearchIcon />
          <TextField
            label="Cerca patologie..."
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
          Patologie
        </DialogContentText>
        <div className="pathology-list">
          {filteredPathologies.map((pathology) => (
            <div key={pathology.id} className={`pathology-item ${selectedPathologies.includes(pathology.id) ? 'selected' : ''}`}>
              <div className="checkbox" onClick={() => handleTogglePathology(pathology.id)}>
                {selectedPathologies.includes(pathology.id) && <span className="checkmark">✔</span>}
              </div>
              <Typography className="pathology-name">{pathology.name}</Typography>
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

export default AssignPathologiesDialog;
