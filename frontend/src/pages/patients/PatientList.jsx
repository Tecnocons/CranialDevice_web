import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Link,
  TablePagination,
  TextField,
  Collapse,
  Grid,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../contexts/AuthContext';
import { ClipLoader } from 'react-spinners';
import AddPatientDialog from './AddPatientDialog';
import EditPatientDialog from './EditPatientDialog';
import BackgroundWrapper from '../../components/BackgroundWrapper'; // Importa BackgroundWrapper
import './PatientList.css';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f5f5f5',
  opacity: 0.9,
  padding: '20px',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  opacity: 0.9,
  width: '100%',
  backgroundColor: '#ffffff',
  boxShadow: '0 0 10px rgba(21, 86, 119, 0.5)',
  '& .MuiTableCell-head': {
    backgroundColor: '#e0e0e0',
    fontWeight: 'bold',
    fontSize: 21,
  },
  '& .MuiTableCell-body': {
    fontSize: 14, // Adjusted font size for table body
  },
  '& .MuiTableRow-root .MuiTableCell-root': {
    borderBottom: '1px solid #e0e0e0',
    borderRight: '1px solid #e0e0e0',
    fontFamily: 'Arial, sans-serif',
  },
  '& .MuiTableRow-root:last-child .MuiTableCell-root': {
    borderBottom: '2px solid #155677',
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiTableCell-head': {
      fontSize: 16,
    },
    '& .MuiTableCell-body': {
      fontSize: 12,
    },
  },
}));

const Header = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: 10,
});

const AddButton = styled(Button)({
  backgroundColor: '#155677',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#0d3e4f',
  },
});

const FilterBox = styled(Box)(({ theme }) => ({
  width: '90%',
  minHeight: '8vw',
  maxHeight: '8vw',
  padding: '10px',
  borderRadius: '18px',
  backgroundColor: '#f9f9f9',
  opacity: 0.95,
  boxShadow: '0 0 10px rgba(21, 86, 119, 0.5)',
  overflow: 'hidden',
  transition: 'max-height 0.3s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const FilterBoxExpanded = styled(FilterBox)({
  maxHeight: '470px',
  minHeight: '470px',
});

const FilterHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 'auto',
});

const PatientListContainer = styled(Container)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(21, 86, 119, 0.5)',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  width: '90%',
  height: 'auto',
  backgroundColor: '#155677',
  color: '#fff',
  padding: '10px',
  borderRadius: '8px',
  textAlign: 'center',
  marginBottom: '10px',
  marginTop: '-13px',
 // opacity: 1,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: '5px',
    fontSize: '1rem',
  },
}));

