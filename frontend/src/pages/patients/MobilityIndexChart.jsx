import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const MobilityIndexChart = ({ patientId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/mobility_index/${patientId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [patientId]);

  const chartData = {
    labels: data.map(item => new Date(item.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Indice di Mobilità',
        data: data.map(item => item.mobility_index),
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
      },
    ],
  };

  return (
    <div>
      <h3>Indice di Mobilità</h3>
      <Line data={chartData} />
    </div>
  );
};

export default MobilityIndexChart;
