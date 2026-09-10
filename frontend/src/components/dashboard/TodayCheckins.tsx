import styles from './TodayCheckins.module.css';
import { FiCheck } from 'react-icons/fi';

interface Habit {
  id: number;
  name: string;
  frequency: string;
  color: string;
}

interface Checkin {
  id: number;
  habitId: number;
  completed: boolean;
}

interface Props {
  habits: Habit[];
  checkins: Checkin[];
  onToggle: (habitId: number) => void;
}

export default function TodayCheckins({ habits, checkins, onToggle }: Props) {
  const getCheckin = (habitId: number) => checkins.find(c => c.habitId === habitId);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Today's Habits</h2>
      <div className={styles.list}>
        {habits.length === 0 && <p className={styles.empty}>No habits yet. Create one to get started!</p>}
        {habits.map(h => {
          const ci = getCheckin(h.id);
          const done = ci?.completed ?? false;
          return (
            <div key={h.id} className={styles.item}>
              <button
                className={`${styles.toggle} ${done ? styles.toggleDone : ''}`}
                onClick={() => onToggle(h.id)}
                aria-label={done ? 'Mark undone' : 'Mark done'}
              >
                {done && <FiCheck size={14} />}
              </button>
              <div className={styles.icon} style={{ backgroundColor: (h.color || '#10b981') + '15', color: h.color || '#10b981' }}>
                <FiCheck size={16} />
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{h.name}</div>
                <div className={styles.freq}>{h.frequency}</div>
              </div>
              <span className={done ? styles.statusDone : styles.statusPending}>
                {done ? 'Done' : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}