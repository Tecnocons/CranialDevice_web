import React from 'react';
import mqtt from 'mqtt';
import { Button } from '@mui/material';

const StartMeasurement = () => {
  const brokerUrl = process.env.REACT_APP_MQTT_BROKER_URL;
  const username = process.env.REACT_APP_MQTT_BROKER_USERNAME;
  const password = process.env.REACT_APP_MQTT_BROKER_PASSWORD;

  console.log('MQTT Broker URL:', brokerUrl);
  console.log('MQTT Broker Username:', username);
  console.log('MQTT Broker Password:', password);

  const handleStartMeasurement = () => {
    if (!brokerUrl || !username || !password) {
      console.error('One or more MQTT configuration variables are undefined');
      return;
    }

    const options = {
      username: username,
      password: password,
      reconnectPeriod: 1000, // Auto-reconnect after 1 second
    };

    console.log('MQTT Options:', options);

    const client = mqtt.connect(brokerUrl, options);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.publish('measurement/start', 'start');
    });

    client.on('error', (err) => {
      console.error('Connection error:', err);
    });

    client.on('close', () => {
      console.log('Connection to MQTT broker closed');
    });

    client.on('offline', () => {
      console.log('MQTT client offline');
    });

    client.on('reconnect', () => {
      console.log('Reconnecting to MQTT broker...');
    });
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleStartMeasurement}>
        Inizia Misurazione
      </Button>
    </div>
  );
};

export default StartMeasurement;
