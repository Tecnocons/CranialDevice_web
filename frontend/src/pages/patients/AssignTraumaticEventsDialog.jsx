import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  IconButton,
  Autocomplete,
  TextField,
  Checkbox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBox';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AssignTraumaticEventsDialog = ({ open, onClose, patient, onAssign }) => {
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [assignedEvents, setAssignedEvents] = useState([]);

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
          setAssignedEvents(data);
          setSelectedEvents(data.map(e => e.id));
        } catch (error) {
          console.error('Error fetching assigned traumatic events:', error);
        }
      };

      fetchAllEvents();
      fetchAssignedEvents();
    }
  }, [open, patient]);

  const handleAutocompleteChange = (event, newValue) => {
    const newSelectedEvents = newValue.map(e => e.id).filter((id) => {
      return !assignedEvents.some(e => e.id === id);
    });
    setSelectedEvents(newSelectedEvents);
  };

  const handleRemove = async (eventId) => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_traumatic_event', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, event_id: eventId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setAssignedEvents(prev => prev.filter(e => e.id !== eventId));
      setSelectedEvents(prev => prev.filter(id => id !== eventId));
    } catch (error) {
      console.error('Error removing traumatic event:', error);
    }
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

      const data = await response.json();
      onAssign();
      onClose();
    } catch (error) {
      console.error('Error assigning traumatic events:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assegna Eventi Traumatici a {patient && patient.nominativo}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Seleziona uno o più eventi traumatici da assegnare a questo paziente.
        </DialogContentText>
        <Autocomplete
          multiple
          options={allEvents}
          getOptionLabel={(option) => option.name}
          value={allEvents.filter(e => selectedEvents.includes(e.id) || assignedEvents.some(ae => ae.id === e.id))}
          onChange={handleAutocompleteChange}
          renderInput={(params) => <TextField {...params} label="Eventi Traumatici" placeholder="Seleziona eventi traumatici" />}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
                disabled={assignedEvents.some(e => e.id === option.id)}
              />
              {option.name}
            </li>
          )}
        />
        <Typography variant="h6" style={{ marginTop: '16px' }}>Eventi Traumatici Assegnati</Typography>
        {assignedEvents.map((event) => (
          <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>{event.name}</Typography>
            <IconButton onClick={() => handleRemove(event.id)} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        ))}
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
