import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const LatestMeasurementChart = ({ patientId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/latest_measurement/${patientId}`);
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
        label: 'Ultima Misurazione',
        data: data.map(item => item.value),
        fill: false,
        backgroundColor: 'red',
        borderColor: 'red',
      },
    ],
  };

  return (
    <div>
      <h3>Ultima Misurazione</h3>
      <Line data={chartData} />
    </div>
  );
};

export default LatestMeasurementChart;
