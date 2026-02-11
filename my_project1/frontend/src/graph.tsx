import { useEffect, useState } from 'react';
import { Line, Doughnut } from "react-chartjs-2";
import { API_URL } from "./Api";
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
  Filler,
} from 'chart.js';
import type { ChartOptions, TooltipItem } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface Stats {
  user_id: number;
  wins: number;
  loss: number;
  total_matches: number;
  win_rate: number;
  points: number;
}

interface History {
  isWin: Boolean;
}

function StatsCharts() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<History[] | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/stats`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }

        const History_res = await fetch(`${API_URL}/api/history/is_win`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (History_res.ok) {
          const data = await History_res.json();
          console.log("history isssssss :: ", data);
          setHistory(data);
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
    return <div className="text-center p-4"></div>;
  }

  const donutData = {
    labels: ['Wins', 'Losses'],
    datasets: [
      {
        label: 'Win Rate',
        data: [stats.wins, stats.loss],
        backgroundColor: [
          'rgba(158, 154, 175, 1)',  // rgb(255, 119, 255)
          'rgba(180, 84, 224, 0.84)',
        ],
        borderColor: [
         'rgba(214, 209, 227, 0.6)',
        'rgba(216, 107, 255, 0.45)',
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
          label: function(context: TooltipItem<'doughnut'>) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = stats.win_rate;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const POINTS_PER_MATCH = 30;

  function calculatePoints(history:any) {
    if (!history || history.length === 0) return [0];
    
    let total = 0;
    const points = [0];

    history.forEach((result:any) => {
      console.log("results hnaa is ", result);
      if (result.isWin === 1 || result.isWin === true) total += POINTS_PER_MATCH;
      else if (result.isWin === 0 || result.isWin === false) total -= POINTS_PER_MATCH;
      points.push(total);
      console.log("points hnaa is ", points);
    });
    return points;
  }
  
  const pointsData = calculatePoints(history);
  console.log("points data is :::" ,pointsData);

  const labels = pointsData.map((_, index) => index); 

  const lineData = {
    labels,
    datasets: [
      {
        label: "Points",
        data: pointsData,
        borderColor: "rgba(216, 107, 255, 1)",
        backgroundColor: 'rgba(216, 107, 255, 0.15)',
        tension: 0.2,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Points Progression",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Match Number",
        },
      },
      y: {
        title: {
          display: true,
          text: "Points",
        },
        ticks: {
          stepSize: 30,
        },
      },
    },
  };

  return (
<div className="grid grid-cols-2 w-full gap-[100px] md:gap-[100px] items-start justify-center  mt-[5px] p-[14px]">
  
  <div className="w-full max-w-[400px] aspect-[4/3]  bg-[#0d0221] rounded-[12px] p-[16px] border-[2px] border-[#c44cff]/50">
    <div className="relative w-full h-full flex items-center justify-center">
        <Doughnut data={donutData} options={donutOptions} />
    </div>
  </div>

 
  <div className="w-full max-w-[400px] aspect-[4/3]  bg-[#0d0221] rounded-[12px] p-[16px] border-[2px]  border-[#c44cff]/50">
    <div className="relative w-full h-full flex items-center justify-center">
        <Line data={lineData} options={lineOptions} />
    </div>
  </div>
</div>
  );
}

export default StatsCharts;