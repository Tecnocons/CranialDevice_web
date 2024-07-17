import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, TextField, FormControlLabel, Switch } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './AssignDialogs.css';

const AssignSurgeriesDialog = ({ open, onClose, patient, onAssign }) => {
  const [allSurgeries, setAllSurgeries] = useState([]);
  const [selectedSurgeries, setSelectedSurgeries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);

  useEffect(() => {
    if (patient && open) {
      const fetchAllSurgeries = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/surgeries', {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setAllSurgeries(data);
        } catch (error) {
          console.error('Error fetching surgeries:', error);
        }
      };

      const fetchAssignedSurgeries = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/patient_surgery/${patient.uuid}`, {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setSelectedSurgeries(data.map(s => s.id));
        } catch (error) {
          console.error('Error fetching assigned surgeries:', error);
        }
      };

      fetchAllSurgeries();
      fetchAssignedSurgeries();
    }
  }, [open, patient]);

  const handleToggleSurgery = (surgeryId) => {
    setSelectedSurgeries((prevSelected) =>
      prevSelected.includes(surgeryId)
        ? prevSelected.filter(id => id !== surgeryId)
        : [...prevSelected, surgeryId]
    );
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_surgery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, surgery_ids: selectedSurgeries }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      onAssign();
      onClose();
    } catch (error) {
      console.error('Error assigning surgeries:', error);
    }
  };

  const filteredSurgeries = allSurgeries.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    s.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0 &&
    (!showOnlyAssigned || selectedSurgeries.includes(s.id))
  );

  return (
    <Dialog open={open} onClose={onClose} className="assign-dialog">
      <DialogTitle className="assign-dialog-title">Assegna Interventi a {patient && patient.nominativo}</DialogTitle>
      <DialogContent className="assign-dialog-content">
        <div className="search-bar">
          <SearchIcon />
          <TextField
            label="Cerca interventi..."
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
          Interventi
        </DialogContentText>
        <div className="pathology-list">
          {filteredSurgeries.map((surgery) => (
            <div key={surgery.id} className={`pathology-item ${selectedSurgeries.includes(surgery.id) ? 'selected' : ''}`}>
              <div className="checkbox" onClick={() => handleToggleSurgery(surgery.id)}>
                {selectedSurgeries.includes(surgery.id) && <span className="checkmark">✔</span>}
              </div>
              <Typography className="pathology-name">{surgery.name}</Typography>
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

export default AssignSurgeriesDialog;
