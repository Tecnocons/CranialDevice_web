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
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AssignTraumaticEventsDialog = ({ open, onClose, patient, onAssign }) => {
  const [allTraumaticEvents, setAllTraumaticEvents] = useState([]);
  const [selectedTraumaticEvents, setSelectedTraumaticEvents] = useState([]);
  const [assignedTraumaticEvents, setAssignedTraumaticEvents] = useState([]);

  useEffect(() => {
    const fetchAllTraumaticEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/traumatic_events', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAllTraumaticEvents(data);
      } catch (error) {
        console.error('Error fetching traumatic events:', error);
      }
    };

    const fetchAssignedTraumaticEvents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/patient_traumatic_event/${patient.uuid}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAssignedTraumaticEvents(data);
        setSelectedTraumaticEvents(data.map(p => p.id));
      } catch (error) {
        console.error('Error fetching assigned traumatic events:', error);
      }
    };

    if (open) {
      fetchAllTraumaticEvents();
      fetchAssignedTraumaticEvents();
    }
  }, [open, patient.uuid]);

  const handleAutocompleteChange = (event, newValue) => {
    const newSelectedTraumaticEvents = newValue.map(p => p.id).filter((id) => {
      return !assignedTraumaticEvents.some(p => p.id === id);
    });
    setSelectedTraumaticEvents(newSelectedTraumaticEvents);
  };

  const handleRemove = async (traumaticEventId) => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_traumatic_event', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, event_id: traumaticEventId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setAssignedTraumaticEvents(prev => prev.filter(p => p.id !== traumaticEventId));
      setSelectedTraumaticEvents(prev => prev.filter(id => id !== traumaticEventId));
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
        body: JSON.stringify({ patient_uuid: patient.uuid, event_ids: selectedTraumaticEvents }),
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
      <DialogTitle>Assegna Eventi Traumatici a {patient.nominativo}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Seleziona uno o più eventi traumatici da assegnare a questo paziente.
        </DialogContentText>
        <Autocomplete
          multiple
          options={allTraumaticEvents}
          getOptionLabel={(option) => option.name}
          value={allTraumaticEvents.filter(p => selectedTraumaticEvents.includes(p.id) || assignedTraumaticEvents.some(ap => ap.id === p.id))}
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
                disabled={assignedTraumaticEvents.some(p => p.id === option.id)}
              />
              {option.name}
            </li>
          )}
        />
        <Typography variant="h6" style={{ marginTop: '16px' }}>Eventi Traumatici Assegnati</Typography>
        {assignedTraumaticEvents.map((event) => (
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
