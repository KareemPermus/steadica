import styles from './ActiveStreaks.module.css';
import { FiZap } from 'react-icons/fi';

interface Props {
  streaks: { habitId: number; habitName: string; currentStreak: number }[];
}

export default function ActiveStreaks({ streaks }: Props) {
  if (!streaks.length) return null;
  const sorted = [...streaks].sort((a, b) => b.currentStreak - a.currentStreak).slice(0, 5);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Active Streaks</h2>
      <div className={styles.list}>
        {sorted.map(s => (
          <div key={s.habitId} className={styles.item}>
            <FiZap className={styles.icon} />
            <span className={styles.name}>{s.habitName}</span>
            <span className={styles.streak}>{s.currentStreak} days</span>
          </div>
        ))}
      </div>
    </section>
  );
}