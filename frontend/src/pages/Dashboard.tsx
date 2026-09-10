import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import styles from './Dashboard.module.css';
import StatCards from '../components/dashboard/StatCards';
import TodayCheckins from '../components/dashboard/TodayCheckins';
import ActiveStreaks from '../components/dashboard/ActiveStreaks';
import WeeklyOverview from '../components/dashboard/WeeklyOverview';

interface DashboardStats {
  totalHabits: number;
  todayCompleted: number;
  todayTotal: number;
  overallCompletionRate: number;
  topStreaks: { habitId: number; habitName: string; currentStreak: number }[];
}

interface HabitWithTags {
  id: number;
  name: string;
  description: string;
  frequency: string;
  color: string;
  categoryId: number;
  createdAt: string;
  tags: { id: number; name: string }[];
}

interface CheckinItem {
  id: number;
  habitId: number;
  habitName: string;
  date: string;
  completed: boolean;
  note: string;
}

interface DailyProgress {
  date: string;
  completionRate: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [habits, setHabits] = useState<HabitWithTags[]>([]);
  const [checkins, setCheckins] = useState<CheckinItem[]>([]);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, habitsRes, checkinsRes, progressRes] = await Promise.all([
        apiClient.get('/api/analytics/dashboard'),
        apiClient.get('/api/habits'),
        apiClient.get('/api/checkins', { params: { date: today } }),
        apiClient.get('/api/analytics/progress'),
      ]);
      setStats(statsRes.data);
      setHabits(habitsRes.data);
      setCheckins(checkinsRes.data);
      setDailyProgress(progressRes.data?.daily || []);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggleCheckin = async (habitId: number) => {
    const existing = checkins.find(c => c.habitId === habitId);
    try {
      if (existing) {
        const res = await apiClient.put(`/api/checkins/${existing.id}`, {
          completed: !existing.completed,
        });
        setCheckins(prev => prev.map(c => c.id === existing.id ? res.data : c));
      } else {
        const res = await apiClient.post('/api/checkins', {
          habitId,
          date: today,
          completed: true,
        });
        setCheckins(prev => [...prev, res.data]);
      }
      const statsRes = await apiClient.get('/api/analytics/dashboard');
      setStats(statsRes.data);
    } catch {
      // silent
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const todayProgress = stats && stats.todayTotal > 0
    ? Math.round((stats.todayCompleted / stats.todayTotal) * 100)
    : 0;

  const bestStreak = stats?.topStreaks?.length
    ? Math.max(...stats.topStreaks.map(s => s.currentStreak))
    : 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Good morning</h1>
          <p className={styles.subtitle}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            {' · '}
            {stats?.todayCompleted || 0} of {stats?.todayTotal || 0} habits done
          </p>
        </div>
      </header>

      <StatCards
        currentStreak={bestStreak}
        todayProgress={todayProgress}
        bestStreak={bestStreak}
        completionRate={stats?.overallCompletionRate ?? 0}
      />

      <TodayCheckins
        habits={habits}
        checkins={checkins}
        onToggle={handleToggleCheckin}
      />

      <ActiveStreaks streaks={stats?.topStreaks || []} />

      <WeeklyOverview data={dailyProgress} />
    </div>
  );
}