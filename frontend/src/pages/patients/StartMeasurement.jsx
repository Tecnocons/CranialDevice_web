import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { Button, Dialog, DialogContent, DialogTitle, MobileStepper, Typography, Box, FormGroup, FormControlLabel, Checkbox, TextField } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend, Title, Tooltip } from 'chart.js';
import { useAuth } from '../../contexts/AuthContext';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Title, Tooltip);

const instructions = [
  "Ensure the helmet is properly positioned.",
  "Verify all connections are secure.",
  "Confirm the patient is ready for the measurement."
];

const StartMeasurement = ({ open, onClose, patientId }) => {
  const { user } = useAuth();
  const brokerUrl = process.env.REACT_APP_MQTT_BROKER_URL;
  const username = process.env.REACT_APP_MQTT_BROKER_USERNAME;
  const password = process.env.REACT_APP_MQTT_BROKER_PASSWORD;

  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      { data: [], label: 'Forza (N)', borderColor: 'rgba(75,192,192,1)', borderWidth: 2, fill: false },
      { data: [], label: 'Spostamento (mm)', borderColor: 'rgba(192,75,75,1)', borderWidth: 2, fill: false },
      { data: [], label: 'Pressione (bar)', borderColor: 'rgba(75,75,192,1)', borderWidth: 2, fill: false },
      { data: [], label: 'Contropressione (bar)', borderColor: 'rgba(75,192,75,1)', borderWidth: 2, fill: false },
    ]
  });
  const [measuring, setMeasuring] = useState(false);
  const [measurementComplete, setMeasurementComplete] = useState(false);
  const [client, setClient] = useState(null);
  const [forza, setForza] = useState(0);
  const [numeroCicli, setNumeroCicli] = useState(1);
  const [visibleDatasets, setVisibleDatasets] = useState({
    forza: true,
    spostamento: true,
    pressione: true,
    contropressione: true,
  });

  useEffect(() => {
    if (measuring) {
      const options = { username, password, reconnectPeriod: 1000 };
      const mqttClient = mqtt.connect(brokerUrl, options);
      setClient(mqttClient);

      mqttClient.on('connect', () => {
        console.log('Connected to MQTT broker');
        console.log('user data:', user);
        const config = {
          forza: forza,  
          numero_cicli: numeroCicli,
          patient_id: patientId
        };
        mqttClient.publish(`caschetto/${user.helmetId}/config`, JSON.stringify(config), () => {
          mqttClient.publish(`caschetto/${user.helmetId}/start`, 'start'); // Publish start command
        });
        mqttClient.subscribe(`caschetto/${user.helmetId}/data`);
      });

      mqttClient.on('message', (topic, message) => {
        const messageStr = message.toString();
        try {
          const parsedData = parseMessage(messageStr);
          setData(prevData => [...prevData, parsedData]);
          setChartData(prevChartData => ({
            labels: [...prevChartData.labels, new Date().toLocaleTimeString()],
            datasets: [
              { ...prevChartData.datasets[0], data: [...prevChartData.datasets[0].data, parsedData.forza_N] },
              { ...prevChartData.datasets[1], data: [...prevChartData.datasets[1].data, parsedData.spostamento_mm] },
              { ...prevChartData.datasets[2], data: [...prevChartData.datasets[2].data, parsedData.pressione_bar] },
              { ...prevChartData.datasets[3], data: [...prevChartData.datasets[3].data, parsedData.contropressione_bar] },
            ]
          }));
        } catch (error) {
          console.error('Error parsing MQTT message:', error);
        }
      });

      mqttClient.on('error', (err) => {
        console.error('Connection error:', err);
      });

      mqttClient.on('close', () => {
        console.log('Connection to MQTT broker closed');
      });

      mqttClient.on('offline', () => {
        console.log('MQTT client offline');
      });

      mqttClient.on('reconnect', () => {
        console.log('Reconnecting to MQTT broker...');
      });

      return () => mqttClient.end();
    }
  }, [measuring]);

  const parseMessage = (messageStr) => {
    const data = messageStr.split(', ').reduce((acc, curr) => {
      const [key, value] = curr.split('=');
      acc[key.trim()] = parseFloat(value);
      return acc;
    }, {});

    return {
      spostamento_mm: data["Spostamento(mm)"],
      forza_N: data["Forza(N)"],
      pressione_bar: data["Pressione(bar)"],
      contropressione_bar: data["Contropressione(bar)"]
    };
  };

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleStartMeasurement = () => {
    setMeasuring(true);
  };

  const handleMeasurementComplete = () => {
    setMeasuring(false);
    setMeasurementComplete(true);
  };

  const startMeasurementProcess = () => {
    setOpen(true);
    setActiveStep(0);
    setMeasurementComplete(false);
    setData([]);
    setChartData({
      labels: [],
      datasets: [
        { data: [], label: 'Forza (N)', borderColor: 'rgba(75,192,192,1)', borderWidth: 2, fill: false },
        { data: [], label: 'Spostamento (mm)', borderColor: 'rgba(192,75,75,1)', borderWidth: 2, fill: false },
        { data: [], label: 'Pressione (bar)', borderColor: 'rgba(75,75,192,1)', borderWidth: 2, fill: false },
        { data: [], label: 'Contropressione (bar)', borderColor: 'rgba(75,192,75,1)', borderWidth: 2, fill: false },
      ]
    });
  };

  const toggleDatasetVisibility = (datasetIndex) => {
    setVisibleDatasets(prevState => {
      const newState = { ...prevState };
      const key = Object.keys(visibleDatasets)[datasetIndex];
      newState[key] = !prevState[key];
      return newState;
    });
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Istruzioni per la Misurazione</DialogTitle>
        <DialogContent>
          {!measuring && !measurementComplete && (
            <>
              <Typography>{instructions[activeStep]}</Typography>
              <MobileStepper
                steps={instructions.length}
                position="static"
                variant="text"
                activeStep={activeStep}
                nextButton={
                  <Button size="small" onClick={handleNext} disabled={activeStep === instructions.length - 1}>
                    Next
                    <KeyboardArrowRight />
                  </Button>
                }
                backButton={
                  <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                    <KeyboardArrowLeft />
                    Back
                  </Button>
                }
              />
              {activeStep === instructions.length - 1 && (
                <Box textAlign="center" p={2}>
                  <TextField
                    label="Forza (kg)"
                    type="number"
                    inputProps={{ min: "0", max: "4", step: "0.1" }}
                    value={forza}
                    onChange={(e) => setForza(Math.min(Math.max(e.target.value, 0), 4))}
                    fullWidth
                  />
                  <TextField
                    label="Numero di Cicli"
                    type="number"
                    inputProps={{ min: "1", max: "10", step: "1" }}
                    value={numeroCicli}
                    onChange={(e) => setNumeroCicli(Math.min(Math.max(e.target.value, 1), 10))}
                    fullWidth
                  />
                  <Button variant="contained" color="primary" onClick={handleStartMeasurement}>
                    Start Measurement
                  </Button>
                </Box>
              )}
            </>
          )}
          {measuring && (
            <div>
              <Typography variant="h6">Real-Time Data</Typography>
              {data.length > 0 && (
                <>
                  <Typography>Spostamento (mm): {data[data.length - 1].spostamento_mm}</Typography>
                  <Typography>Forza (N): {data[data.length - 1].forza_N}</Typography>
                  <Typography>Pressione (bar): {data[data.length - 1].pressione_bar}</Typography>
                  <Typography>Contropressione (bar): {data[data.length - 1].contropressione_bar}</Typography>
                </>
              )}
              <Line data={chartData} />
              <Box textAlign="center" p={2}>
                <Button variant="contained" color="primary" onClick={handleMeasurementComplete}>
                  Stop Measurement
                </Button>
              </Box>
            </div>
          )}
          {measurementComplete && (
            <div>
              <Typography variant="h6">Measurement Complete</Typography>
              <FormGroup row>
                {Object.keys(visibleDatasets).map((key, index) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        checked={visibleDatasets[key]}
                        onChange={() => toggleDatasetVisibility(index)}
                        name={key}
                      />
                    }
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                ))}
              </FormGroup>
              <Line data={{
                labels: chartData.labels,
                datasets: chartData.datasets.filter((_, i) => visibleDatasets[Object.keys(visibleDatasets)[i]])
              }} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StartMeasurement;
