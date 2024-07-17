import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, TextField, FormControlLabel, Switch } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './AssignDialogs.css';

const AssignTraumaticEventsDialog = ({ open, onClose, patient, onAssign }) => {
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);

  useEffect(() => {
    if (patient && open) {
      const fetchAllEvents = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/traumatic_events', {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setAllEvents(data);
        } catch (error) {
          console.error('Error fetching traumatic events:', error);
        }
      };

      const fetchAssignedEvents = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/patient_traumatic_event/${patient.uuid}`, {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setSelectedEvents(data.map(e => e.id));
        } catch (error) {
          console.error('Error fetching assigned traumatic events:', error);
        }
      };

      fetchAllEvents();
      fetchAssignedEvents();
    }
  }, [open, patient]);

  const handleToggleEvent = (eventId) => {
    setSelectedEvents((prevSelected) =>
      prevSelected.includes(eventId)
        ? prevSelected.filter(id => id !== eventId)
        : [...prevSelected, eventId]
    );
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_traumatic_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, event_ids: selectedEvents }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      onAssign();
      onClose();
    } catch (error) {
      console.error('Error assigning traumatic events:', error);
    }
  };

  const filteredEvents = allEvents.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    e.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0 &&
    (!showOnlyAssigned || selectedEvents.includes(e.id))
  );

  return (
    <Dialog open={open} onClose={onClose} className="assign-dialog">
      <DialogTitle className="assign-dialog-title">Assegna Eventi Traumatici a {patient && patient.nominativo}</DialogTitle>
      <DialogContent className="assign-dialog-content">
        <div className="search-bar">
          <SearchIcon />
          <TextField
            label="Cerca eventi traumatici..."
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
          Eventi Traumatici
        </DialogContentText>
        <div className="pathology-list">
          {filteredEvents.map((event) => (
            <div key={event.id} className={`pathology-item ${selectedEvents.includes(event.id) ? 'selected' : ''}`}>
              <div className="checkbox" onClick={() => handleToggleEvent(event.id)}>
                {selectedEvents.includes(event.id) && <span className="checkmark">✔</span>}
              </div>
              <Typography className="pathology-name">{event.name}</Typography>
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

export default AssignTraumaticEventsDialog;
