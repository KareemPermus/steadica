import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { Habit, Checkin } from '../types';
import HabitInfo from '../components/HabitInfo';
import HabitCalendar from '../components/HabitCalendar';
import StreakDisplay from '../components/StreakDisplay';
import CheckinHistory from '../components/CheckinHistory';
import styles from './HabitDetail.module.css';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';

interface HabitDetail extends Habit {
  currentStreak: number;
  longestStreak: number;
  tags: { id: number; name: string }[];
}

export default function HabitDetail() {
  const { id } = useParams<{ id: string }>();
  const [habit, setHabit] = useState<HabitDetail | null>(null);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [habitRes, checkinsRes] = await Promise.all([
        apiClient.get(`/api/habits/${id}`),
        apiClient.get('/api/checkins', { params: { habitId: id } }),
      ]);
      setHabit(habitRes.data);
      setCheckins(checkinsRes.data);
    } catch {
      setError('Failed to load habit details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className={styles.center}><FiLoader className={styles.spinner} size={24} /> Loading…</div>;
  if (error || !habit) return <div className={styles.center}><p className={styles.error}>{error || 'Habit not found'}</p><Link to="/habits" className={styles.backLink}><FiArrowLeft /> Back to habits</Link></div>;

  return (
    <div className={styles.page}>
      <Link to="/habits" className={styles.backLink}><FiArrowLeft size={16} /> Back to habits</Link>

      <div className={styles.header}>
        <div className={styles.colorDot} style={{ background: habit.color || '#10b981' }} />
        <div>
          <h1 className={styles.title}>{habit.name}</h1>
          <p className={styles.subtitle}>{habit.frequency}{habit.tags?.length ? ` · ${habit.tags.map(t => t.name).join(', ')}` : ''}</p>
        </div>
      </div>

      <div className={styles.statsRow}>
        <StreakDisplay label="Current Streak" value={habit.currentStreak} />
        <StreakDisplay label="Longest Streak" value={habit.longestStreak} />
      </div>

      <HabitInfo habit={habit} />

      <div className={styles.sectionTitle}>Calendar</div>
      <HabitCalendar checkins={checkins} color={habit.color || '#10b981'} />

      <div className={styles.sectionTitle}>Check-in History</div>
      <CheckinHistory checkins={checkins} />
    </div>
  );
}