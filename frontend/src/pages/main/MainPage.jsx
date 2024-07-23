import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardHeader, Button, Box, Dialog, DialogTitle, DialogContent, Slide, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../contexts/AuthContext';
import { Bar } from 'react-chartjs-2';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import mqtt from 'mqtt';
import LatestMeasurementModal from './LatestMeasurementModal'; // Importa il componente modale
import './MainPage.css';
import SensorsIcon from '@mui/icons-material/Sensors'; 
import statusDeviceImage from '../../assets/status_device.png';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const primaryColor = '#EB873F';
const darkPrimaryColor = '#CF6F2E';

const StyledButton = styled(Button)({
  backgroundColor: primaryColor,
  '&:hover': {
    backgroundColor: darkPrimaryColor,
  },
  textShadow: '-0.2px 0 #000000, 0 0.2px #000000, 0.2px 0 #000000, 0 -0.2px #000000',
  color: '#FFFFFF',
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MainPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [monthlyMeasurements, setMonthlyMeasurements] = useState(new Array(12).fill(0));
  const [modalOpen, setModalOpen] = useState(false);
  const [sensorModalOpen, setSensorModalOpen] = useState(false);
  const [sensorStatus, setSensorStatus] = useState({});
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      { data: [], label: 'Forza (N)', borderColor: 'rgba(75,192,192,1)', borderWidth: 2, fill: false },
      { data: [], label: 'Spostamento (mm)', borderColor: 'rgba(192,75,75,1)', borderWidth: 2, fill: false },
      { data: [], label: 'Pressione (bar)', borderColor: 'rgba(75,75,192,1)', borderWidth: 2, fill: false },
      { data: [], label: 'Contropressione (bar)', borderColor: 'rgba(75,192,75,1)', borderWidth: 2, fill: false },
    ]
  });
  const [latestMeasurementOpen, setLatestMeasurementOpen] = useState(false); // Stato per la finestra modale

  const brokerUrl = process.env.REACT_APP_MQTT_BROKER_URL;
  const username = process.env.REACT_APP_MQTT_BROKER_USERNAME;
  const password = process.env.REACT_APP_MQTT_BROKER_PASSWORD;

  const fetchMeasurements = async () => {
    if (!user || !user.uuid) return;

    try {
      const endpoint = user.isAdmin 
        ? 'http://localhost:5000/api/measurements/all'
        : `http://localhost:5000/api/doctor_measurements/${user.uuid}`;

      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      const measurementsCount = new Array(12).fill(0);
      const measurementIdsByMonth = new Array(12).fill(null).map(() => new Set());

      data.forEach((measurement) => {
        const month = new Date(measurement.timestamp).getMonth();
        const measurementId = measurement.measurement_id;

        if (!measurementIdsByMonth[month].has(measurementId)) {
          measurementIdsByMonth[month].add(measurementId);
          measurementsCount[month] += 1;
        }
      });

      setMonthlyMeasurements(measurementsCount);
    } catch (error) {
      console.error('Error fetching measurements:', error);
    }
  };

  useEffect(() => {
    if (user && user.uuid) {
      fetchMeasurements();
    }
  }, [user]);

  const handleOpenModal = async () => {
    console.log('handleOpenModal called');
    console.log('Current user object:', user); // Debug statement
  
    if (!user || !user.uuid) {
      console.error('User ID is missing');
      return;
    }
  
    setLatestMeasurementOpen(true); // Apri la finestra modale
  };
  
  const handleCloseModal = () => {
    setLatestMeasurementOpen(false); // Chiudi la finestra modale
  };

  const handleCheckStatus = () => {
    if (!user || !user.helmetId) {
      console.error('Helmet ID is missing');
      return;
    }

    const options = { username, password, reconnectPeriod: 1000 };
    const client = mqtt.connect(brokerUrl, options);
    const timeout = setTimeout(() => {
      setSensorStatus({ error: "Helmet not connected" });
      client.end(); // Close the connection if no response
    }, 5000); // 5 seconds timeout

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe(`caschetto/${user.helmetId}/status`, (err) => {
        if (!err) {
          client.publish(`caschetto/${user.helmetId}/check_status`, 'check');
        }
      });
    });

    client.on('message', (topic, message) => {
      if (topic === `caschetto/${user.helmetId}/status`) {
        const status = JSON.parse(message.toString());
        setSensorStatus(status);
        clearTimeout(timeout); // Clear the timeout if response is received
        client.end(); // Close the connection after receiving the status
        setSensorModalOpen(true); // Open modal with sensor status
      }
    });

    client.on('error', (err) => {
      console.error('Connection error:', err);
      clearTimeout(timeout);
    });

    client.on('close', () => {
      console.log('Connection to MQTT broker closed');
      clearTimeout(timeout);
    });

    client.on('offline', () => {
      console.log('MQTT client offline');
      clearTimeout(timeout);
    });

    client.on('reconnect', () => {
      console.log('Reconnecting to MQTT broker...');
      clearTimeout(timeout);
    });
  };

  const handleCloseSensorModal = () => {
    setSensorModalOpen(false);
  };

  const renderStatusWithLED = (status) => {
    const isOk = status.toUpperCase() === 'OK';
    return (
      <Box display="flex" alignItems="center">
        <Typography variant="body1" style={{ fontWeight: 'bold', marginRight: '10px' }}>
          {status.toUpperCase()}
        </Typography>
        {isOk ? (
          <CheckCircleIcon style={{ color: 'green' }} />
        ) : (
          <CancelIcon style={{ color: 'red' }} />
        )}
      </Box>
    );
  };

  const data = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Treatments',
        backgroundColor: '#155677',
        borderColor: '#123456',
        borderWidth: 2,
        hoverBackgroundColor: '#123456',
        hoverBorderColor: '#123456',
        data: monthlyMeasurements,
      }
    ]
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div className="mainpage-container">
      <Container>
        <div className="header">
          <Typography variant="h4" component="h1" className="header-title">
            Main Page
          </Typography>
          <Typography className="header-subtitle">
            {user.isAdmin ? 'Welcome, Admin! You have full access.' : 'Welcome, User! Your access is limited.'}
          </Typography>
        </div>

        <Box className="wide-container">
          <Typography variant="h5" component="h2" className="header-title">
            Benvenuto nella sezione informativa
          </Typography>
        </Box>

        <Grid container spacing={3} className="grid">
          <Grid item xs={12} sm={6} md={6} className="grid-item">
            <Card className="card">
              <CardHeader title="Lista Pazienti" className="card-title" />
              <CardContent>
                <Typography variant="body2" className="card-text">
                  Visualizza la lista dei pazienti...
                </Typography>
                <StyledButton variant="contained" className="btn" onClick={() => navigate('/patients')}>
                  Dettagli
                </StyledButton>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={6} className="grid-item">
            <Card className="card">
              <CardHeader title="Ultima Misurazione" className="card-title" />
              <CardContent>
                <Typography variant="body2" className="card-text">
                  Visualizza l'ultima misurazione effettuata...
                </Typography>
                <StyledButton variant="contained" className="btn" onClick={handleOpenModal}>
                  Dettagli
                </StyledButton>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={12} md={12} className="grid-item">
            <Card className="card">
              <CardHeader title="Treatment Chart" className="card-title" />
              <CardContent>
                <Bar
                  data={data}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      }
                    }
                  }}
                  height={200}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <div className="btn-toolset-container">
          <div className="btn-toolset" onClick={handleCheckStatus}>
            <SensorsIcon className="btn-icon" />
            <span className="btn-text">Check Device Status</span>
          </div>
        </div>
      </Container>
      <Dialog
        open={sensorModalOpen}
        onClose={handleCloseSensorModal}
        maxWidth={false}
        TransitionComponent={Transition}
        className="modal-animate"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" padding="8px 16px">
          <IconButton edge="start" color="inherit" onClick={handleCloseSensorModal} aria-label="close">
            <CloseIcon />
          </IconButton>
          <DialogTitle className="dialog-title">Stato dei Sensori</DialogTitle>
          <span></span> {/* Placeholder to align the title to center */}
        </Box>
        <hr className="divider" />
        <DialogContent style={{ maxHeight: '80vh', minWidth: '50vh', display: 'flex', justifyContent: 'space-between', padding: '20px 20px', borderRadius: '20px' }}>
          <Box display="flex" flexDirection="column" style={{ width: '60%' }}>
            {Object.keys(sensorStatus).length > 0 && (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {Object.keys(sensorStatus).map((sensor, index) => (
                  <Box key={index} className="status-box">
                    <li style={{ textAlign: 'left', marginBottom: '10px', fontSize: '1.2em' }}>
                      {sensor}:<br /> {renderStatusWithLED(sensorStatus[sensor])}
                    </li>
                  </Box>
                ))}
              </ul>
            )}
          </Box>
          <Box style={{ width: '48%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '1px' }}>
            <img src={statusDeviceImage} alt="Sensor Status" style={{ width: '100%', height: 'auto', opacity: '0.9' }} />
          </Box>
        </DialogContent>
      </Dialog>
      <LatestMeasurementModal open={latestMeasurementOpen} handleClose={handleCloseModal} uuid={user.uuid} />
    </div>
  );
};

export default MainPage;
