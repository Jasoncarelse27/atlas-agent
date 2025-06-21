import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProgressChartProps {
  title: string;
  data: number[];
  labels: string[];
  color?: string;
  fillColor?: string;
  yAxisTitle?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  title, 
  data, 
  labels, 
  color = '#0D9488', 
  fillColor = 'rgba(13, 148, 136, 0.1)',
  yAxisTitle = ''
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: color,
        backgroundColor: fillColor,
        fill: true,
        tension: 0.3, // Smooth curve
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(226, 232, 240, 0.6)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 10,
          },
          callback: function(value: any) {
            return value;
          },
        },
        title: {
          display: !!yAxisTitle,
          text: yAxisTitle,
          color: '#6B7280',
          font: {
            size: 10,
            weight: 'normal',
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 h-64">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-[calc(100%-2rem)]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ProgressChart;