function PatientList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showLoading, hideLoading, isLoading } = useLoading(); // Use the loading context
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [ageRange, setAgeRange] = useState({ min: '', max: '' });
  const [weightRange, setWeightRange] = useState({ min: '', max: '' });
  const [heightRange, setHeightRange] = useState({ min: '', max: '' });
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    showLoading();
    const fetchPatients = async () => {
      if (!user) return;

      try {
        const endpoint = user.isAdmin ? '/api/patients' : `/api/patients/assigned?doctor_name=${user.name}`;
        const response = await fetch(`http://localhost:5000${endpoint}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        setError(error.message);
      } finally {
        hideLoading();
      }
    };
    fetchPatients();
  }, [user, showLoading, hideLoading]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (uuids) => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients/bulk_delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ uuids }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message);
      }

      setPatients((prevPatients) => prevPatients.filter((patient) => !uuids.includes(patient.uuid)));
      setDeleteDialogOpen(false);
      setSelectedPatients([]);
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error deleting patient:', error.message);
    }
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handlePatientAdded = () => {
    setAddDialogOpen(false);
    const fetchPatients = async () => {
      showLoading();
      try {
        const endpoint = user.isAdmin ? '/api/patients' : `/api/patients/assigned?doctor_name=${user.name}`;
        const response = await fetch(`http://localhost:5000${endpoint}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        setError(error.message);
      } finally {
        hideLoading();
      }
    };
    fetchPatients();
  };

  const handleEditDialogOpen = (patient) => {
    setSelectedPatient(patient);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleEditSubmit = async (updatedPatient) => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedPatient),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.uuid === updatedPatient.uuid ? { ...patient, ...updatedPatient } : patient
        )
      );
      setEditDialogOpen(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error updating patient:', error.message);
    }
  };

  const handleDeleteDialogOpen = (patient) => {
    setSelectedPatient(patient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleSelectPatient = (uuid) => {
    if (selectedPatients.includes(uuid)) {
      setSelectedPatients(selectedPatients.filter((id) => id !== uuid));
    } else {
      setSelectedPatients([...selectedPatients, uuid]);
    }
  };

  const isSelected = (uuid) => selectedPatients.includes(uuid);

  const handleSelectAllPatients = (event) => {
    if (event.target.checked) {
      const newSelecteds = patients.map((patient) => patient.uuid);
      setSelectedPatients(newSelecteds);
    } else {
      setSelectedPatients([]);
    }
  };

  const isAllSelected = selectedPatients.length === patients.length;

  const handleMultipleDelete = () => {
    setDeleteDialogOpen(true);
    setSelectedPatient(null);
  };

  const handlePatientInfoOpen = (patient) => {
    navigate(`/patients/${patient.uuid}`);
  };

  const handleFilterChange = (e) => {
    setNameFilter(e.target.value);
  };

  const handleRangeChange = (e, rangeType) => {
    const { name, value } = e.target;
    if (rangeType === 'age') {
      setAgeRange((prev) => ({ ...prev, [name]: value }));
    } else if (rangeType === 'weight') {
      setWeightRange((prev) => ({ ...prev, [name]: value }));
    } else if (rangeType === 'height') {
      setHeightRange((prev) => ({ ...prev, [name]: value }));
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesName = patient.nominativo.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesAge =
      (ageRange.min === '' || patient.eta >= ageRange.min) &&
      (ageRange.max === '' || patient.eta <= ageRange.max);
    const matchesWeight =
      (weightRange.min === '' || patient.peso >= weightRange.min) &&
      (weightRange.max === '' || patient.peso <= weightRange.max);
    const matchesHeight =
      (heightRange.min === '' || patient.altezza >= heightRange.min) &&
      (heightRange.max === '' || patient.altezza <= heightRange.max);
    return matchesName && matchesAge && matchesWeight && matchesHeight;
  });

  if (isLoading) {
    return (
      <Root>
        <Box display="flex" flexDirection="column" alignItems="center">
          <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
          <Typography variant="h6" style={{ marginTop: '20px' }}>Loading...</Typography>
        </Box>
      </Root>
    );
  }

  if (error) {
    return (
      <Root>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" color="error">Error: {error}</Typography>
          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>Retry</Button>
        </Box>
      </Root>
    );
  }

  return (
    <BackgroundWrapper>
      <Root>
        <HeaderContainer>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            style={{ textShadow: '-1px 0 #000000, 0 1px #000000, 1px 0 #000000, 0 -1px #000000' }}
          >
            Lista Pazienti
          </Typography>
        </HeaderContainer>
        <Box display="flex" justifyContent="center" width="100%" flexWrap="wrap">
          <PatientListContainer component={Paper} className="table-container">
            <Header>
              <IconButton onClick={() => navigate('/main')}>
                <CloseIcon />
              </IconButton>
              {user && (
                <AddButton
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddDialogOpen}
                >
                  Aggiungi Paziente
                </AddButton>
              )}
            </Header>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>Nominativo</TableCell>
                  <TableCell>Età</TableCell>
                  <TableCell>Altezza</TableCell>
                  <TableCell>Peso</TableCell>
                  <TableCell>Dottore</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => (
                  <TableRow key={patient.uuid}>
                    <TableCell>
                      <Link
                        component="button"
                        onClick={() => handlePatientInfoOpen(patient)}
                        sx={{ color: 'black', fontSize: '18px', textDecoration: 'underline' }} // Change the color to black, underline and increase font size
                      >
                        {patient.nominativo}
                      </Link>
                    </TableCell>
                    <TableCell>{patient.eta}</TableCell>
                    <TableCell>{patient.altezza}</TableCell>
                    <TableCell>{patient.peso}</TableCell>
                    <TableCell>{patient.doctor_name}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditDialogOpen(patient)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteDialogOpen(patient)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={filteredPatients.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </PatientListContainer>
          <Box width="20%" flexShrink={0}>
            <FilterBox className={filtersOpen ? 'expanded' : ''}>
              <TextField
                placeholder="Search..."
                autoComplete='off'
                value={nameFilter}
                onChange={handleFilterChange}
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  style: {
                    backgroundColor: '#fff',
                    borderRadius: '18px',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#155677',
                    },
                    '&:hover fieldset': {
                      borderColor: '#155677',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#155677',
                    },
                  },
                }}
              />
              <FilterHeader>
                <Typography variant="subtitle1">Altri Filtri</Typography>
                <IconButton onClick={() => setFiltersOpen(!filtersOpen)}>
                  {filtersOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </FilterHeader>
              <Collapse in={filtersOpen}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Età Minima"
                      name="min"
                      value={ageRange.min}
                      onChange={(e) => handleRangeChange(e, 'age')}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Età Massima"
                      name="max"
                      value={ageRange.max}
                      onChange={(e) => handleRangeChange(e, 'age')}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Peso Minimo"
                      name="min"
                      value={weightRange.min}
                      onChange={(e) => handleRangeChange(e, 'weight')}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Peso Massimo"
                      name="max"
                      value={weightRange.max}
                      onChange={(e) => handleRangeChange(e, 'weight')}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Altezza Minima"
                      name="min"
                      value={heightRange.min}
                      onChange={(e) => handleRangeChange(e, 'height')}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Altezza Massima"
                      name="max"
                      value={heightRange.max}
                      onChange={(e) => handleRangeChange(e, 'height')}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </FilterBox>
          </Box>
        </Box>
        <AddPatientDialog open={addDialogOpen} onClose={handleAddDialogClose} onPatientAdded={handlePatientAdded} />
        {selectedPatient && (
          <EditPatientDialog
            open={editDialogOpen}
            onClose={handleEditDialogClose}
            onEditSubmit={handleEditSubmit}
            patient={selectedPatient}
          />
        )}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Conferma Eliminazione</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedPatient
                ? `Sei sicuro di voler eliminare il paziente ${selectedPatient.nominativo}?`
                : 'Sei sicuro di voler eliminare i pazienti selezionati?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Annulla
            </Button>
            <Button onClick={() => handleDelete(selectedPatient ? [selectedPatient.uuid] : selectedPatients)} color="primary">
              Elimina
            </Button>
          </DialogActions>
        </Dialog>
      </Root>
    </BackgroundWrapper>
  );
}

export default PatientList;
