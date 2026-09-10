import styles from './StatCards.module.css';
import { FiZap, FiCheckCircle, FiAward, FiTarget } from 'react-icons/fi';

interface Props {
  currentStreak: number;
  todayProgress: number;
  bestStreak: number;
  completionRate: number;
}

export default function StatCards({ currentStreak, todayProgress, bestStreak, completionRate }: Props) {
  const cards = [
    { icon: <FiZap />, label: 'Current Streak', value: `${currentStreak} days` },
    { icon: <FiCheckCircle />, label: "Today's Progress", value: `${todayProgress}%` },
    { icon: <FiAward />, label: 'Best Streak', value: `${bestStreak} days` },
    { icon: <FiTarget />, label: 'Completion', value: `${Math.round(completionRate)}%` },
  ];

  return (
    <section className={styles.grid}>
      {cards.map((c) => (
        <div key={c.label} className={styles.card}>
          <div className={styles.label}>{c.icon} {c.label}</div>
          <div className={styles.value}>{c.value}</div>
        </div>
      ))}
    </section>
  );
}