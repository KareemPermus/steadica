import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import styles from './Analytics.module.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiAward, FiTarget, FiBarChart2 } from 'react-icons/fi';

interface DailyProgress {
  date: string;
  completionRate: number;
}
interface ByHabit {
  habitId: number;
  habitName: string;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
}
interface ByCategory {
  categoryId: number;
  categoryName: string;
  completionRate: number;
}
interface ProgressData {
  daily: DailyProgress[];
  byHabit: ByHabit[];
  byCategory: ByCategory[];
}
interface DashboardStats {
  totalHabits: number;
  todayCompleted: number;
  todayTotal: number;
  overallCompletionRate: number;
  topStreaks: { habitId: number; habitName: string; currentStreak: number }[];
}

const COLORS = ['#10b981', '#f59e0b', '#6366f1', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6'];

export default function Analytics() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiClient.get('/api/analytics/progress'),
      apiClient.get('/api/analytics/dashboard'),
    ])
      .then(([p, d]) => {
        setProgress(p.data);
        setDashboard(d.data);
      })
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading analytics…</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!progress || !dashboard) return <div className={styles.error}>No data available</div>;

  const todayPct = dashboard.todayTotal > 0 ? Math.round((dashboard.todayCompleted / dashboard.todayTotal) * 100) : 0;
  const bestStreak = dashboard.topStreaks.length > 0 ? Math.max(...dashboard.topStreaks.map(s => s.currentStreak)) : 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Insights</h1>
          <p className={styles.subtitle}>Your habit performance at a glance</p>
        </div>
      </header>

      {/* Stat cards */}
      <section className={styles.statsGrid}>
        <StatCard icon={<FiTarget />} label="Today's Progress" value={`${todayPct}%`} />
        <StatCard icon={<FiBarChart2 />} label="Overall Rate" value={`${Math.round(dashboard.overallCompletionRate)}%`} />
        <StatCard icon={<FiAward />} label="Best Streak" value={`${bestStreak} days`} />
        <StatCard icon={<FiTrendingUp />} label="Total Habits" value={String(dashboard.totalHabits)} />
      </section>

      {/* Daily trend */}
      <section className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Daily Completion Rate</h2>
        {progress.daily.length === 0 ? (
          <p className={styles.empty}>No daily data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={progress.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#a8a29e" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#a8a29e" />
              <Tooltip formatter={(v: number) => `${Math.round(v)}%`} />
              <Line type="monotone" dataKey="completionRate" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>

      <div className={styles.chartsRow}>
        {/* By category donut */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>By Category</h2>
          {progress.byCategory.length === 0 ? (
            <p className={styles.empty}>No category data</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={progress.byCategory} dataKey="completionRate" nameKey="categoryName" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {progress.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${Math.round(v)}%`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* By habit bar */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>By Habit</h2>
          {progress.byHabit.length === 0 ? (
            <p className={styles.empty}>No habit data</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={progress.byHabit} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#a8a29e" />
                <YAxis type="category" dataKey="habitName" width={100} tick={{ fontSize: 12 }} stroke="#a8a29e" />
                <Tooltip formatter={(v: number) => `${Math.round(v)}%`} />
                <Bar dataKey="completionRate" radius={[0, 4, 4, 0]}>
                  {progress.byHabit.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Streaks table */}
      <section className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Habit Streaks</h2>
        {progress.byHabit.length === 0 ? (
          <p className={styles.empty}>No streak data</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Habit</th>
                <th>Current Streak</th>
                <th>Longest Streak</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              {progress.byHabit.map((h) => (
                <tr key={h.habitId}>
                  <td className={styles.habitName}>{h.habitName}</td>
                  <td>{h.currentStreak} days</td>
                  <td>{h.longestStreak} days</td>
                  <td>
                    <span className={styles.pill}>{Math.round(h.completionRate)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon}>{icon}</div>
      <div>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.statValue}>{value}</div>
      </div>
    </div>
  );
}