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

const AssignPathologiesDialog = ({ open, onClose, patient, onAssign }) => {
  const [allPathologies, setAllPathologies] = useState([]);
  const [selectedPathologies, setSelectedPathologies] = useState([]);
  const [assignedPathologies, setAssignedPathologies] = useState([]);

  useEffect(() => {
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
        setAssignedPathologies(data);
        setSelectedPathologies(data.map(p => p.id));
      } catch (error) {
        console.error('Error fetching assigned pathologies:', error);
      }
    };

    if (open) {
      fetchAllPathologies();
      fetchAssignedPathologies();
    }
  }, [open, patient.uuid]);

  const handleAutocompleteChange = (event, newValue) => {
    const newSelectedPathologies = newValue.map(p => p.id).filter((id) => {
      return !assignedPathologies.some(p => p.id === id);
    });
    setSelectedPathologies(newSelectedPathologies);
  };

  const handleRemove = async (pathologyId) => {
    try {
      const response = await fetch('http://localhost:5000/api/patient_pathology', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ patient_uuid: patient.uuid, pathology_id: pathologyId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setAssignedPathologies(prev => prev.filter(p => p.id !== pathologyId));
      setSelectedPathologies(prev => prev.filter(id => id !== pathologyId));
    } catch (error) {
      console.error('Error removing pathology:', error);
    }
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

      const data = await response.json();
      onAssign();
      onClose();
    } catch (error) {
      console.error('Error assigning pathologies:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assegna Patologie a {patient.nominativo}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Seleziona una o più patologie da assegnare a questo paziente.
        </DialogContentText>
        <Autocomplete
          multiple
          options={allPathologies}
          getOptionLabel={(option) => option.name}
          value={allPathologies.filter(p => selectedPathologies.includes(p.id) || assignedPathologies.some(ap => ap.id === p.id))}
          onChange={handleAutocompleteChange}
          renderInput={(params) => <TextField {...params} label="Patologie" placeholder="Seleziona patologie" />}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
                disabled={assignedPathologies.some(p => p.id === option.id)}
              />
              {option.name}
            </li>
          )}
        />
        <Typography variant="h6" style={{ marginTop: '16px' }}>Patologie Assegnate</Typography>
        {assignedPathologies.map((pathology) => (
          <div key={pathology.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>{pathology.name}</Typography>
            <IconButton onClick={() => handleRemove(pathology.id)} size="small">
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

export default AssignPathologiesDialog;
