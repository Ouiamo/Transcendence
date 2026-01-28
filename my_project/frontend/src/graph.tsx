import { useEffect, useState } from 'react';
import {  Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Stats {
  user_id: number;
  wins: number;
  loss: number;
  total_matches: number;
  win_rate: number;
  points: number;
}

function StatsCharts() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('https://localhost:3010/api/stats', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading</div>;
  }

  if (!stats) {
    return <div className="text-center p-4">errooooooooooooooooor</div>;
  }

  const donutData = {
    labels: ['Wins', 'Losses'],
    datasets: [
      {
        label: 'Win Rate',
        data: [stats.wins, stats.loss],
        backgroundColor: [
          'rgba(238, 39, 142, 0.8)',
          'rgba(173, 127, 232, 0.8)',
        ],
        borderColor: [
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    // animation: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#fff',
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: `Win Rate: ${stats.win_rate}%`,
        color: '#fff',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            // const total = stats.total_matches;
            const percentage = stats.win_rate;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="w-[350px] h-[300px] bg-[rgba(45,27,105,0.8)] backdrop-blur-md rounded-2xl p-6 border-2 border-[#ff44ff]">
      <div className="flex items-center justify-center h-full">
        <div className="w-48 h-48">
          <Doughnut data={donutData} options={donutOptions} />
        </div>
      </div>
    </div>
  );
}

export default StatsCharts;