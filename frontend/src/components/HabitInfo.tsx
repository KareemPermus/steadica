import styles from './HabitInfo.module.css';
import { Habit } from '../types';

interface Props {
  habit: Habit & { tags?: { id: number; name: string }[] };
}

export default function HabitInfo({ habit }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.row}><span className={styles.label}>Frequency</span><span>{habit.frequency}</span></div>
      {habit.description && <div className={styles.row}><span className={styles.label}>Description</span><span>{habit.description}</span></div>}
      {habit.tags && habit.tags.length > 0 && (
        <div className={styles.row}>
          <span className={styles.label}>Tags</span>
          <div className={styles.tags}>{habit.tags.map(t => <span key={t.id} className={styles.tag}>{t.name}</span>)}</div>
        </div>
      )}
    </div>
  );
}