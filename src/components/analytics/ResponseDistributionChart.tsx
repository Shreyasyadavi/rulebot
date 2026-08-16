import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { ResponseDistributionStat } from '../../types/analytics';

interface ResponseDistributionChartProps {
  data: ResponseDistributionStat[];
}

export const ResponseDistributionChart: React.FC<ResponseDistributionChartProps> = ({ data }) => {
  const totalCount = data.reduce((acc, item) => acc + item.count, 0);

  // If no responses recorded yet, render a subtle placeholder ring
  const chartData = totalCount === 0
    ? [{ name: 'No data', percentage: 100, count: 0, color: '#334155' }]
    : data;

  return (
    <div className="space-y-4">
      <div className="h-48 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {totalCount > 0 && (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(value: any, name: any) => [`${value}%`, name]}
              />
            )}
            <Pie
              data={chartData}
              dataKey="percentage"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={totalCount > 0 ? 4 : 0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with exact percentages */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {item.name}
              </span>
            </div>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
              {item.percentage}% ({item.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

