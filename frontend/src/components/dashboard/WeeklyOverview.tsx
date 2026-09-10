import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import styles from './WeeklyOverview.module.css';

interface Props {
  data: { date: string; completionRate: number }[];
}

export default function WeeklyOverview({ data }: Props) {
  const recent = data.slice(-7).map(d => ({
    day: (() => { try { return format(parseISO(d.date), 'EEE'); } catch { return d.date; } })(),
    rate: Math.round(d.completionRate),
  }));

  if (!recent.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Weekly Overview</h2>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={recent}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#78716c' }} />
            <YAxis tick={{ fontSize: 12, fill: '#78716c' }} domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="rate" fill="#10b981" radius={[6, 6, 0, 0]} name="Completion %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}