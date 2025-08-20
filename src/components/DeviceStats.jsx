import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DeviceStats = ({ stats }) => {
  const safeStats = Array.isArray(stats) ? stats : [];

  // Aggregate counts by device
  const deviceCount = safeStats.reduce((acc, item) => {
    const key = (item && item.device) ? item.device : 'Desktop';
    if (!acc[key]) acc[key] = 0;
    acc[key]++;
    return acc;
  }, {});

  const total = safeStats.length || 1;

  const result = Object.keys(deviceCount).map((device) => ({
    device,
    count: deviceCount[device],
    percent: deviceCount[device] / total,
  }));

  return (
    <div className="w-full">
      {/* Chart */}
      <div className="w-full h-[300px] md:h-[350px]">
        <ResponsiveContainer>
          <PieChart width={700} height={400}>
            <Pie
              data={result}
              labelLine={false}
              label={false}
              dataKey="count"
            >
              {result.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with percentages below the chart (visible on all screen sizes) */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm">
        {result.map((item, index) => (
          <div
            key={item.device}
            className="flex items-center gap-2 bg-gray-800/60 rounded px-2 py-1"
          >
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="font-medium">{item.device}:</span>
            <span>{Math.round(item.percent * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceStats;