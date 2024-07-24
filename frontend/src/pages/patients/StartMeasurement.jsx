import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { Button, Dialog, DialogContent, DialogTitle, MobileStepper, Typography, Box, FormGroup, FormControlLabel, Checkbox, TextField, Grid } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend, Title, Tooltip, TimeScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useAuth } from '../../contexts/AuthContext';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Title, Tooltip, TimeScale, zoomPlugin);

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
  const [forzaData, setForzaData] = useState([]);
  const [spostamentoData, setSpostamentoData] = useState([]);
  const [pressioneData, setPressioneData] = useState([]);
  const [contropressioneData, setContropressioneData] = useState([]);
  const [labels, setLabels] = useState([]);
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
          setLabels(prevLabels => [...prevLabels, prevLabels.length]);
          setForzaData(prevData => [...prevData, parsedData.forza_N]);
          setSpostamentoData(prevData => [...prevData, parsedData.spostamento_mm]);
          setPressioneData(prevData => [...prevData, parsedData.pressione_bar]);
          setContropressioneData(prevData => [...prevData, parsedData.contropressione_bar]);
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

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  const resetState = () => {
    setActiveStep(0);
    setData([]);
    setForzaData([]);
    setSpostamentoData([]);
    setPressioneData([]);
    setContropressioneData([]);
    setLabels([]);
    setMeasuring(false);
    setMeasurementComplete(false);
  };

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
    resetState();
  };

  const toggleDatasetVisibility = (datasetKey) => {
    setVisibleDatasets(prevState => ({
      ...prevState,
      [datasetKey]: !prevState[datasetKey]
    }));
  };

  const renderChart = (label, data, borderColor) => (
    <Line 
      data={{ labels, datasets: [{ data, label, borderColor, borderWidth: 2, fill: false }] }} 
      options={{
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Seconds'
            }
          }
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'x'
            },
            zoom: {
              wheel:{
                enabled:true
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
            }
          }
        }
      }}
    />
  );

  const combinedChart = (
    <Line 
      data={{
        labels,
        datasets: [
          { data: forzaData, label: 'Forza (N)', yAxisID: 'y', borderColor: 'rgba(75,192,192,1)', borderWidth: 2, fill: false },
          { data: spostamentoData, label: 'Spostamento (mm)', yAxisID: 'y1', borderColor: 'rgba(192,75,75,1)', borderWidth: 2, fill: false },
          { data: pressioneData, label: 'Pressione (bar)', yAxisID: 'y2', borderColor: 'rgba(75,75,192,1)', borderWidth: 2, fill: false },
          { data: contropressioneData, label: 'Contropressione (bar)', yAxisID: 'y3', borderColor: 'rgba(75,192,75,1)', borderWidth: 2, fill: false }
        ]
      }}
      options={{
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Seconds'
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Forza (N)'
            }
          },
          y1: {
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Spostamento (mm)'
            },
            grid: {
              drawOnChartArea: false
            }
          },
          y2: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Pressione (bar)'
            },
            grid: {
              drawOnChartArea: false
            }
          },
          y3: {
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Contropressione (bar)'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'x'
            },
            zoom: {
              wheel:{
                enabled:true
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
            }
          }
        }
      }}
    />
  );

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
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
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  {renderChart('Forza (N)', forzaData, 'rgba(75,192,192,1)')}
                </Grid>
                <Grid item xs={12} md={6}>
                  {renderChart('Spostamento (mm)', spostamentoData, 'rgba(192,75,75,1)')}
                </Grid>
                <Grid item xs={12} md={6}>
                  {renderChart('Pressione (bar)', pressioneData, 'rgba(75,75,192,1)')}
                </Grid>
                <Grid item xs={12} md={6}>
                  {renderChart('Contropressione (bar)', contropressioneData, 'rgba(75,192,75,1)')}
                </Grid>
              </Grid>
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
                {Object.keys(visibleDatasets).map((key) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        checked={visibleDatasets[key]}
                        onChange={() => toggleDatasetVisibility(key)}
                        name={key}
                      />
                    }
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                ))}
              </FormGroup>
              <Grid container spacing={2}>
                {visibleDatasets.forza && (
                  <Grid item xs={12} md={6}>
                    {renderChart('Forza (N)', forzaData, 'rgba(75,192,192,1)')}
                  </Grid>
                )}
                {visibleDatasets.spostamento && (
                  <Grid item xs={12} md={6}>
                    {renderChart('Spostamento (mm)', spostamentoData, 'rgba(192,75,75,1)')}
                  </Grid>
                )}
                {visibleDatasets.pressione && (
                  <Grid item xs={12} md={6}>
                    {renderChart('Pressione (bar)', pressioneData, 'rgba(75,75,192,1)')}
                  </Grid>
                )}
                {visibleDatasets.contropressione && (
                  <Grid item xs={12} md={6}>
                    {renderChart('Contropressione (bar)', contropressioneData, 'rgba(75,192,75,1)')}
                  </Grid>
                )}
              </Grid>
              <Typography variant="h6" style={{ marginTop: '20px' }}>Combined Chart</Typography>
              {combinedChart}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StartMeasurement;
