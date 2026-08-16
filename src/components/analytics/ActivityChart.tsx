import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DailyActivityStat } from '../../types/analytics';

interface ActivityChartProps {
  data: DailyActivityStat[];
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  return (
    <div className="h-64 sm:h-72 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
            cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
            formatter={(value: any, name: any) => [
              value,
              name === 'messages' ? 'Messages' : 'Conversations',
            ]}
            labelFormatter={(label) => `Activity on ${label}`}
          />
          <Bar
            dataKey="messages"
            name="messages"
            fill="#6366f1"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
