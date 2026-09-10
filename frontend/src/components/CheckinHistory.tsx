import { Checkin } from '../types';
import { format, parseISO } from 'date-fns';
import styles from './CheckinHistory.module.css';
import { FiCheck, FiX } from 'react-icons/fi';

interface Props { checkins: Checkin[]; }

export default function CheckinHistory({ checkins }: Props) {
  const sorted = [...checkins].sort((a, b) => (b.date > a.date ? 1 : -1)).slice(0, 20);

  if (!sorted.length) return <p className={styles.empty}>No check-ins yet.</p>;

  return (
    <div className={styles.card}>
      {sorted.map(c => (
        <div key={c.id} className={styles.row}>
          <div className={`${styles.icon} ${c.completed ? styles.done : styles.missed}`}>
            {c.completed ? <FiCheck size={14} /> : <FiX size={14} />}
          </div>
          <div className={styles.date}>{format(parseISO(c.date), 'MMM d, yyyy')}</div>
          {c.note && <div className={styles.note}>{c.note}</div>}
          <div className={`${styles.badge} ${c.completed ? styles.doneBadge : styles.missedBadge}`}>
            {c.completed ? 'Done' : 'Missed'}
          </div>
        </div>
      ))}
    </div>
  );
}