// src/widgets/PatientVisitsGraph.tsx
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const dailyData = [
  { date: 'Jul 01', visits: 12 },
  { date: 'Jul 02', visits: 18 },
  { date: 'Jul 03', visits: 22 },
  { date: 'Jul 04', visits: 15 },
  { date: 'Jul 05', visits: 27 },
  { date: 'Jul 06', visits: 19 },
  { date: 'Jul 07', visits: 25 },
];

const weeklyData = [
  { week: 'Week 1', visits: 110 },
  { week: 'Week 2', visits: 132 },
  { week: 'Week 3', visits: 95 },
  { week: 'Week 4', visits: 143 },
];

const monthlyData = [
  { month: 'Jan', visits: 520 },
  { month: 'Feb', visits: 480 },
  { month: 'Mar', visits: 610 },
  { month: 'Apr', visits: 590 },
  { month: 'May', visits: 630 },
  { month: 'Jun', visits: 570 },
  { month: 'Jul', visits: 660 },
];

type ViewType = 'daily' | 'weekly' | 'monthly';

export default function PatientVisitsGraph() {
  const [view, setView] = useState<ViewType>('daily');

  const getData = () => {
    switch (view) {
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      default: return dailyData;
    }
  };

  const data = getData();
  const xKey = view === 'daily' ? 'date' : view === 'weekly' ? 'week' : 'month';

  return (
    <div className="bg-white rounded-xl shadow-md p-3 w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold text-cyan-700">Patient Visits ({view.charAt(0).toUpperCase() + view.slice(1)})</h3>
        <select
          value={view}
          onChange={(e) => setView(e.target.value as ViewType)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="visits"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
