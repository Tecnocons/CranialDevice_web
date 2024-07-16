import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardHeader, Button, Box, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { Bar, Line } from 'react-chartjs-2';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom'; // Importazione di useNavigate
import './MainPage.css';

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

const MainPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Uso di useNavigate
  const [monthlyMeasurements, setMonthlyMeasurements] = useState(new Array(12).fill(0));
  const [modalOpen, setModalOpen] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      { data: [], label: 'Forza (N)', borderColor: 'rgba(75,192,192,1)', borderWidth: 2, fill: false },
      { data: [], label: 'Spostamento (mm)', borderColor: 'rgba(192,75,75,1)', borderWidth: 2, fill: false },
      { data: [], label: 'Pressione (bar)', borderColor: 'rgba(75,75,192,1)', borderWidth: 2, fill: false },
      { data: [], label: 'Contropressione (bar)', borderColor: 'rgba(75,192,75,1)', borderWidth: 2, fill: false },
    ]
  });

  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!user || !user.id) return;

      try {
        const response = await fetch(`http://localhost:5000/api/doctor_measurements/${user.id}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        const measurementsCount = new Array(12).fill(0);

        data.forEach((measurement) => {
          const month = new Date(measurement.timestamp).getMonth();
          measurementsCount[month] += 1;
        });

        setMonthlyMeasurements(measurementsCount);
      } catch (error) {
        console.error('Error fetching measurements:', error);
      }
    };

    if (user && user.id) {
      fetchMeasurements();
    }
  }, [user]);

  const handleOpenModal = async () => {
    setModalOpen(true);
    try {
      const response = await fetch('http://localhost:5000/api/measurements/latest', {
        method: 'GET',
        credentials: 'include',
      });
      const latestMeasurement = await response.json();
      const measurementId = latestMeasurement.measurement_id;

      const responseAll = await fetch(`http://localhost:5000/api/measurements/by_measurement_id/${measurementId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await responseAll.json();

      const labels = data.map((measurement) => new Date(measurement.timestamp).toLocaleTimeString());
      const forzaData = data.map((measurement) => measurement.forza_n);
      const spostamentoData = data.map((measurement) => measurement.spostamento_mm);
      const pressioneData = data.map((measurement) => measurement.pressione_bar);
      const contropressioneData = data.map((measurement) => measurement.contropressione_bar);

      setChartData({
        labels,
        datasets: [
          { data: forzaData, label: 'Forza (N)', borderColor: 'rgba(75,192,192,1)', borderWidth: 2, fill: false },
          { data: spostamentoData, label: 'Spostamento (mm)', borderColor: 'rgba(192,75,75,1)', borderWidth: 2, fill: false },
          { data: pressioneData, label: 'Pressione (bar)', borderColor: 'rgba(75,75,192,1)', borderWidth: 2, fill: false },
          { data: contropressioneData, label: 'Contropressione (bar)', borderColor: 'rgba(75,192,75,1)', borderWidth: 2, fill: false },
        ]
      });
    } catch (error) {
      console.error('Error fetching latest measurement:', error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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
        borderWidth: 1,
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
      </Container>

      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>Ultima Misurazione</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Dettagli della misurazione
          </Typography>
          <Line data={chartData} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainPage;
