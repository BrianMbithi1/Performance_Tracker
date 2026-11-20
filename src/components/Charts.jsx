import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const BLUE = '#2f7cf6';
const ORANGE = '#f5962a';
const GREY = '#9aa8bf';
const tooltipStyle = { background: '#141d2f', border: '1px solid #2a3a57' };

export function KdChart({ data }) {
  if (data.length < 2) return <p className="text-sm text-muted">Log matches on two different days to see a trend.</p>;

  return (
    <div className="h-64" role="img" aria-label="Line chart of your K/D ratio over time">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#2a3a57" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke={GREY} fontSize={12} />
          <YAxis stroke={GREY} fontSize={12} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="kd" name="K/D" stroke={ORANGE} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BreakdownChart({ data }) {
  return (
    <div className="h-64" role="img" aria-label="Bar chart of your K/D ratio by group">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#2a3a57" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke={GREY} fontSize={11} />
          <YAxis stroke={GREY} fontSize={12} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="kd" name="K/D" fill={BLUE} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
