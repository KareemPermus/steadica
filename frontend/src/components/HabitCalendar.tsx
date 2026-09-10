import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths } from 'date-fns';
import { Checkin } from '../types';
import styles from './HabitCalendar.module.css';

interface Props { checkins: Checkin[]; color: string; }

export default function HabitCalendar({ checkins, color }: Props) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const offset = getDay(monthStart);

  const completedSet = useMemo(() => {
    const s = new Set<string>();
    checkins.filter(c => c.completed).forEach(c => s.add(c.date));
    return s;
  }, [checkins]);

  return (
    <div className={styles.card}>
      <div className={styles.monthLabel}>{format(today, 'MMMM yyyy')}</div>
      <div className={styles.weekdays}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className={styles.wd}>{d}</div>)}
      </div>
      <div className={styles.grid}>
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {days.map(day => {
          const key = format(day, 'yyyy-MM-dd');
          const done = completedSet.has(key);
          const isToday = key === format(today, 'yyyy-MM-dd');
          return (
            <div key={key} className={`${styles.day} ${isToday ? styles.today : ''}`}
              style={done ? { background: color, color: '#fff' } : undefined}>
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}