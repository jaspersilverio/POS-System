import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GaugeChartProps {
  value: number;
  maxValue: number;
  label: string;
  count?: number;
}

const FeedbackGaugeChart: React.FC<GaugeChartProps> = ({ value, maxValue, label, count }) => {
  // Calculate the percentage of the value
  const percentage = (value / maxValue) * 100;
  
  // Determine the color based on the percentage
  const getGaugeColor = (percentage: number) => {
    if (percentage >= 80) return 'rgba(16, 185, 129, 0.8)'; // Green
    if (percentage >= 60) return 'rgba(59, 130, 246, 0.8)'; // Blue
    if (percentage >= 40) return 'rgba(245, 158, 11, 0.8)'; // Amber
    if (percentage >= 20) return 'rgba(249, 115, 22, 0.8)'; // Orange
    return 'rgba(239, 68, 68, 0.8)'; // Red
  };
  
  const color = getGaugeColor(percentage);
  
  // Chart data
  const data = {
    datasets: [
      {
        data: [value, maxValue - value], // Filled, Empty
        backgroundColor: [color, 'rgba(229, 231, 235, 0.5)'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      },
    ],
  };
  
  // Chart options
  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  
  return (
    <div className="relative h-48 flex flex-col items-center">
      <div className="w-full h-full relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <div className="text-4xl font-bold text-blue-600">{value.toFixed(1)}</div>
          <div className="text-sm text-gray-500">{label}</div>
          {count !== undefined && (
            <div className="text-xs text-gray-400 mt-1">
              Based on {count} {count === 1 ? 'response' : 'responses'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackGaugeChart; 